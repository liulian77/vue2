<template>
    <div class="container" :class="total>0&&active?'active':''" @mouseenter="handleHover(true)" @mouseleave="handleHover(false)">
        <sn-checkbox-group class="province" v-model="all" @change="allChange">
            <sn-checkbox value="all">
                <span class="mr10">{{city.name}}</span>
                <span v-if="total>0"><span :class="count>0?'count':''">{{count}}</span>/{{total}}</span>
            </sn-checkbox>
        </sn-checkbox-group>
        <div class="children" v-show="total>0&&active">
            <sn-checkbox-group v-model="selected" @change="childrenChange">
                <template v-for="(val,i) in city.children">
                    <sn-checkbox
                            :key="val._id" class="city" :title="val.name"
                            :value="i"
                    >{{val.name}}</sn-checkbox>
                </template>
            </sn-checkbox-group>
        </div>
    </div>
</template>

<script>
    import {Checkbox,CheckboxGroup} from "_c"
    const components={
        'sn-checkbox':Checkbox,
        'sn-checkbox-group':CheckboxGroup,
    };
    function typeOf(obj) {
        const toString = Object.prototype.toString;
        const map = {
            '[object Boolean]'  : 'boolean',
            '[object Number]'   : 'number',
            '[object String]'   : 'string',
            '[object Function]' : 'function',
            '[object Array]'    : 'array',
            '[object Date]'     : 'date',
            '[object RegExp]'   : 'regExp',
            '[object Undefined]': 'undefined',
            '[object Null]'     : 'null',
            '[object Object]'   : 'object'
        };
        return map[toString.call(obj)];
    }
    let indeterminate=true;
    export default {
        name: "areaItem",
        componentName:'areaItem',
        props:{
            value:[String, Number,Array,Object],
            city:[Array,Object],
            pid:[String, Number,Array,Object]
        },
        data(){
          return {
              selected:[],
              ids:[],
              count:0,
              all:[],
              active:false,
          }
        },
        components,
        created(){
        },
        computed:{
            total(){
                let len;
                let children=this.city.children;
                if(typeOf(children)==='object'){
                    len=Object.keys(this.city.children).length;
                }else if (typeOf(children)=== 'array'){
                    len=this.city.children
                }else {
                    len=0;
                }
                return len;
            }
        },
        methods:{
            childrenChange(val){
                this.count=val.length;
                this.ids=val;
                this.$emit('change');
                //根据对应的数量，对应的全选切换
                if(this.count!==this.total){
                    this.all=[];
                    //防止死循环
                    indeterminate=false;
                    setTimeout(()=>{indeterminate=true},100);
                }else {
                    this.all=['all'];
                    //防止死循环
                    indeterminate=false;
                    setTimeout(()=>{indeterminate=true},100);
                }
            },
            allChange(val){
                //防止死循环
                if(!indeterminate)return false;



               let flag=!!val.length>0;

               //直辖市没有子集
               if(this.city.children.length===0){
                   this.ids=flag?[this.city._id]:[];
                   this.$emit('change');
               }else if(flag){
                   let arr=[];
                   let children=this.city.children;
                   Object.keys(children).forEach(item=>{
                       arr.push(children[item]._id)
                   });
                   this.selected=arr;
               }else {
                   this.selected=[];
               }
            },
            handleHover(val){
                this.active=val;
            },
            reset(){
                this.selected=[];
            },
            handleDel(id){
                let index=this.selected.indexOf(id);
                this.selected.splice(index,1);
            }
        },
        model: {
            event: 'modelUpdate',
        },
    }
</script>

<style scoped lang="less">
    .container{
        position: relative;
    }
    .active{
        border:1px solid rgba(34,152,240,1);
        position: relative;
        border-right: none;
    }
    .count{
        color: rgba(34,152,240,1);
    }
    .mr10{
        margin-right: 10px;
    }
    .children{

        z-index: 10;
        position: absolute;
        left: 100%;
        top: -1px;
        width: 208px;
        padding: 15px 20px;
        margin-left: -1px;
        border: #2298F0 1px solid;
        background: #fff;
        &:after{
            content: '';
            display: block;
            position: absolute;
            top: 0;
            left: -1px;
            z-index: 11;
            width: 1px;
            height: 32px;
            background: #fff;
        }
        .city{
            width: 50%;
            font-size:14px;
            font-weight:400;
            color:rgba(78,78,78,1);
            height: 35px;
            display: flex;
            align-items: center;
        }
    }


    /deep/ .group-box{
        flex-wrap: wrap;
        .slot{
            margin-right: 0;
            max-width: 60px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
    .province /deep/ .slot{
        max-width: 200px;
    }

</style>
