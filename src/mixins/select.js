/*
*  用于select的下拉搜索加载
*
* */
import {api_common} from '@/api'
export default {
    data() {
        return {
            titleFilter:{
                page:1,
                count:10,
                total:0,
                totalPage:0,
                keywords: ''
            },
            titleList:[],
        }
    },
    watch:{
        'titleFilter.page'(){
            this.getTitleInfo();
        },
        'titleFilter.keywords'(){
            this.getTitleInfo();
        },
    },
    created(){
        //this.getTitleInfo();
    },
    methods: {
        async getTitleInfo() {
            let keywords = this.titleFilter.keywords;
            let page = this.titleFilter.page;
            let type=this.$options.name;
            let options = {keywords, page, type};
            let res = await api_common.getTitleList(options);

            let data,total;
            try {
                 data= res['data[]']?res['data[]']:res.data['data[]'];
                 total=res['data[total]']?res['data[total]']:res.data['data[total]'];
            }catch (e) {
                console.log(e);
                data=[];
                 total=0;
            }

            if(page==1){
                this.titleList = data;
            }else{
                this.titleList = [...this.titleList, ...data];
            }
            this.$set(this.titleFilter, 'total', total);
            this.$set(this.titleFilter, 'totalPage',Math.ceil(total/this.titleFilter.count));

        },
        downLoad() {
            if(this.titleFilter.totalPage<=this.titleFilter.page){
                return false;
            }
            this.$set(this.titleFilter, 'page', this.titleFilter.page + 1);
        },
        search(val){
            this.$set(this.titleFilter, 'keywords',val);
            this.$set(this.titleFilter, 'page',1);
            let keyworks;
            Object.keys(this.filterObj).forEach(item=>{
                if(item.includes('$')){
                    keyworks=item;
                }
            });
            this.$set(this.filterObj,keyworks,val);
        },
    },
}
