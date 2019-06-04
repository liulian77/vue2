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
    defaultProps    预设的option值       Object                 {children: 'children',  //指定子树为节点对象的某个属性值label: 'label'      //指定节点标签为节点对象的某个属性值}

-->


<template>
    <div class="container relative">
        <div class="search-box" @click="ulShow" :style="boxStyles">
            <span class="search-btn"  v-if="labels.length>0&&labelsShow">
                <template v-for="(item,i) in labels">
                 <label :title="item[defaultProps.label]">{{item[defaultProps.label]}}</label>
                 <sm-icon type="error"
                       color="#f04040"
                       size="14"
                       class="error-icon"
                       @click.native="del(item,i)"
                 />
                </template>
            </span>
            <span class="search-btn"  v-else>
                {{placeholder}}
            </span>
            <span class="arrow-down"></span>
            <div class="item-box">
                 <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    import Icon from "_c/icon";
    import {Emitter} from "@/mixins";
    export default {
        name: "LevelCheckbox",
        mixins: [Emitter],
        props:{
            value:Array,
            width: {},
            placeholder:{},
            disabled:{
                default: false
            },
            labelsShow:{
                default: true
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
            //model绑定的默认值的key
            defaultValue:{
                type:String,
                default:'value'
            },
            customValue: {
                type: String,
                default: null
            },
            limit: {
                type: Boolean,
                default: false
            },
            propertyName: {
                type: String,
                default: 'id'
            }
        },
        provide() {
            return {
                'LevelCheckbox': this
            };
        },
        model: {
            event: 'modelUpdate',//自定义事件名,触发事件更新model值
        },
        data(){
            return {
                labels:[]
            }
        },
        methods:{
            ulShow(e){
                if(this.disabled){
                    return false;
                }
                this.$children.forEach(item=>{
                    (item.name=='ulItem')&&(isShow(item));
                });
                /*======================用于判断点击对应的区域显示，不对应的区别关闭================================*/
                function isShow(item) {
                    if(!item.isShow){
                        (e.target.className!=='error-icon s-icon s-icon-error')&&(item.ulShow())       //del 按钮不弹开
                    }else{
                        (
                            !item.$parent.$el.querySelector('.item-box').contains(e.target)     //不属于item-box的地方点击关闭
                            ||(item.$parent.$el.querySelector('.submit') && item.$parent.$el.querySelector('.submit').contains(e.target))    //submit 确定按钮点击关闭
                        )&&(item.isShow=false);
                    }
                }
            },
            submit(data){
                let labels=[];
                let value=[];
                let currValue = this.value;
                if (this.customValue === 'geo') {
                    let arr = this.$children.filter(item => {
                        return item.$options.componentName === 'ulItem';
                    })
                    for(let i = arr.length - 1; i >=0; i--) {
                        let item = arr[i];
                        let j = i - 1;
                        if (item.items.length === item.value.length) {
                            if (arr[j]) {
                                let parentId = item.items[0].parent_id;
                                let item2 = arr[j].items;
                                item2.forEach(val => {
                                    if (val[this.propertyName] === parentId) {
                                        labels.push(val);
                                    }
                                });
                            } else {
                                labels = [...item.value, ...labels];
                            }
                        } else {
                            labels = [...item.value, ...labels];
                            if (arr[j]) {
                                let parentId = item.items[0].parent_id;
                                let item2 = arr[j].value;
                                if (item2) {
                                    item2.forEach((val, idx) => {
                                        if(val[this.propertyName] === parentId) {
                                            item2.splice(idx, 1);
                                        }
                                    });
                                }
                            }
                        }
                    }
                    if (this.limit && data) {
                        labels = labels.filter(item => {
                            return item.level === data.level;
                        });
                    }
                    value = labels;
                } else {
                    this.$children.forEach((item,i)=>{
                        if(item.$options.componentName=='ulItem'){
                            if(item.value && item.value.length>0){
                                labels=[...item.value,...labels]
                            }
                        }
                    });
                    labels.forEach(item=>{
                        value.push(item[this.defaultValue]);
                    });
                }
                this.labels=labels;
                this.$emit('modelUpdate',value);
            },
            clear(){
                this.labels=[];
                this.$children.forEach(item=>{
                    (item.name=='ulItem')&&(item.reset());
                });
                this.$emit('modelUpdate',[]);
            },
            del(item,index){
                let value=[];
                this.labels.splice(index,1);
                this.labels.forEach(item=>{
                    value.push(item[this.defaultValue]);
                });
                this.$emit('modelUpdate',value);
                this.$children.forEach(val=>{
                    (val._uid==item.id)&&(val.del(item));
                });
            },
            bindData(){
                this.broadcast('ulItem', 'bindData');
            }
        },
        mounted(){
            document.addEventListener('click',this.DocumentClick);
        },
        watch:{
            value(val){
                if(val.length==0){
                    this.labels=[];
                    this.$children.forEach(item=>{
                        (item.name=='ulItem')&&(item.reset());
                    });
                }
            }
        },
        computed:{
            boxStyles() {
                let styles = {};
                if(typeof this.width === 'number'){
                    styles.width=this.width+'px';
                }
                return styles;
            }
        },
        beforeDestroy(){
            //注销对应的事件
            document.removeEventListener('click',this.DocumentClick);
        },
        components: {
            'sm-icon':Icon,
        },
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
        min-height: 36px;
        background-color: #ffffff;
        border-radius: 2px;
        border: solid 1px #dfe2e6;
        padding: 10px  12px;
        display: flex;
    }
    .search-box .search-btn{
        flex: 1;
/*        padding-left: 10px;*/
        margin-right: 10px;
        -webkit-appearance: none;
        background-image: none;
        background-color: #ffffff;
        box-sizing: border-box;
        font-size: 12px;
        color: #354052;
        display: flex;
        align-items: center;
        flex-wrap:  wrap;
        outline: none;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        cursor: pointer;
        border-radius: 2px;
        border: none;
        caret-color:#2198f0;
        line-height: 1;
    }
    .search-box .search-btn label{
        margin-right: 5px;
        position: relative;
    }
    .arrow-down{
        content: '';
        width: 5px;
        height: 5px;
        border-right: 1px solid #7f8fa4;
        border-bottom: 1px solid #7f8fa4;
        display: block;
        position: absolute;
        top: 40%;
        -webkit-transform: rotate(45deg) translateY(-50%);
        transform: rotate(45deg) translateY(-50%);
        right: 18px;
    }
    .error-icon{
        position: relative;
        margin-right: 5px;
    }
    .item-box{
        z-index: 100;
    }

</style>
