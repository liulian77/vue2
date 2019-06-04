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
    <div class="search-ul" :class="divClass" :style="divStyle">
        <ul class="height-auto" :style="ulStyle">
            <li v-for="(item,i) in items" class="item-li"
                :label="item[defaultProps.label]" :title="item[defaultProps.label]"
                :class="{
                        'is-disabled': isDisabled,
                        'is-checked': checkedList[i]
                }"
            >
                    <span class="radio" @click="liClick({item,index:i},$event)">
                        <input type="checkbox" class="inputClasses" v-model="checkedList[i]">
                    </span>
                <span class="item-text" @click="triggerLiClick($event)">{{item[defaultProps.label]}}</span>
                <span class="triangle-right"
                      v-show="triangle&&triangleShow(item)"
                      @click="triangleClick({item,index:i+1},$event)">
                </span>
            </li>
        </ul>
        <div class="button-box" v-if="button">
            <sm-button type="primary" size="stretch" @click.native="submit" class="submit">确定</sm-button>
            <sm-button size="stretch" class="ml10 clear"  @click.native="clear">消除</sm-button>
        </div>
    </div>
</template>
<script>
    import Button from "_c/button";
    import { deepCopy } from '@/utils/assist'
    export default {
        name: "ulItem",
        componentName:'ulItem',
        inject: ['LevelCheckbox'],
        props:{
            value:[Array,String,Object,Number],
            items:{
                type:Array
            },
            styles:{
                type:Object,
                default(){
                    return {}
                }
            },
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
            //是否显示三角形的下拉按钮
            triangle:{
                type:Boolean,
                default:true,
            },
            //是否显示下面的button功能，确定和清除按钮
            button:{
                type:Boolean,
                default:false,
            },
            barHeight:{
                type:Number,
                default:270,
            }
        },
        model: {
            event: 'modelUpdate',
        },
        data(){
            return {
                isShow:false,
                isDisabled:false,
                selectItem:[],
                name:'ulItem',
                checkedList:[],
            }
        },
        methods:{
            ulShow(e){
                this.isShow=true;
            },
            DocumentClick(e){
                if(!this.$parent.$el.contains(e.target)){
                    let $ul=this.$el.querySelector('.height-auto');
                    //$ul.scrollTo(0,0);
                    $ul.scrollTop=0;
                    this.isShow=false;
                }
            },
            reset(target){
                //清空对应ckecked的勾选和三角的classname
                (this.$el.querySelectorAll('.triangle-left').length)&&
                (this.$el.querySelectorAll('.triangle-left')[0].className='triangle-right');
                if(this.selectItem.length>0){
                    let inputDom=this.$el.querySelectorAll('.inputClasses');
                    [...inputDom].forEach(item=>{
                       item.checked=false;
                    });
                }

                //清空存储选中数组数据
                this.selectItem=[];
                this.$emit('modelUpdate',[]);
                let  self=this,
                      arr=[];
                this.items.forEach((item,i)=>{
                    arr.push(false);
                });
                self.checkedList=arr;
            },
            liClick(data,event){
                //未选中状态+对应的index正确
                let self=this;
                // data.item.id=this._uid;
                data.item.index=data.index;
                if(event.target.checked){
                    if (this.LevelCheckbox.limit) {
                        let arr = [];
                        this.selectItem.forEach(item => {
                            if (item.level === data.item.level) {
                                arr.push(item);
                            } else {
                                this.$set(this.checkedList,item.index,false);
                            }
                        });
                        arr.push(data.item);
                        this.selectItem = arr;
                        this.$emit('modelUpdate',this.selectItem);
                    } else {
                        this.$set(this.checkedList,data.index,true);
                        this.selectItem.push(data.item);
                        this.$emit('modelUpdate',this.selectItem);
                    }
                }else{
                    this.del(data.item);
                }
                this.$nextTick(() => {
                    self.LevelCheckbox.submit(event.target.checked ? data.item : null);
                });
            },
            clear(){
                this.LevelCheckbox.clear();
            },
            submit(){
                this.LevelCheckbox.submit();
                //this.$emit('submit',this.selectItem);
            },
            triangleShow(data){
                let children=this.defaultProps.children;
                return data[children]&&data[children].length>0;
            },
            /*============右箭头点击后的效果判断============*/
            triangleClick(data,event){
                let leftFlag=(event.target.className==='triangle-right triangle-left');
                //未选中状态+对应的index正确
                if (!leftFlag&&(!this.triangleIndex||data.index===this.triangleIndex)){
                    event.target.className='triangle-right triangle-left';
                    this.triangleIndex=data.index;
                    this.$emit('change',data);
                    //选中状态+对应的index正确
                }else if(leftFlag){
                    event.target.className='triangle-right';
                    this.$emit('change',null);
                    //未选中状态+对应的index不正确
                }else {
                    event.target.className='triangle-right triangle-left';
                    this.$el.querySelectorAll('.triangle-right')[this.triangleIndex-1].className='triangle-right';
                    this.triangleIndex=data.index;
                    this.$emit('change',data);
                }
            },
            /*============删除对应的单个选项========================*/
            del(data){
                let inputDom=this.$el.querySelectorAll('.inputClasses')[data.index];
                inputDom.checked=false;
                let self=this;
                this.$set(this.checkedList,data.index,false);
                this.selectItem.forEach((item,i)=>{
                    (item[self.defaultProps.label]==data[self.defaultProps.label])&&( self.selectItem.splice(i,1));
                });
                this.$emit('modelUpdate',this.selectItem);
            },
            triggerLiClick(event){
                event.target.parentElement.querySelector('.inputClasses').click();
            },
            bindData(){
                let self=this;
                let LevelCheckbox=deepCopy(this.LevelCheckbox.value);
                let items=deepCopy(this.items);
                let parentId, flag = 0;
                if (this.LevelCheckbox.customValue === 'geo') {
                    parentId = this.items[0].parent_id;
                    flag = 0;
                    LevelCheckbox.forEach(item => {
                        if (parentId) {
                            if (item[this.LevelCheckbox.propertyName] === parentId) {
                                flag = 1;
                            } else {
                                if (item.son) {
                                    item.son.forEach(val => {
                                        if (val[this.LevelCheckbox.propertyName] === parentId) {
                                            flag = 1;
                                        }
                                    })
                                }
                            }
                        }
                    });
                } 
                if(LevelCheckbox.length>0){
                    self.checkedList=[];
                    items.forEach((item,i)=>{
                        if (self.LevelCheckbox.customValue === 'geo') {
                            if (flag) {
                                self.selectItem.push(item);
                                self.checkedList.push(true);
                            } else {
                                let flage = false;
                                LevelCheckbox.forEach(val => {
                                    if (val[this.LevelCheckbox.propertyName] === item[this.LevelCheckbox.propertyName]) {
                                       flage = true;
                                    }
                                });
                                if (flage) {
                                    self.selectItem.push(item);
                                    self.checkedList.push(true);
                                } else {
                                    self.checkedList.push(false);
                                }
                            }
                        } else {
                            if(LevelCheckbox.includes(item[this.defaultValue?this.defaultValue:this.defaultProps.label])){
                                this.selectItem.push(item);
                                this.$emit('modelUpdate',this.selectItem);
                                this.LevelCheckbox.labels.push(item);
                                self.checkedList.push(true);
                            }else {
                                self.checkedList.push(false);
                            }
                        }
                    });
                }else{
                    items.forEach((item,i)=>{
                        self.checkedList.push(false);
                    });
                }
            },
        },
        mounted(){
            document.addEventListener('click',this.DocumentClick);
        },
        computed:{
            disabledClass() {
                return [this.disabled?'disabled':''];
            },
            divClass() {
                return [
                    this.isShow?'':'none',
                    this.isDisabled?'disabled':''
                ];
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
            }
    },
        created(){
            this.bindData();
            this.$on('bindData', this.bindData);
        },
        beforeDestroy(){
            document.removeEventListener('click',this.DocumentClick);
        },
        components: {
            'sm-button':Button,
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
        height: 290px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .search-ul .item-li,.li-title{
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
        border: solid 1px #dfe2e6;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    .radio:hover{
        border: solid 1px #2198f0;
    }
    .search-ul .item-li:hover{
        color: #2198f0;
    }
    .search-ul .item-li:hover .triangle-right{
        border-right: 1px solid #2198f0;
        border-bottom: 1px solid #2198f0;
    }
    .search-ul .height-auto .is-checked {
        color: #2198f0;
    }
    .is-checked .triangle-right{
        border-right: 1px solid #2198f0;
        border-bottom: 1px solid #2198f0;
    }
    .is-checked .radio{
        background-color: #2198f0;
        border: solid 1px #2198f0;
    }
    .is-checked .radio:after{
        content: '';
        display: block;
        width: 6px;
        height: 10px;
        border-right: 2px solid #fff;
        border-bottom: 2px solid #fff;
        position: absolute;
        top: 40%;
        left: 50%;
        border-radius: 2px;
        transform: translate(-50%,-50%) rotate(45deg);
        -ms-transform:translate(-50%,-50%) rotate(45deg);   /* IE 9 */
        -moz-transform:translate(-50%,-50%) rotate(45deg);  /* Firefox */
        -webkit-transform:translate(-50%,-50%)  rotate(45deg);/* Safari 和 Chrome */
        -o-transform:translate(-50%,-50%) rotate(45deg);    /* Opera */
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
    .disabled input[type='checkbox']{
        cursor: not-allowed;
    }
    .disabled .is-checked input[type='checkbox']{
        cursor: pointer;
    }

    .search-ul .triangle-left{
        transform: rotate(135deg);
    }
    .button-box{
        padding: 10px 0;
        text-align: center;
        background-color: #fff;
    }
    .ml10{
        margin-left: 10px;
    }
    .triangle-right:after{
        content: '';
        display: block;
        width: 14px;
        height: 14px;
        transform: rotate(-45deg) translate(0,-50%);
        z-index: 10;
        position: absolute;
        left: 0;
        top: 0;
    }
</style>
