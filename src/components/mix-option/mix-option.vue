<template>
    <div class="container">
        <div class="radio-box mt6" >
            <sn-radio-group v-model="type">
                <sn-radio label="1">全部</sn-radio>
                <sn-radio label="2">自定义</sn-radio>
            </sn-radio-group>
        </div>
        <sn-checkbox-group v-show="type==='2'">
            <div class="area-box">
                <sn-checkbox class="area-item">苹果</sn-checkbox>
                <sn-checkbox class="area-item">华为</sn-checkbox>
                <sn-checkbox class="area-item">OPPO</sn-checkbox>
                <sn-checkbox class="area-item">小米</sn-checkbox>
                <sn-checkbox class="area-item">魅族</sn-checkbox>
                <sn-checkbox class="area-item">索尼</sn-checkbox>
                <sn-checkbox class="area-item">锤子</sn-checkbox>
                <sn-checkbox class="area-item">HTC</sn-checkbox>
                <sn-checkbox class="area-item">摩托罗拉</sn-checkbox>
            </div>
        </sn-checkbox-group>
    </div>
</template>

<script>
    import {Radio,RadioGroup,Checkbox,CheckboxGroup} from "_c"
    const components={
        'sn-radio':Radio,
        'sn-radio-group':RadioGroup,
        'sn-checkbox':Checkbox,
        'sn-checkbox-group':CheckboxGroup,
    };

    import mock from '@/view/page/api'
    export default {
        name: "mix-option",
        props:{
            cities:{
                type:[Array,Object],
                default(){
                    return mock.cities
                }
            },
            value:[String, Number,Array,Object],
        },
        data(){
            return{
                type:'',
                citiesSelected: [],
                ids:[],
                citiesHandle:[]
            }
        },
        components,
        methods:{
        },
        created(){
            this.type=this.value;
        },
        model: {
            event: 'modelUpdate',
        },
        watch:{
            type(val){
                this.$emit('modelUpdate', val);
            }
        },
    }
</script>

<style scoped lang="less">
    .top-box{
        display: flex;
        flex-wrap:wrap;
    }
    .area-box{
        margin-top: 12px;
        width:738px;
        padding: 20px 30px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(223,227,233,1);
        border-radius:2px;
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-wrap: wrap;
        .area-item{
            width: 20%;
            height: 36px;
            display: flex;
            align-items: center;
            padding-left: 10px;
            box-sizing: border-box;
        }
        &:after{
            content: '';
            display: block;

            position: absolute;
            top: -6px;
            left: 114px;
            width: 10px;
            height: 10px;
            border: rgba(223,227,233,1) solid 1px;
            border-left: 0;
            border-bottom: 0;
            background-color: #fff;
            transform: rotate(-45deg);
        }
    }
    .mr10{
        margin-right: 10px;
        margin-bottom: 10px;
    }
    .mt30{
        margin-top: 30px;
    }
    .mt6{
        margin-top: 6px;
    }
</style>
