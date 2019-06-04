<!--

    Author:hezhongyi
    Date:2018-11-19
    Description:select主件

    使用案例：
    参数	        说明	        类型	                可选值	                默认值
    checked         是否选中        Boolean                  true/false              false
    disabled        是否禁用        Boolean                  true/false              false

    事件：
    事件名称	        说明	                            回调参数
    change	            抽选发生变化时触发	                目前的选中值

-->
<template>
    <label
            :class="{
        'is-checked':isGroup?isChecked:origin,
        'is-disabled': isDisabled
        }"
            class="container clearfix"
    >
        <span class="checkbox">
            <input type="checkbox" class="inputClasses" v-model="isChecked" :disabled="disabled" @change="change($event)" v-if="isGroup">
            <input type="checkbox" class="inputClasses" v-model="origin" :disabled="disabled" @change="change($event)" v-else>
        </span>
        <span class="slot"><slot></slot></span>
    </label>

</template>

<script>
    import Emitter from '@/mixins/emitter';
    export default {
        name: "checkboxBtn",
        componentName: 'checkboxBtn',
        inject: ['Group'],
        mixins: [Emitter],
        props:{
            value: [String,Number,Boolean],
            label: {},
            disabled: Boolean,
            checked: Boolean,
            border: Boolean,
            size: String
        },
        computed:{
            isGroup() {
                let parent = this.$parent;
                while (parent) {
                    if (parent.$options.componentName !== 'ElCheckboxGroup') {
                        parent = parent.$parent;
                    } else {
                        return true;
                    }
                }
                return false;
            },
        },
        data(){
            return {
                isChecked:this.checked,
                isDisabled:this.disabled,
                origin:(this.value?true:false)
            }
        },
        methods:{
            //赋予初始值
            init(){
                if(this.isGroup){
                    let groupVal=this.Group.selected;
                    let indexof=groupVal.indexOf(this.value);
                    this.isChecked=(indexof>-1);
                }
                this.isDisabled = this.disabled;
            },
            //点击值变化
            change(event){
                let val=this.value;
                let flag=event.target.checked;
                this.$emit('change',[val,flag]);

                this.$emit('modelUpdate',flag);
                if(this.isGroup){
                    let indexof=this.Group.selected.indexOf(val);
                    if(indexof>-1){
                        this.Group.selected.splice(indexof,1);
                    }else{
                        this.Group.selected.push(val)
                    }
                    this.Group.modelUpdate();
                }
            }
        },
        model: {
            event: 'modelUpdate',
        },
        created() {
              this.init();
        },
        updated(){
            this.init();
        }
    }
</script>

<style scoped>
    .container{
        display: inline-block;
        display: inline-flex;
        line-height: 1.5;
        height: 16px;
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
    .checkbox{
        
        display:inline-block;
        width: 16px;
        height: 16px;
        border: solid 1px #dfe2e6;
        position: relative;
        overflow: hidden;
        border-radius: 2px;
        margin-right: 10px;
        margin-top: 3px;
        box-sizing: border-box;
    }
    .checkbox:hover{
        border: solid 1px #2198f0;
    }
    .is-checked .checkbox{
        background-color: #2198f0;
        border: solid 1px #2198f0;
    }
    .is-checked .checkbox:after{
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
    .is-disabled{
        cursor: not-allowed;
    }
    .is-disabled .checkbox{
        background-color: #f3f3f3;
        border-color: #dcdee2;
    }
    .is-disabled .checkbox:after{
        border-right: 2px solid #ccc;
        border-bottom: 2px solid #ccc;
    }
    .is-disabled{
        color: #ccc;
    }
    .left{
        float: left;
    }
    .slot{
        flex: 1;
        /* margin-right: 30px; */
        color: #354052;
        font-size: 14px;
    }
    .clearfix:after{
        content: "\0020";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    .clearfix{
        zoom: 1;
    }
</style>
