<!--
    Author:hezhongyi
    Date:2018-11-19
    Description:select主件

    使用案例：
    参数	        说明	        类型	                可选值	                默认值
    label           radio绑定的值   String,Number            -                      -
    disabled        是否禁用        Boolean                  true/false              false

    事件：
    事件名称	        说明	                            回调参数
    change	            radio发生变化时触发	                目前的选中值
-->
<template>
    <label
        :class="{
            'is-checked':label==model,
            'is-disabled': isDisabled
        }"
        class="container clearfix"
    >
        <span class="radio left">
            <input type="radio" class="inputClasses"
                   :value="label"
                   v-model="model"
                   :disabled="disabled"
            >
        </span>
        <span class="left slot"><slot></slot></span>
    </label>

</template>

<script>
    import Emitter from '@/mixins/emitter';
    export default {
        name: "radio",
        componentName: 'radio',
        inject: ['Group'],
        mixins: [Emitter],
        props:{
            value: [String,Number],
            label: {},
            disabled: Boolean,
            checked: Boolean,
            border: Boolean,
            size: String
        },
        data(){
            return {
                isChecked:this.checked,
                isDisabled:this.disabled,
                picked:this.value
            }
        },
        computed:{
            isGroup() {
                let parent = this.$parent;
                while (parent) {
                    if (parent.$options.componentName !== 'ElRadioGroup') {
                        parent = parent.$parent;
                    } else {
                        return true;
                    }
                }
                return false;
            },
            model: {
                get() {
                    return this.isGroup ? this.Group.selected : this.value;
                },
                set(val) {
                    if (this.isGroup) {
                        this.dispatch('ElRadioGroup', 'radioChange', [val]);
                    } else {
                        this.$emit('input', val);  //没有就会无效  set不能触发
                    }
                }
            },
        },
        watch:{
            disabled(val){
                this.isDisabled=val;
            }
        }
    }
</script>

<style scoped>
    .container{
        display: inline-block;
        line-height: 16px;
        height: 16px;
        position: relative;
    }
    .inputClasses{
        opacity: 0;
        display:inline-block;
        width: 16px;
        height: 16px;
    }
    .radio{
        display:inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: solid 1px #dfe2e6;
        position: relative;
        margin-right: 10px;
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
    .is-disabled{
        cursor: not-allowed;
    }
    .is-disabled .radio{
        background-color: #f5f7fa;
        border-color: #e4e7ed;
    }
    .is-disabled .radio:after{
        background-color: #c0c4cc;
    }
    .left{
        float: left;
    }
    .slot{
        margin-right: 30px;
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
