<template>
    <div class="container">
        <div class="top-box mt6" v-show="citiesSelected.length>0&&type==='2'">
            <template v-for="val in citiesSelected">
                <sn-tag closable color="#33A3F8" @on-close="handleClose(val)" :key="val._id" class="mr10">{{val.name}}</sn-tag>
            </template>
            <span class="clear" @click="handleClear">清空</span>
        </div>
        <div class="radio-box " :class="(citiesSelected.length>0&&type==='2')?'mt30':'mt6'">
            <sn-radio-group v-model="type">
                <sn-radio label="1">常驻地</sn-radio>
                <sn-radio label="2">差旅出行</sn-radio>
            </sn-radio-group>
        </div>
        <div class="area-box" v-if="type==2">
            <template v-for="(item,label) in cities" >
                <area-item :pid="label"  :city="item" :key="item._id" class="area-item" @change="itemChange" />
            </template>
        </div>
    </div>
</template>

<script>
    import {Tag,Poptip} from 'iview'
    import {Radio,RadioGroup} from "_c"
    import areaItem from "./area-item"
    const components={
        'sn-tag':Tag,
        'sn-poptip':Poptip,
        'sn-radio':Radio,
        'sn-radio-group':RadioGroup,
        'area-item':areaItem,
    };

    import mock from '@/view/page/api'
    export default {
        name: "area-select",
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
            handleClose(val){
                let id=val.level===2?val._id:val.pid;
                this.$children.forEach((item)=>{
                    if(item.$options.componentName=='areaItem'&&item.pid===id){
                        item.handleDel(val._id);
                    }
                });
            },
            handleClear(){
                this.$children.forEach((item)=>{
                    if(item.$options.componentName=='areaItem'){
                        item.reset();
                    }
                });
            },
            itemChange(id){
                let selected=[];
                this.$children.forEach((item)=>{
                    if(item.$options.componentName=='areaItem'&&item.ids.length>0){
                        selected=[...selected,...item.ids];
                    }
                });
                this.ids=selected;
                this.CSComputed(selected,id);
            },
            //计算选中的内容
            CSComputed(selected){
                let citiesSelected=[];
                let cities=this.citiesHandle;
                selected.map(item=>{
                    citiesSelected.push(cities[item]);
                });
                this.citiesSelected=citiesSelected;
            },
            handleCity(){
                //将城市提出组成一个object
                let cities=JSON.parse(JSON.stringify(this.cities));
                let citiesHandle={};
                Object.keys(cities).map(item=>{
                    let city=cities[item];
                    if(city.children.length===0){
                        citiesHandle[item]=city;
                    }else {
                        Object.keys(city.children).forEach(val=>{
                            citiesHandle[val]=city.children[val];
                        })
                    }
                });
                this.citiesHandle=citiesHandle;
            }
        },
        created(){
            this.type=this.value;
        },
        mounted(){
            this.handleCity();
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
    /*对tag的样式修正*/
    /deep/ .ivu-tag{
        margin:0;
        height: 24px;
        display: inline-flex;
        align-items: center;
        padding: 0 10px;
        .ivu-icon-ios-close{
            opacity: 1;
            font-size: 15px;
            top: 2px;
        }
    }
    /*对tag的样式修正*/

    .clear{
        font-size:14px;
        font-weight:400;
        color:rgba(235,77,68,1);
        cursor: pointer;
    }
    .mt30{
        margin-top: 30px;
    }
    .mt6{
        margin-top: 6px;
    }

    .area-box{
        margin-top: 12px;
        width:738px;
        padding: 20px 30px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(223,227,233,1);
        border-radius:2px;
        position: relative;
        display: flex;
        flex-wrap: wrap;
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
        .area-item{
            width: 20%;
            height: 36px;
            display: flex;
            align-items: center;
            padding-left: 10px;
            box-sizing: border-box;
        }
    }
    .mr10{
        margin-right: 10px;
        margin-bottom: 10px;
    }
</style>
