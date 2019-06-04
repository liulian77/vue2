<!--
    Author:hezhongyi
    Date:2018-11-19
    Description:搜索组件

    使用案例：
    参数	        说明	                     类型	                可选值	                默认值
    width           决定整体input的宽度          Number,String          -                       -
    height          决定整体input的高度          Number,String          -                       36
    items           搜索出来的项目               Array                  -                       []
    pretext         没有关键字时的预设文字       String                 -                       -
    disabled        是否禁用                     Boolean                false/true              false
    Level           是否开启层级模式             Boolean                false/true              false
    defaultProps    多层级开启以后的配置文件     Object                 -           {children: 'children',  //指定子树为节点对象的某个属性值label: 'label'      //指定节点标签为节点对象的某个属性值}

    事件：
    事件名称	        说明	                            回调参数
    search	            搜索触发的事件                      搜索的关键词

-->
<template>
    <div class="container relative"        v-clickoutside="handleClose">
        <div class="search-box" @click="ulShow" :style="boxStyles">
            <sm-icon type="search" :size="15" color="#ebedf2" class="search" :style="IconStyles" />
            <input type="text"   class="search-btn" v-model="keyWords" :placeholder="pretext">
        </div>
        <ul class="search-ul" :class="ulClass">
            <li v-for="(item,i) in items"  class="item-li"  v-if="!Level"
                @click="change(item)"  :title="item[defaultProps.label]" v-html="searchHtml(item[defaultProps.label]) "
            ></li>
            <template v-if="Level" v-for="(item,i) in items">
                <li class="title-li"
                    :title="item[defaultProps.label]"
                >{{item[defaultProps.label]}}</li>

                <li class="item-li" @click="change(val)"
                    :title="val[defaultProps.label]"
                    v-html="searchHtml(val[defaultProps.label])"
                    v-for="val in item[defaultProps.children]"
                >
                </li>
            </template>
        </ul>
    </div>
</template>

<script>
    import Icon from "_c/icon";
    import Clickoutside from '@/mixins/clickoutside';
    export default {
        name: "Search",
        directives: { Clickoutside },
        props:{
            /*
            * width决定整体input的宽度
            * */
            width: {
                //type: Number,
                //default: 200
            },
            /*
            * height决定整体input的宽度
            * */
            height: {
                //type: Number,
                default: 36
            },
            items:{
                type:Array
            },
            /*
            * 预设的文本,未选中时显示的文本
            * */
            pretext:{
                //type:String
            },
            /*
            * input能不能点击
            * */
            disabled:{
                default: false
            },
            /*
            * 编辑文件时清空的默认文字
            * */
            edit:{
                default:false
            },
            /*
            * 是否开启多层级功能
            * */
            Level:{
                type:Boolean,
                default: false
            },
            /*
            *  多层级功能开启以后配置选项
            * */
            defaultProps:{
                type:Object,
                default() {
                    return {
                        children: 'children',  //指定子树为节点对象的某个属性值
                        label: 'label'      //指定节点标签为节点对象的某个属性值
                    };
                }
            }
        },
        /*===============绑定组件的model 直接赋值==========================*/
        model: {
            //prop: 'items',//绑定的值，通过父组件传递
            event: 'modelUpdate',//自定义事件名,触发事件更新model值
        },
        data(){
            return {
                isShow:false,
                keyWords:''
            }
        },
        methods:{
            ulShow(e){
                if(this.disabled){
                    return false;
                }
                this.reset();
                let $btn=this.$el.querySelector('.search-btn');
                let $ul=this.$el.querySelector('.search-ul');
                setTimeout(()=>{
                    $btn.focus();
                    $ul.scrollTo(0,0);
                },0);
                this.isShow=true;
            },
            reset(){
                this.keyWords='';
            },
            /*==============================过滤script非法标签，防止注入===========================================*/
            hasIllegalChar(str){
                return new RegExp(".*?script[^>]*?.*?(<\/.*?script.*?>)*", "ig").test(str);
            },
            /*==============================高亮选项===========================================*/
            colorFont(keyWords,val){
                // 匹配关键字正则
                let replaceReg = new RegExp(keyWords, 'g');
                // 高亮替换v-html值
                let replaceString =`<span style="color: #2a9ff6;" class="keyWords">${keyWords}</span>`;
                val = val.replace(
                    replaceReg,
                    replaceString
                );
                return val;
            },
            searchHtml(val){
                (this.keyWords && this.keyWords.length > 0)&&(val=this.colorFont(this.keyWords,val));
                return val;
            },
            change(data){
                this.keyWords=data[this.defaultProps.label];
                this.isShow=false;
            },
            handleClose(){
                this.isShow=false;
            }
        },
        mounted(){

        },
        watch:{
            keyWords(val){
                //防xss
                (this.hasIllegalChar(val))&&(this.reset());
                (this.keyWords.length)&&(this.$emit('search',val));
                this.$emit('modelUpdate',val)
            }
        },
        computed:{
            boxStyles() {
                let styles = {};
                if(typeof this.width === 'number'){
                    styles.width=this.width+'px';
                }else {
                    styles.width=this.width;
                }
                if(typeof this.height === 'number'){
                    styles.height=this.height+'px';
                }
                return styles;
            },
            disabledClass() {
                let disabledClass= [this.disabled?'disabled':''];
                return disabledClass;
            },
            ulClass() {
                let upClass= [this.isShow?'':'none'];
                return upClass;
            },
            IconStyles(){
                /*
                *   实际高度=height-padding-border
                * */
                let styles = {
                    'line-height': (this.height-(10*2+1*2))+'px'
                };
                return styles;
            },
        },
        components: {
            'sm-icon':Icon
        }
    }
</script>
<style scoped>
    .container{
        display: inline-block;
    }
    .none{
        display: none;
    }
    .relative{
        position: relative;
    }
    .search-box{
        width: 270px;
        height: 36px;
        background-color: #ffffff;
        border-radius: 2px;
        border: solid 1px #dfe2e6;
        padding: 10px  12px;
        display: flex;
    }
    .search-box input[type='text']{
        flex: 1;
        padding-left: 10px;
        -webkit-appearance: none;
        background-image: none;
        background-color: #ffffff;
        box-sizing: border-box;
        font-size: 14px;
        color: #354052;
        display: inline-block;
        outline: none;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        cursor: pointer;
        border-radius: 2px;
        border: none;
        caret-color:#2198f0;
    }
    .Icon{
        width: 15px;
    }
    .search-ul{
        width: 270px;
        max-height: 320px;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #ffffff;
        box-shadow: 0px 6px 18px 0px rgba(37, 46, 61, 0.08);
        border-radius: 2px;
        border: solid 1px #dfe2e6;
        position: absolute;
        left: 0;
        bottom: -10px;
        transform: translateY(100%);
        z-index: 10;
    }
    .search-ul li{
        margin: 11px 0;
        font-size: 14px;
        padding: 0 30px  0 15px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #354052;
        height: 32px;
        line-height: 32px;
        box-sizing: border-box;
        cursor: pointer;
        text-align: left;
    }

    .search-ul .item-li:hover{
        background-color: #2a9ff6;
        color: #fff;
    }
    .search-ul .title-li{
        font-size: 14px;
        font-weight: bold;
        font-stretch: normal;
        color: #354052;
        cursor: default;
    }
    .search-ul .item-li{
        color: #7f8fa4;
    }
    >>>.search-ul .item-li:hover span{
        color: #fff!important;
    }
</style>
