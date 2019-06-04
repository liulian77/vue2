<template>
    <div class="input-box"
         :style="wrapStyles"
         @click="maskShow"
    >
        <Input placeholder="请输入" readonly :value="currentValue">
            <Icon type="search"
                  color="#ebedf2"
                  :size="15"
                  class="icon"
                  slot="prefix"
            />
        </Input>

        <div class="mask" v-if="mask">
            <div class="mask-top">
                <Input placeholder="请输入" v-model="keyWords"  :autofocus="true">
                    <Icon type="search"
                          color="#9e9e9e"
                          :size="15"
                          class="icon"
                          slot="prefix"
                    />
                    <Icon type="close"
                          color="#c1c1c1"
                          :size="15"
                          class="mask-icon"
                          slot="suffix"
                          @click.native="reset"
                    />
                </Input>
                <span class="cancel" @click="maskClose">取消</span>
            </div>
            <div class="search-item" v-show="keyWords">
<!--                <Item v-for="item in searchItems" v-model="item[defaultValue]">{{item.label}}</Item>-->
                <Item v-for="(item,i) in searchItems" v-model="item[defaultValue]" :key="i"></Item>
            </div>
        </div>
    </div>
</template>
<script>
    import Icon from "_c/icon";
    import Input from "_c/input";
    import Item from "./item";
    import style from "@/mixins/style";
    import {debounce } from 'lodash'
    export default {
        components:{
            Item,
            Icon,
            Input
        },
        name: 'ElSearch',
        componentName: 'ElSearch',
        inheritAttrs: false,
        mixins: [style],
        provide() {
            return {
                'select': this
            };
        },
        data() {
            return {
                mask:false,
                currentValue:'',
                level:1,
                keyWords:'',
            };
        },
        props: {
            value:[String,Number],
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
                type: String,
                default:'value'
            },
            searchItems:{
                type:Array,
                default(){
                    return []
                }
            },
        },
        model: {
            event: 'modelUpdate',
        },
        methods: {
            maskShow(){
                this.keyWords='';
                let $cancel=this.$el.querySelector('.cancel');
                !$cancel&&(this.mask=true);
            },
            maskClose(){
                this.mask=false;
            },
            handleItemClick(val,flag){
                this.currentValue=val.currentLabel;
                this.maskClose();
                window.scrollTop=0;
                this.$emit('change',[val,flag]);
                this.$emit('modelUpdate',val.value);
            },
            reset(){
                this.keyWords='';
                this.currentValue='';
            },
            /*==============================过滤script非法标签，防止注入===========================================*/
            hasIllegalChar(str){
                return new RegExp(".*?script[^>]*?.*?(<\/.*?script.*?>)*", "ig").test(str);
            },
        },
        created(){
            this.$on('handleItemClick', this.handleItemClick);
        },
        watch:{
            keyWords:debounce(function (val) {
                (this.hasIllegalChar(val))&&(this.keyWords='');
                this.$emit('search',val);
            },300)
        }
    };
</script>

<style scoped lang="less">
.input-box{
    display: flex;
}

@v:100vw/750;
.mask{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #eff3f6;
    z-index: 99999;
    overflow: hidden;
}
.mask-top{
    padding: 15*@v 0 15*@v 30*@v;
    background-color: #fff;
    display: flex;
    .cancel{
       width: 125*@v;
        line-height: 32px;
        text-align: center;
    }
    /deep/ .ivu-input{
        background-color: #f2f2f2;
        border: 1px solid #f2f2f2;
    }
}
.search-item{
    margin-top:10*@v;
    .item-title{
        padding: 0 10*@v 0 40*@v;
        height: 65*@v;
        line-height: 65*@v;
        border-bottom: 1px solid #dfe2e6;
        color: #354052;
        font-weight: bold;
        background-color: #fff;
    }
    height: (100vh-30*@v);
    padding-bottom: 32px;
    overflow: auto;
}

</style>

