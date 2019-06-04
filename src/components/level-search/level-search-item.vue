<!--
    Author:hezhongyi
    Date:2018-11-19
    Description:多级select主件

    使用案例：
    参数	        说明	             类型	                可选值	                默认值
    value           组件绑定的值         Array                   -                      -
    items           下拉选项的值         Array                   -                      -
    styles          预设的样式           Object                  -                      -
    defaultProps    预设的对象           Object                  -                      {children: 'children', label: 'label'}
    triangle        是否显示三角下拉按钮 Boolean                 -                      true
    button          是否显示确定和清除按钮 Boolean               -                      false
    barHeight       滚动条的高度          Number                 -                      270


    事件：
    事件名称	        说明	                            回调参数
    change	            点击下一个列按钮触发	            目前的选中值

-->
<template>
    <div>
        <div class="search-ul" :class="divClass" :style="divStyle" v-show="isShow">
        <div class="li-title" v-if="title">{{title}}</div>
        <ul class="height-auto" :style="ulStyle" @scroll="menuScroll($event)">
            <li v-for="(item,i) in items" class="item-li"
                :label="item[defaultProps.label]" :title="item[defaultProps.label]"
                :class="{
                        'is-checked': i+1=== selectItem.index
                }"
            >
                    <span class="radio" @click="liClick({item,index:i+1},$event)">
                        <input type="checkbox" class="inputClasses">
                    </span>
                <span class="item-text" @click="triggerLiClick($event)" :ref="'item'+i">{{item[defaultProps.label]}}</span>
                <span class="triangle-right" v-show="item[defaultProps.children]" @click="triggerLiClick"></span>
            </li>
        </ul>
        <div class="button-box" v-if="button">
            <sm-button type="primary" size="stretch" @click.native="submit" class="submit">确定</sm-button>
            <sm-button size="stretch" class="ml10 clear"  @click.native="clear">消除</sm-button>
        </div>
    </div>
    </div>
</template>
<script>
    import Button from "_c/button";
    import { throttle } from 'lodash'
    import {domScroll} from "@/mixins";
    export default {
        name: "ulItem",
        componentName:'ulItem',
        mixins: [domScroll],
        props:{
            value:[String,Number,Array,Object],
            // 最上面的标题名字
            title:{
                type:String,
                default:'',
            },
            //下拉框的选项
            items:{
                type:Array,
                default(){
                    return []
                }
            },
            //最外层的样式设定
            styles:{
                type:Object,
                default(){
                    return {}
                }
            },
            //配置选项
            defaultProps:{
                type:Object,
                default() {
                    return {
                        children: 'children',  //指定子树为节点对象的某个属性值
                        label: 'label'      //指定节点标签为节点对象的某个属性值
                    };
                }
            },
            defaultValue:{
                type:String,
                default:''
            },
            //每项后面的下拉按钮
            triangle:{
                type:Boolean,
                default:true,
            },
            //是否显示下面的button功能，确定和清除按钮
            button:{
                type:Boolean,
                default:false,
            },
            //滚动条的高度
            barHeight:{
                type:Number,
                default:283,
            },
        },
        inject: ['select'],
        model: {
            event: 'modelUpdate',
        },
        data(){
            return {
                isShow:false,
                isDisabled:false,
                selectItem:{
                    item:{},
                    index:null
                },
            }
        },
        methods:{
            ulShow(e){
                this.isShow=true;
            },
            DocumentClick(e){
                if(!this.$parent.$el.contains(e.target)){
                    let $ul=this.$el.querySelector('.height-auto');
                    $ul.scrollTop=0;
                    this.isShow=false;
                }
            },
            reset(target){
                //清空对应ckecked的勾选和三角的classname
                if(this.selectItem.index){
                    let inputDom=this.$el.querySelectorAll('.inputClasses')[this.selectItem.index-1];
                    inputDom.checked=false;
                    inputDom.parentElement.parentElement.querySelector('.triangle-right').className='triangle-right';
                }
                this.selectItem={
                    item:{},
                    index:null
                };
                this.$emit('modelUpdate','');
                this.$emit('change',[]);
                this.isDisabled=false;
            },
            liClick(data,event){
                //未选中状态+对应的index正确
                let triangleDom=event.target.parentElement.parentElement.querySelector('.triangle-right');
                if(event.target.checked&&(!this.selectItem.index||data.index===this.selectItem.index)){
                    this.selectItem=data;
                    //this.isDisabled=true;
                    triangleDom.className='triangle-right triangle-left';
                    this.$emit('modelUpdate',this.defaultValue?data.item[this.defaultValue]:data);
                    this.$emit('change',data.item);
                //选中状态+对应的index正确
                }else if(!event.target.checked){
                    this.reset();
                //未选中状态+对应的index不正确
                }else {
                    this.reset();
                    setTimeout(()=>{
                        this.selectItem=data;
                        this.isDisabled=true;
                        triangleDom.className='triangle-right triangle-left';
                        this.$emit('modelUpdate',this.defaultValue?data.item[this.defaultValue]:data);
                        this.$emit('change',data.item);
                    });
                }
            },
            clear(){
                this.select.clear(this.selectItem);
            },
            submit(){
                console.log(this.selectItem);
                this.select.submit();
            },
            triggerLiClick(event){
                event.target.parentElement.querySelector('.inputClasses').click();
            },
            toShow(target,other){
                let self=this;
                //搜索部分的点击
                if(other){
                    self.isShow=false;
                    return false;
                }
                if(!self.isShow){
                    self.ulShow()
                }else{
                    (
                        !self.$parent.$el.querySelector('.item-box').contains(target)     //不属于item-box的地方点击关闭
                        ||(self.$parent.$el.querySelector('.submit') && self.$parent.$el.querySelector('.submit').contains(target))     //submit 确定按钮点击关闭
                    )&&(self.isShow=false);
                }
            },
            selectChooseItem() {
                for (let i = 0; i < this.items.length; i++) {
                    if (this.value === this.items[i].value) {
                        let ref = this.$refs['item'+i][0];
                        if (ref.parentElement.querySelector('.inputClasses') && ref.parentElement.querySelector('.inputClasses').checked !== true) {
                            ref.click();
                        }
                    }
                }
            }
        },
        mounted(){
            //点击页面就出发click方法
            document.addEventListener('click',this.DocumentClick);
            this.$on('toShow', this.toShow);
            this.$on('reset', this.reset);
        },
        computed:{
            disabledClass() {
                return [this.disabled?'disabled':''];
            },
            divClass() {
                return [this.isDisabled?'disabled':''];
            },
            divStyle(){
                let styles = {},
                    self=this,
                    length=Object.keys(this.styles).length;
                if(length>0){
                    Object.keys(this.styles).forEach(item=>{
                        styles[item]=self.styles[item];
                    });
                }
                return styles;
            },
            ulStyle(){
                let styles = {};
                //这里的46为button-box的高度
                (this.button)?(styles.height=this.barHeight-46+'px'):(styles.height=this.barHeight+'px');
                return styles;
            },
           
    },
    beforeDestroy(){
        //注销对应的事件
        document.removeEventListener('click',this.DocumentClick);
    },
    components: {
        'sm-button':Button,
    },
    updated() {
        this.selectChooseItem();
    }
}
</script>
<style scoped>
    .none{
        display: none;
    }
    .relative{
        position: relative;
    }
    .search-ul{
        width: 169px;
        background-color: #ffffff;
        box-shadow: 0px 6px 16px 0px
        rgba(127, 143, 164, 0.15);
        border-radius: 2px;
        border: solid 1px #dfe2e6;
        position: absolute;
        left: 0;
        bottom: -5px;
        transform: translateY(100%);
    }
    .height-auto{
        height: 237px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .search-ul .item-li,.li-title{
        margin-top: 11px;
        font-size: 14px;
        padding: 0 30px  0 15px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #354052;
        height: 28px;
        line-height: 28px;
        box-sizing: border-box;
        cursor: pointer;
        text-align: left;
}

    .search-ul .item-li:hover{
        color: #2198f0;
    }
    .search-ul .item-li:hover .triangle-right{
        border-right: 1px solid #2198f0;
        border-bottom: 1px solid #2198f0;
    }
    .search-ul .li-title{
        font-size: 14px;
        font-weight: bold;
        font-stretch: normal;
        color: #354052;
        cursor: default;
    }
    .radio{
        display:inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: solid 1px #dfe2e6;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    .radio:hover{
        border: solid 1px #2198f0;
    }
    .is-checked .radio{
        background-color: #2198f0;
        border: solid 1px #2198f0;
    }
    .is-checked .radio:after{
        content: '';
        display: block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        -ms-transform:translate(-50%,-50%);   /* IE 9 */
        -moz-transform:translate(-50%,-50%);  /* Firefox */
        -webkit-transform:translate(-50%,-50%);/* Safari 和 Chrome */
        -o-transform:translate(-50%,-50%);    /* Opera */
    }
    .search-ul  .height-auto .is-checked {
        color: #2198f0;
    }
    .is-checked .triangle-right{
        border-right: 1px solid #2198f0;
        border-bottom: 1px solid #2198f0;
    }
    .is-checked{
        cursor: pointer!important;
    }
    .item-text{
        margin-left: 26px;
    }
    .triangle-right{
        display: block;
        width: 5px;
        height: 5px;
        border-right: 1px solid #7f8fa4;
        border-bottom: 1px solid #7f8fa4;
        position: absolute;
        top: 16px;
        -webkit-transform: rotate(-45deg) translateY(-50%);
        transform: rotate(-45deg) translateY(-50%);
        right: 18px;
        transition: all .3s;
    }
    .inputClasses{
        opacity: 0;
        display:inline-block;
        width: 16px;
        height: 16px;
        position: absolute;
        top: 0;
        left: 0;
        transform: scale(1.5);
        z-index: 10;
    }
    .item-box .search-ul .is-disabled{
        cursor: not-allowed;
    }
    .disabled .is-checked input[type='checkbox']{
        cursor: pointer;
    }

    .search-ul .triangle-left{
        transform: rotate(135deg);
    }
    .button-box{
        padding-bottom: 10px;
        text-align: center;
        background-color: #fff;
    }
    .ml10{
        margin-left: 10px;
    }
</style>
