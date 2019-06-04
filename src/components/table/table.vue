<template>
    <div :class="wrapClasses" v-tableHeight="autoHeight">
        <div  v-if="isAutoHeight">
            <table :class="tableClasses"
                   class="headTable"
                   cellspacing="0"
                   cellpadding="0"
                   border="0"
            >
                <thead>
                <tr>
                    <th v-for="(column,i) in tdata.columns"
                        v-show="(!isMobile&&column.visible)||(isMobile&&column.visibleMobile)"
                        :width="column.width">
                        <div :class="[`${prefixCls}-th`,`${prefixCls}-${column.align?column.align:'left'}`,{[`${prefixCls}-th-sortable`]:column.orderable}]"
                             @click="sortColumn(column)">
                            {{column.name}}
                            <div :class="thClasses(column)"
                                 v-show="column.orderable">
                            </div>
                        </div>
                    </th>
                    <th :width="gutterWidth"></th>
                </tr>
                </thead>
            </table>
        </div>
        <div :class="contentClasses" :style="bodyStyles">
            <table :class="tableClasses"
                cellspacing="0"
                cellpadding="0"
                border="0"
            >
                <thead>
                    <tr v-if="!isAutoHeight">
                        <th v-show="isMobile"></th>
                        <th v-for="(column,i) in tdata.columns"
                            v-show="(!isMobile&&column.visible)||(isMobile&&column.visibleMobile)"
                            :width="column.width">
                            <div :class="[`${prefixCls}-th`,`${prefixCls}-${column.align?column.align:'left'}`,{[`${prefixCls}-th-sortable`]:column.orderable}]"
                                @click="sortColumn(column)">
                                {{column.name}}
                                <div :class="thClasses(column)"
                                    v-show="column.orderable">
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(row,i) in renderData">
                        <tr v-if="row['_sTableSign_']==1">
                            <td v-show="isMobile"
                                @click="showColumns(i)">
                                <Icon :type="IconType(renderData,i)"
                                      color="#7f8fa4"
                                      size="12"
                                      class="open-icon"
                                />
                            </td>
                            <td v-for="(column,j) in tdata.columns"
                                v-show="(!isMobile&&column.visible)||(isMobile&&column.visibleMobile)"
                                :width="column.width"
                                :render="column.render"
                            >
                                <Cell :column="column"
                                    :rowIndex="i"
                                    :cellIndex="j"
                                    :row="row"
                                    :cell="row[column['key']]"
                                    :class="tdClasses(column)"
                                >
                                    {{row[column['key']]}}
                                </Cell>
                            </td>
                        </tr>
                        <tr v-if="isMobile"
                            v-show="row['_sTableSign_']==2">
                            <td :colspan="tdata.columns.length"
                                :class="`${prefixCls}-td-mobile-hide`">
                                <div v-for="(column,j) in tdata.columns"
                                    v-show="isMobile&&!column.visibleMobile"
                                    :class="`${prefixCls}-mobile-hide-column`">
                                    <div :class="`${prefixCls}-mobile-hide-name`">{{column['name']}}</div>
                                    <div :class="`${prefixCls}-mobile-hide-value`">{{row[column['key']]}}</div>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div :class="pageClasses"
            v-show="!isMobile">
            <Page :page="tdata.page"
                @on-change-page="changeCurrentPage"
                @on-change-page-size="changePageSize">
            </Page>
        </div>
    </div>
</template>
<script>
import { extend } from '@/libs/util'
import Icon from '_c/icon';
import Cell from './cell.vue';
import Page from './page.vue';
import store from '@/store'
import { mapState,mapMutations } from 'vuex'
import isMobile from "../../mixins/isMobile";
const prefixCls = 's-table';
export default {
    name: "Table",
    directives:{
        'tableHeight':{
            componentUpdated(el,binding,vnode,oldVnode){
                if(!binding.value){
                    return false;
                }
                let reality=el.getBoundingClientRect().height;
                let client=el.parentNode.getBoundingClientRect().height;
                if(reality>client){
                    this.gutterShow=true;
                }
            }
        }
    },
    data() {
        return {
            prefixCls: prefixCls,
            renderData: [],
            gutterWidth:17,
            height:400,
            gutterShow:true
        }
    },
    components: {
        Cell,
        Page,
        Icon,
    },
    props: {
        tdata: {
            type: Object,
            default() {
                return {};
            }
        },
        autoHeight:{
            type: Boolean,
            default:true
        }
    },
    watch: {
        isMobile: function () {
            this.makeRenderData();
        },
        'tdata.conf.searching': function (val) {
            var s = this.tdata.conf.searching;
            if (val != s) {
                // console.log(val)
            }
        }
    },
    computed: {
        ...mapState('basic',[
            'isMobile'
        ]),
        wrapClasses() {
            return [
                `${prefixCls}-wrap`,
                {
                    [`${prefixCls}-wrap-mobile`]: this.isMobile
                }
            ]
        },
        contentClasses() {
            return [
                `${prefixCls}-content`,
                {
                    'fix-height':this.isAutoHeight
                }
            ]
        },
        tableClasses() {
            return [
                `${prefixCls}-table`,
                {
                    [`${prefixCls}-table-mobile`]: this.isMobile
                }
            ]
        },
        pageClasses() {
            return [
                `${prefixCls}-page`
            ]
        },
        bodyStyles(){
            let style={};
            if(this.isAutoHeight){
                style.height=this.height+'px';
            }
            return  style;
        },
        isAutoHeight(){
            return  this.autoHeight&&!this.isMobile&&this.gutterShow
        }
    },
    methods: {
        thClasses(column) {
            return [
                `${prefixCls}-sort`,
                {
                    [`${prefixCls}-sort-asc`]: column.key == this.tdata.conf.ordering,
                    [`${prefixCls}-sort-desc`]: '-' + column.key == this.tdata.conf.ordering
                }
            ]
        },
        changeCurrentPage(page) {
            this.tdata.page.current = page;
            this.reRenderTable();
        },
        changePageSize(len) {
            this.tdata.page.length = len;
            this.reRenderTable();
        },
        getCurrentPage(page) {
            if (page.count == 0 || page.current < 1) {
                page.current = 1;
            }
            this.tdata.page.pages = Math.ceil(page.count / page.length);
            if (page.current > this.tdata.page.pages) {
                page.current = this.tdata.page.pages;
            }
            return page.current;
        },
        makeRenderData() {
            var page = this.tdata.page;
            let start = 1, end = this.tdata.data.length;
            this.renderData = [];
            page.current = this.getCurrentPage(page);
            page.start = (page.current - 1) * page.length + 1;
            page.end = page.current * page.length;
            page.end = page.end > page.count ? page.count : page.end;
            if (!this.tdata.conf.serverSide) {
                start = page.start;
                end = page.end;
            }
            for (let i = start; i <= end; i++) {
                this.renderData.push(extend({ _sTableSign_: 1 }, this.tdata.data[i - 1]));
                if (this.isMobile)//移动端增加重复
                    this.renderData.push(extend({ _sTableSign_: 0 }, this.tdata.data[i - 1]));
            }
        },
        sortColumn(column) {
            if (!column.orderable) {
                return;
            }
            let sort = '', key = this.tdata.conf.ordering;
            if (this.tdata.conf.ordering.indexOf('-') === 0) {
                key = this.tdata.conf.ordering.substring(1);
                sort = '-';
            }
            if (column.key == key) {
                sort = sort == '-' ? '' : '-';
            } else {
                sort = '';
            }
            this.tdata.conf.ordering = sort + column.key;
            this.reRenderTable();
        },
        locationSort() {//没时间写

        },
        getServerData() {
            var t = this.tdata, _this = this, field = [];
            for (let i in t.columns) {
                field.push(t.columns[i]['key'])
            }
        },
        search(searchable) {
            let s=this.tdata.conf.searching
            // for(i in )
        },
        reRenderTable() {
            if (!this.tdata.conf.serverSide) {//本地数据
                this.locationSort();//本地排序
                this.makeRenderData();
            } else {
                this.getServerData();
            }
        },
        showColumns(i) {
            let flag=this.renderData[i + 1]['_sTableSign_'] == 0 ? 2 : 0;
            this.$set(this.renderData[i + 1],'_sTableSign_', flag)
        },
        IconType(val,i){
            if(this.isMobile){
                return val[i + 1]._sTableSign_==2?'retract':'open';
            }
        },
        gutterStyle(){
            /*===============计算滚动条的高度================*/
            let noScroll, scroll, oDiv = document.createElement("DIV");
            oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
            noScroll = document.body.appendChild(oDiv).clientWidth;
            oDiv.style.overflowY = "scroll";
            scroll = oDiv.clientWidth;
            document.body.removeChild(oDiv);
            this.gutterWidth=noScroll - scroll;
        },
        computedHeight(){
            let totalHeight=this.$el.parentNode.getBoundingClientRect().height;
            let contentHeight=this.$el.querySelector('.s-table-content table').getBoundingClientRect().height;
            let headHeight=this.$el.querySelector('.headTable').getBoundingClientRect().height;
            let pageHeight=this.$el.querySelector('.s-table-page').getBoundingClientRect().height+10;
            this.height=totalHeight-headHeight-pageHeight;
        },
        tdClasses(column){
            return [
                `${prefixCls}-td`,
                `${prefixCls}-${column.align?column.align:'left'}`,
            ]
        }
    },
    created() {
        let defaultConf = {
            searching: [],//初始检索项 [{'key':'pv',value:'123',reg:false}]
            ordering: [],//初始排序,
            serverSide: true,//服务器端获取数据,
            url: null,//服务器地址
        };
        let defaultPage = {
            count: 10,//总数据量
            current: 1,//当前页
            length: 10,//初始每页行数
            lengthMenu: [10, 20, 50, 100],//每页显示行数列表
            start: 0,//起始行
            end: 0,//结束行
            pages: 1,//总页数
            showPages: 5,//展示页码量,最小为3
        };
        let defaultColumn = {
            key: 'key',//键
            name: '标题',//标题
            width: null,//固定宽度,不填默认宽度.
            align: 'left',//对齐方式,可选值left,center(默认),right
            searchable: false,//是否可搜索,默认:false
            orderable: false,//是否可排序,默认:false
            visible: true,//是否可见,默认:true
            visibleMobile: false,//移动端是否可见,默认:false
            defaultContent: '',//默认内容

        };
        this.tdata.conf = extend(defaultConf, this.tdata.conf);
        this.tdata.page = extend(defaultPage, this.tdata.page);
        if (this.tdata.columns) {
            let columns = [];
            for (let i = 0; i < this.tdata.columns.length; i++) {
                this.tdata.columns[i] = extend(defaultColumn, this.tdata.columns[i]);
            }
        }
        if (!this.tdata.conf.serverSide) {
            this.tdata.page.count = this.tdata.data.length;
        }
        if (this.tdata.page.showPages < 3) {
            this.tdata.page.showPages = 3;
        }

        this.reRenderTable();
    },
    mounted(){
        if(this.isAutoHeight){
            let self=this;
            this.gutterStyle();
            this.computedHeight();
            window.addEventListener('resize',function () {
                if (!this.timer&&!isMobile) {
                    this.timer = true;
                    setTimeout(()=>{
                        self.gutterStyle();
                        self.computedHeight();
                        this.timer = false;
                    }, 100)
                }
            })
        }



    }
}
</script>
<style lang="less" scoped>
@import "./table.less";
.s-table-page{
    padding-bottom: 10px;
}
.s-table-mobile-hide-column>div{
    white-space:pre-wrap;
    word-break:break-all;
}
.s-home-web{
    .s-table-wrap{
        height: 100%;
    }
    table{
        table-layout:fixed;
    }
}
.fix-height{
        overflow-y: auto;
        overflow-x: hidden;
    }

</style>

