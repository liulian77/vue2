import { mapState } from 'vuex'
import { api_global } from '@/api'
import { assignDeep } from '@/utils'
import { Dialog } from '_c/dialog'
import { debounce } from 'lodash'
import {getStyle} from '@/utils/assist'
import {deepCopy} from '@/utils/assist'
import { api_common } from '@/api'
import { LoadingBar } from 'iview'

export default {
    data() {
        return {
            loading: false,//table加载前的loading判断
            totalCount: 0, //page的总个数
            id:'',  //列表项查询时对应的id
            popType: 'add',
            editForm: false,  //是否开启新增，编辑弹窗
        }
    },
    computed: {
        ...mapState('basic', [
            'isMobile'
        ]),
    },
    watch: {
        //筛选对象的变化
        filterObj: {
            handler:debounce(function () {
                this.getElseData&&this.getElseData();
                this.getTableData()
            },200),
            deep: true
        },
        //新增是否开启
        editForm(val){
            if(!val){
                this.id='';
            }
        }
    },
    created() {
        this.getTableData();
    },
    activated() {
        this.getTableData();
    },
    mounted(){
        this.getTableHeight();
        let self=this;
        window.addEventListener('resize',debounce(function () {
            self.getTableHeight();
        },200))
    },
    beforeDestroy(){
        let self=this;
        window.removeEventListener('resize',debounce(function () {
            self.getTableHeight();
        },200));
    },
    methods: {
        //对表单请求参数的参数的处理
        getQuery() {
            const isNone = field => field == undefined || field === '';
            let filterObj=deepCopy(this.filterObj);
            let query = {};
            let url=this.getUrl;
            let options={url};
            //对filterObj遍历，没有值的属性删除，有的保留
            Object.keys(filterObj).forEach(item=>{
                if(isNone(filterObj[item])){
                    delete filterObj[item]
                }else{
                    query[item]=filterObj[item];
                }
            });
            if(this.isFuzzy){
                if(this.fuzzyDel&&this.fuzzyDel.length>0){
                    this.fuzzyDel.forEach(item=>{
                        delete filterObj[item];
                    })
                }
                let fuzzy=Object.keys(filterObj).join(',');
                !isNone(fuzzy)&&(query.fuzzy=fuzzy);
                options.data=query
            }
            options.data=query;
            return options
        },
        //获取表单数据
        async getTableData() {
            if(!this.getUrl)return false;
            this.loading=true;
            try {
                let res = await api_global.getList(this.getQuery());

                let totalCount, tableData;

                if (res.data) {
                    totalCount = res.count ? res.count : res.data.length;
                    tableData = res.data;
                } else if (res.aaData) {
                    totalCount = res.count ? res.count : res.aaData.length;
                    tableData = res.aaData;
                } else if (res.list) {
                    totalCount = res.count ? res.count : res.list.length;
                    tableData = res.list;
                }
                this.loading = false;
                this.totalCount = totalCount;
                this.tableData = tableData
            }catch (e) {this.loading = false;}

        },
        // 翻页
        handleChangePage(page) {
              this.$set(this.filterObj,'page',page);
        },
        // 每页显示量
        handleChangeSizePage(count) {
            this.$set(this.filterObj,'row',count);
        },
        // 后端排序事件(未考虑联合排序)
        handleSortChange({ column, order }) {
/*            this.getTableData()*/
        },
        // 单条数据编辑
        update(row) {
            this.editForm=true;
            this.popType='edit';
            this.id=row._id;
        },
        // 单条数据查看
        checkRow(row) {
            this.editForm=true;
            this.popType='check';
            this.id=row._id;
        },
        // 删除单条数据
        del(row) {},
        async handleDel(id){
            let res =await api_common.delList(this.tableReq.tableName,id);
            let self=this;
            Dialog({
                type: 'default',
                text: '操作成功',
                onConfirm(){
                    self.getTableData();
                },
                onCancel(){
                    self.getTableData();
                }
            });
        },
        // 状态开关
        async handleSwitch(row,name) {
           /* let query=Object.assign({},{
                "_id":row._id,
                [name||"status"]:row[name||"status"]
            });
            try {
                let res = await api_common.updateList(this.tableReq.tableName,query);
                Dialog({
                    type: 'default',
                    text: '操作成功',
                });
            }catch (e) {
                 this.getTableData();
            } */
        },
        //状态切换前的确定弹窗
        async beforeSwitchChange(val, data){
            if (data) {
                if (data.enable === 2) {
                    return api_common.handleWaring({success:(flag)=>false,
                                fail:()=>{
                                    console.log('fail');
                                    return false},text:this.switchWarningInfo});
                } else {
                    let options={
                        url: this.changeStatusUrl,
                        data: {
                            _id: data._id,
                            status: val
                        }
                    };
                    LoadingBar.start();
                    try {
                        let res = await api_global.postMessage(options);
                        let self=this;
                        LoadingBar.finish();
                        Dialog({
                            type: 'default',
                            text: '操作成功',
                            onConfirm(){
                                self.submitSuccess();
                            },
                            onCancel(){
                                self.submitSuccess();
                            }
                        });
                    }catch (e) {}
                }
            }
        },
        //编辑成功后的回调
        submitSuccess(){
            this.editForm=false;
            this.getTableData();
        },
        // 自动设置表格高度
        getTableHeight(){
            if(this.$refs.table&&this.$refs.tableContent){
                let tableTop=this.$refs.table.$el.getBoundingClientRect().top;  //table距离顶部的高度
                let pageHeight=parseInt(getStyle(this.$refs.tableContent.$el, 'padding-bottom'))+parseInt(getStyle(this.$refs.tableContent.$el, 'margin-bottom'))+80;  //page的高度
                this.tableHeight=window.innerHeight - tableTop - pageHeight;
            }
        }

    },
}
