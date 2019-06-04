<!--

    Author:hezhongyi
    Date:2018-11-19
    Description:多级select主件

    使用案例：
    参数	        说明	             类型	                可选值	                默认值
    value           组件绑定的值         Array                   -                      -
    width           组件的宽度           Number                  -                      -
    placeholder     预设的文字           String                  -                      -
    disabled        是否禁用             Boolean                 false/true             true
    searchItems     关键字搜索的         Array                   -                      -
    defaultProps    预设的option值       Object                 {children: 'children',  //指定子树为节点对象的某个属性值label: 'label'      //指定节点标签为节点对象的某个属性值}

-->
<template>
    <div class="container relative">
        <div class="search-box" @click="ulShow" :style="boxStyles"
             v-clickoutside="handleClose"
        >
            <sm-input
                    :placeholder="placeholder"
                    v-model="text"
                    :border="false"
                    :title='text'
                    :readonly="true"
                    v-show="searchReadonly"
                    key="1"
            >
                <sm-icon type="search"
                      color="#ebedf2"
                      :size="14"
                      class="icon"
                      slot="prefix"
                />
                <sm-icon type="error"
                      color="#f04040"
                      :size="14"
                      class="error-icon"
                      @click.native="clear"
                      slot="suffix"
                      v-show="text"
                />
            </sm-input>
            <sm-input
                    :placeholder="placeholder"
                    autofocus
                    v-model="keyWords"
                    :border="false"
                    :title='keyWords'
                    v-show="!searchReadonly"
                    key="2"
            >
                <sm-icon type="search"
                      color="#ebedf2"
                      :size="14"
                      class="icon"
                      slot="prefix"
                />
                <sm-icon type="error"
                      color="#f04040"
                      :size="14"
                      class="error-icon"
                      @click.native="clear"
                      slot="suffix"
                      v-show="search"
                />
            </sm-input>
            <span class="arrow-down"></span>
            <div class="item-box" v-show="itemBoxShow">
                <slot>
                </slot>
            </div>
            <div class="search-item" v-show="search&&!searchReadonly" @scroll="menuScroll($event)">
                <sm-option v-for="(item,i) in searchItems" v-model="item[defaultValue]" :key="i"></sm-option>
            </div>
        </div>
    </div>
</template>

<script>
    import radioItem from "_c/level-search/level-search-item";
    import Icon from "_c/icon";
    import Input from "_c/input";
    import Option from "_c/option";
    import Clickoutside from '@/mixins/clickoutside';
    import {domScroll,Emitter} from "@/mixins";
    import {debounce } from 'lodash'
    export default {
        name: "LevelSearch",
        componentName: 'ElSelect',
        mixins: [Emitter,domScroll],
        props:{
            value:[Array,String],
            width: {
                //type: Number,
                //default: 200
            },
            height: {
                //type: Number,
                default: 36
            },
            placeholder:{
                //type:String
            },
            disabled:{
                default: false
            },
            searchItems:Array,
            //model绑定的默认值的key
            defaultValue:{
                type:String,
                default:'value'
            }
        },
        provide() {
            return {
                'select': this
            };
        },
        model: {
            event: 'modelUpdate',//自定义事件名,触发事件更新model值
        },
        directives: { Clickoutside },
        data(){
            return {
                keyWords:'',
                text:'',
                search:false,
                searchReadonly:true,
            }
        },
        methods:{
                ulShow(e){
                    if(this.disabled){
                        return false;
                    }
                    //this.keyWords='';
                    this.searchReadonly=false;
                    this.broadcast('ulItem','toShow',[e.target]);
                },
                submit(){
                    let label=[];
                    let values=[];
                    this.$children.forEach((item,i)=>{
                        if(item.$options.componentName=='ulItem'){
                            let itemVal=item.selectItem.item;
                            if(itemVal){
                                let str=itemVal[item.defaultProps.label];
                                if (itemVal.value) {
                                    values.push(itemVal.value);
                                }
                                label.push(str)
                            }
                        }
                    });
                    label=label.join('/');
                    label=label.replace(/(\/*$)/g ,"");
                    this.text=label;
                    this.$emit('submit',label);
                    this.$emit('searchUpdate', values);
                    this.$emit('modelUpdate',label);
                    setTimeout(()=>{
                        this.searchReadonly=true;
                    },0);
                },
                clear(){
                    this.keyWords='';
                    this.text='';
                    this.searchReadonly=true;
                    this.broadcast('ulItem','reset');
                    this.$emit('modelUpdate',[]);
                },
                handleOptionSelect(option, byClick) {
                    this.text=option.currentLabel;
                    this.$emit('submit',option.value);
                    this.$emit('modelUpdate',option.value);
                    this.searchReadonly=true;
                    this.broadcast('ulItem','toShow',[event.target,true]);
                    this.broadcast('ulItem','reset');
                },
                handleClose(){
                     this.searchReadonly=true;
                }
            },
        watch:{
            keyWords:debounce(function (val) {
                this.search=val.length>0;
                this.$emit('search',val);
            },300)
        },
        computed:{
            boxStyles() {
                let styles = {};
                if(typeof this.width === 'number'){
                    styles.width=this.width+'px';
                }
                if(typeof this.height === 'number'){
                    styles.height=this.height+'px';
                }
                return styles;
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
            textValue() {
                return this.value;
            },
            itemBoxShow() {
                let flag = !(this.search&&!this.searchReadonly);
                // console.log(this.search, this.searchReadonly, flag);
                return flag;
            }
        },
        components: {
            'sm-option':Option,
            'sm-input':Input,
            'sm-radio-item':radioItem,
            'sm-icon':Icon,
        },
        created(){
            this.$on('handleOptionClick', this.handleOptionSelect);
        },
        updated() {
            if (this.value.length) {
                this.text = this.value;
            }
        }
    }
</script>
<style scoped>
    .container{
        display: inline-block;
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
        padding: 10px  30px 10px  0;
        display: flex;
        align-items: center;
    }
    .search-box .search-btn{
        flex: 1;
        padding-left: 10px;
        margin-right: 10px;
        -webkit-appearance: none;
        background-image: none;
        background-color: #ffffff;
        box-sizing: border-box;
        font-size: 12px;
        color: #354052;
        display: inline-block;
        outline: none;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        cursor: pointer;
        border-radius: 2px;
        border: none;
        caret-color:#2198f0;
        line-height: 14px;
    }
    .search-box .search-btn label{
        margin-right: 5px;
    }
    .arrow-down{
        content: '';
        width: 5px;
        height: 5px;
        border-right: 1px solid #7f8fa4;
        border-bottom: 1px solid #7f8fa4;
        display: block;
        position: absolute;
        top: 50%;
        -webkit-transform: rotate(45deg) translateY(-50%);
        transform: rotate(45deg) translateY(-50%);
        right: 18px;
    }
    .error-icon{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    .item-box{
        z-index: 100;
    }
    .search-item{
        width: 100%;
        max-height:280px;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #fff;
        box-sizing: border-box;
        border-radius: 2px;
        position: absolute;
        z-index: 900;
        left: 0;
        bottom: -10px;
        transform: translateY(100%);
        box-shadow: 0 6px 16px 0px rgba(127, 143, 164, 0.15);
        border: 1px solid #dfe2e6;
    }
    /deep/ .ivu-input{
        padding-right:25px;
        white-space:nowrap;
        text-overflow:ellipsis;
        -o-text-overflow:ellipsis;
        overflow: hidden;
    }
</style>
