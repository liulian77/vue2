<!--
    Description:按钮组件

    使用案例：
    参数	        说明	                     类型	                可选值	                                     默认值
    type            按钮的种类                   String                 default/primary/error/success                default
    shape           是否为圆角                   String                 shape                                        -
    size            按钮的大小                   String                 small/stretch/default/large/stretch-h36      default
    disabled        是否禁用                     Boolean                true/false                                   false
    ghost           是否镂空                     Boolean                true/false                                   false

-->

<template>
  <a v-if="to"
    :class="classes"
    :disabled="disabled"
    :href="linkUrl"
    :target="target">
    <slot></slot>
  </a>
  <button v-else
    :class="classes"
    :disabled="disabled">
    <slot></slot>
  </button>
</template>
<script>
import { oneOf } from "@/utils/assist";
import mixinsLink from "_c/button/link";

const prefixCls = "s-btn";
export default {
  name: "Button",
  mixins: [mixinsLink],
  props: {
    type: {
      validator(value) {
        return oneOf(value, ["default", "primary", "error", "success"]);
      },
      default: "default"
    },
    shape: {
      validator(value) {
        return oneOf(value, ["circle"]);
      }
    },
    size: {
      validator(value) {
        return oneOf(value, ["small", "stretch", "default", "large",'stretch-h36']);
      },
      default() {
        return !this.$IVIEW || this.$IVIEW.size === ""
          ? "default"
          : this.$IVIEW.size;
      }
    },
    disabled: Boolean,
    ghost: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.type}`,
        {
          [`${prefixCls}-${this.shape}`]: !!this.shape,
          [`${prefixCls}-${this.size}`]: this.size !== "default",
          [`${prefixCls}-ghost`]: this.ghost
        }
      ];
    }
  }
};
</script>
<style lang="less" scoped>
  html{
    .s-btn-stretch-h36{
      width: auto;
      height: 36px;
      line-height: 36px;
      padding: 0 15px;
    }

    .s-btn-stretch{
      padding: 0 15px;
    }
      .s-btn{
          font-size: 14px;
      }
  }
</style>

