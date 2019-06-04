<!--

    Author:hezhongyi
    Date:2018-11-19
    Description:select主件

    使用案例：
    Select Attributes
    参数	        说明	        类型	                可选值	        默认值


    事件：
    事件名称	        说明	                            回调参数


-->


<template>
  <div class="el-textarea" :style="wrapStyles">
      <sm-input v-model="text"
             type="textarea"
             :placeholder="placeholder"
             class="textarea"
             :maxlength="Number(max)"
             :readonly="disabled"
      />
      <span class="count">{{num}}/{{max}}</span>
  </div>
</template>

<script type="text/babel">
  import Input from "_c/input";
  import style from "@/mixins/style";
  import { mapState } from 'vuex'
  export default {
    name: 'Eltextarea',
    componentName: 'Eltextarea',
    mixins: [style],
      model: {
          event: 'modelUpdate',
      },
    props: {
        value:String,
        placeholder:[String, Number],
        disabled:Boolean,
        height:{
            type:[String, Number],
            default:100
        },
        //宽度的控制
        width:{
            type:[String, Number],
            default:360
        },
        max:{
            type:[String, Number],
            default:100
        },
    },
    data() {
          return {
              text:''
          };
      },
    components: {
        'sm-input':Input
    },
    methods: {
        handleClose() {
            this.visible = false;
        },
    },
    computed: {
        num(){
            return this.text.length
        }
    },
      watch:{
        text(val){
            this.$emit('modelUpdate',val);
        },
        value(val){
            this.text=val?val:'';
        }
      }
  };
</script>

<style scoped lang="less">
    /deep/ .ivu-input{
        resize:none;
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 0;
    }
    /deep/ .ivu-input[readonly] {
        background-color: #f3f3f3;
        opacity: 1;
        cursor: not-allowed;
    }
    .textarea{
        width: 100%;
        height: 100%;
        padding-bottom: 20px;
        box-sizing: border-box;
        background-color: #fff;
        border: 1px solid #dfe2e5;
        border-radius: 4px;
    }
    
    .el-textarea{
        position: relative;
    }
    .count{
        position: absolute;
        bottom: 10px;
        right: 10px;
        color: #7f8fa4;
        font-size: 12px;
        line-height: 1;
    }
</style>
