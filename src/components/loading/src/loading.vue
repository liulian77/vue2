<!--
    Author:hezhongyi
    Date:2018-11-19
    Description:提示弹窗组件

    使用案例：
    参数	        说明	        类型	                可选值	                默认值
    visible         是否显示    Boolean                 true/false              false

    事件：
    事件名称	        说明	                            回调参数
    handleClose	        关闭loading                         -
-->
<template>
  <div class="wrapper" v-if="visible">
    <transition>
      <svg width="60" height="60">
        <circle cx="30" cy="30" r="24" stroke-width="4" stroke="rgba(22,39,65,.15)" fill="none"></circle>
        <circle cx="30" cy="30" r="24" stroke-width="4" stroke="#2A9FF6" fill="none" class="spin"
                transform="translate(0 0)"
                stroke-dasharray="42.725660088821186 1025.4158421317084"
        ></circle>
      </svg>
    </transition>
  </div>
</template>

<script>

  export default {
    name: 'ElDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
      return {

      };
    },
    methods: {
        handleClose() {
            this.$emit('update:visible', false);
        },
    },
  };
</script>
<style scoped>
  circle {
    -webkit-transition: stroke-dasharray .25s;
    transition: stroke-dasharray .25s;
  }

  .spin{
    animation: ani-demo-spin 700ms cubic-bezier(0.13, 0.38, 0.65, 0.68) infinite;
    transform-origin:center center;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
  .wrapper{
    width: 60px;
    height: 60px;
    display: inline-block;
  }
</style>
