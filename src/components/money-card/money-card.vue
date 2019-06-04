<template>
   <div class="container" :class="classes">
     <div class="flex">
       <sn-icon :type="icon" size="18" :color="iconColor" :ex="ex" :more="more"/>
       <p class="money text-overflow" :title="'￥'+toRegularNum(money)">￥{{toRegularNum(money)}}</p>
     </div>
     <p class="title text-overflow" :title="title">{{title}}</p>
   </div>
</template>
<script>
import {Icon} from "_c";
import { toRegularNum } from '@/mixins/globalMixin'
const components={
    'sn-icon':Icon
};
export default {
  name: "Button",
  props: {
    money: {
      type:[String,Number],
      default: "-"
    },
    icon:{
        type:String,
        default:''
    },
    iconColor:{
        type:String,
        default:''
    },
    title:{
        type:String,
        default:''
    },
    border:{
        type:Boolean,
        default:true
    },
    ex:{
        type:Boolean,
        default:false
    },
    more: {
      type:Boolean,
      default:false
    }
  },
  computed:{
      classes(){
          let border=this.border;
          return {
              border
          };
      }
  },
  components,
  methods:{
      toRegularNum
  }
};
</script>
<style lang="less" scoped>
 .container{
   width:100%;
   height:170px;
   background:rgba(255,255,255,1);
   border-radius:4px;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   overflow: hidden;
 }
.border{
  border:1px solid rgba(223, 226, 230, 1);
}
.flex{
  display: flex;
  align-items: center;
  overflow: hidden;
  max-width: 100%;
}
.money{
  padding-left: 20px;
  font-size:32px;
  font-weight:400;
  color:rgba(53,64,82,1);
  line-height: 1;
}
.title{
  font-size:14px;
  font-weight:400;
  color:rgba(127,143,164,1);
  line-height: 1;
  margin-top: 14px;
  max-width: 100%;
}
</style>

