<!--

    Author:hezhongyi
    Date:2019-5-18
    Description: 下来搜索滚动加载

    使用案例：
    Select Attributes
    参数	        说明	            类型	                可选值	        默认值
    list            下拉的数组          Array                    -              []
    value           下拉的选中值        String,Array,Number      -              -
    name            下拉对象默认的key   String                   -              _id
    label           下来选中的值        String                   -              name

    事件：
    事件名称	        说明	                            回调参数
    change	            选中值发生变化时触发	            目前的选中值
    dataChange	        list需要刷新	                    搜索关键词


-->


<template>
    <div class="flex app-list">
        <Icon type="search" :size="15" color="#ebedf2" class="search"/>
        <Select v-model="model" filterable ref="select" @on-query-change="queryChange" :placeholder="placeholder">
            <Option v-if="showAll" value="">{{all}}</Option>
            <template v-if="!image">
                <Option v-for="(item,i) in list" :value="item[name]" :key="'a'+i"  >{{item[label]}}</Option>
            </template>
            <template v-else>
                <Option
                        v-for="(item, index) in list"
                        :key="id+'-'+index"
                        :value="item[name]"
                        class="option-item"
                        :label="item[label]"
                >
                    <div>
                        <img :src="`${domain.static}${item.icon}`" alt>
                    </div>
                    <div class="sec">
                        <p>{{item[label]}}</p>
                    </div>
                </Option>
            </template>
        </Select>
    </div>

</template>

<script>
    import {Select,Option} from 'iview';
    import {Icon} from '_c';
    import {throttle} from 'lodash'
    import {mapState} from 'vuex'
    const components={
        Select,
        Option,
        Icon
    };
    export default {
        name: "index",
        components,
        props:{
           list:{
               default(){
                   return []
               }
           },
           value:[String,Array,Number],
           name:{
               type:String,
               default:'_id'
           },
           label:{
               type:String,
               default:'name'
           },
           image:{
               type:Boolean,
               default:true
           },
           all:{
               type:String,
               default:'所有应用'
           },
           showAll: {
               type: Boolean, 
               default: true
           },
           placeholder: {
               type: String,
               default: '所有应用'
           }
        },
        data(){
            return {
                model:this.value
            }
        },
        model: {
            event: 'modelUpdate',//自定义事件名,触发事件更新model值
        },
        computed:{
            ...mapState('basic', ['domain']),
        },
        watch:{
            model(val){
                this.$emit('modelUpdate', val);
                this.$emit('change',val);
            }
        },
        methods:{
            //关键词搜索
            queryChange(val){
                this.$emit('queryChange',val.trim());
            },
            //到达底部
            toBottom(){
                this.$emit('dataChange');
            },
            //判断是否到达底部
            isBottom(dropdown,totalDom){
                let top=dropdown.scrollTop; //滚动距离
                let total=totalDom.getBoundingClientRect().height; //滚动的整体宽度
                let height=dropdown.getBoundingClientRect().height; //显示的高度    10为padding
                let bottom=total-top-height-10;
                if(bottom<20){
                    this.toBottom();
                }
            },
        },
        mounted(){
            let self=this;
            //监听滚动
            this.$nextTick(function () {
                let dropdown=this.$refs.select.$el.querySelector('.ivu-select-dropdown');
                let totalDom=this.$refs.select.$el.querySelector('.ivu-select-dropdown-list');
                dropdown.addEventListener('scroll',throttle(function (){
                    self.isBottom(dropdown,totalDom);
                },500),false);
            });
        },
        beforeDestroy(){
            let dropdown=this.$refs.select.$el.querySelector('.ivu-select-dropdown');
            let totalDom=this.$refs.select.$el.querySelector('.ivu-select-dropdown-list');
            dropdown.removeEventListener('scroll',throttle(function (){
                self.isBottom(dropdown,totalDom);
            },500),false);
        },
        created(){
            this.id=this._uid;
        }
    }
</script>

<style scoped lang="less">
.flex{
    display: flex;
    position: relative;
    width: 270px;
}
.search{
    position: absolute;
    top: 50%;
    left: 5px;
    transform: translateY(-50%);
    z-index: 20;
}
/deep/ .ivu-select-input {
    padding: 0 24px 0 25px;
}

.app-list {
    img {
        width: 34px;
        margin-top: 4px;
        margin-right: 10px;
        border-radius: 50%;
    }
    .option-item {
        display: flex;
        align-items: center;
    }
}
</style>
