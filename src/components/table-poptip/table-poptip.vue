<template>
   <div class="container" :class="[isMobile?'container-xs':'container-web']">
       <span class="mr5">￥{{income}}</span>
           <sm-poptip
                   placement="bottom-start"
                   contentOffsetX="-25" contentOffsetY="-15"
                   v-if="!isMobile"
                   key="web"
                   trigger="hover"
           >
               <sm-icon type="tips" color="#c5ccd4"  class="tips"/>
               <div slot="content" class="tips-table">
                   <table>
                       <thead>
                       <tr>
                           <th  v-for="item in columns">{{item.title}}</th>
                       </tr>
                       </thead>
                       <tbody>
                           <tr v-for="val in data">
                               <td v-for="field in columns" :key="field.key">
                                   <span v-if="!field.render">{{val[field.key]}}</span>
                                   <span v-else >{{field.render(val[field.key])}}</span>
                               </td>
                           </tr>
                       </tbody>
                   </table>
               </div>
           </sm-poptip>
           <sm-poptip placement="bottom-end" v-if="isMobile"  key="mobile" width="300">
               <sm-icon type="tips" color="#c5ccd4"  class="tips"/>
               <div slot="content" class="tips-table">
                   <table>
                       <thead>
                       <tr>
                           <th  v-for="item in columns">{{item.title}}</th>
                       </tr>
                       </thead>
                       <tbody>
                       <tr v-for="val in data">
                           <td v-for="field in columns" :key="field.key">
                               <span v-if="!field.render">{{val[field.key]}}</span>
                               <span v-else >{{field.render(val[field.key])}}</span>
                           </td>
                       </tr>
                       </tbody>
                   </table>
               </div>
           </sm-poptip>
   </div>
</template>
<script>
import Icon from "_c/icon";
import Poptip from '_c/poptip';
import { deepCopy } from '@/utils/assist'
import { mapState } from 'vuex'
const components={
    'sm-icon':Icon,
    'sm-poptip':Poptip,
};
export default {
    name: "tablePoptip",
    props:{
        columns:{
            type:Array,
            default(){
                return []
            }
        },
        data:{
            type:Array,
            default(){
                return []
            }
        },
        income:[Number,String],
    },
    computed: {
        ...mapState('basic',[
            'isMobile'
        ])
    },
    components,
}
</script>

<style lang="less" scoped>
.container{
    display: flex;
    align-items: center;
    justify-content: center;
    white-space:pre-wrap;
    word-break:break-all;
}
.tips:hover{
color: #2198f0!important;
}
.tips-table th{
color: #7f8fa4;
}

@v:100vw/750;
.container-web{
    .tips-table{
        padding: 6px 20px;
    }
    .tips-table th,.tips-table td{
        width: 120px;
        text-align: left;
        font-weight: normal;
        padding: 10px 2px;
        white-space:pre-wrap;
        word-break:break-all;
        border: none;
        height: auto;
        line-height: 1.2;
    }
    .mr5{
        margin-right: 5px;
    }
}
.container-xs{
    .tips-table{
        padding: 6*@v 30*@v;
    }
    .mr5{
        margin-right: 5px;
    }
    .tips-table th,.tips-table td{
        text-align: left;
        font-weight: normal;
        padding: 10px 2px;
        white-space:pre-wrap;
        word-break:break-all;
        border: none;
        height: auto;
        line-height: 1.2;
    }
    .tips-table th:nth-child(1){
        width: 165*@v;
    }
    .tips-table th:nth-child(2){
        width: 270*@v;
    }
    .tips-table th:nth-child(3){
        width: 128*@v;
    }
}
.ivu-table-row-hover td{
    background-color: #fff;
}

</style>


