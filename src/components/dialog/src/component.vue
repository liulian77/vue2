<!--
    Author:hezhongyi
    Date:2018-11-19
    Description:提示弹窗组件
    使用案例：
    参数	        说明	        类型	                可选值	                默认值
    visible         是否显示弹窗    Boolean                 true/false              false
    model           是否显示蒙层    Boolean                 true/false              true
    text            提示的文本内容  String/Number           -                       -
    type            弹窗种类        String                  default/warning/error   -
    onConfirm	    点击确定之后触发
    onClose	        点击取消之后触发

-->
<template>
  <transition>
    <div class="dialog-wrapper"
      v-show="visible"
      :style="wrapperStyles"
      :class="[isMobile?'mobile':'web']">
      <div role="dialog"
        aria-modal="true"
        aria-label="提示"
        class="el-dialog"
        v-if="!isMobile"
        key="web">
        <div class="el-dialog__close"
          @click="close">
          <Icon type="open"
            color="#354052"
            :size="10"
            class="close" />
        </div>
        <div class="el-dialog__header">
          <Icon type="warning"
            color="#fb4"
            :size="54"
            class="warning"
            v-if="type=='warning'" />
          <Icon type="error"
            color="#f04040"
            :size="54"
            class="warning"
            v-if="type=='error'" />
          <Icon type="common"
            color="#2198f0"
            :size="54"
            class="warning"
            v-if="type=='default'" />
        </div>
        <div class="el-dialog__body" :class="{'text-left': textLeft}">
          <span>{{text}}</span>
        </div>
        <div class="el-dialog__footer">
          <Button @click.native="close" v-if="cancel">取消</Button>
          <Button type="primary"
            :class="{ml40: cancel}"
            @click.native="confirm">{{confirmTxt}}</Button>
        </div>
      </div>

      <div role="dialog"
        aria-modal="true"
        aria-label="提示"
        class="el-dialog-mobile"
        v-if="isMobile"
        key="mobile"
        :class="{
               'has-icon':icon,
               'has-cancel':cancel,
               'has-subtext':subtext,
           }">
        <div class="el-dialog__header"
          v-if="icon">
          <Icon type="warning"
            color="#fb4"
            class="warning"
            v-if="type=='warning'" />
          <Icon type="error"
            color="#f04040"
            class="warning"
            v-if="type=='error'" />
          <Icon type="common"
            color="#2198f0"
            class="warning"
            v-if="type=='default'" />
        </div>
        <div class="el-dialog__body" :class="{'text-left': textLeft}">
          <p class="text">{{text}}</p>
          <p class="subtext"
            v-if="subtext">{{subtext}}</p>
        </div>
        <div class="el-dialog__footer">
          <Button @click.native="close"
            class="btn cancel"
            v-if="cancel">取消</Button>
          <Button class="btn confirm"
            @click.native="confirm">{{confirmTxt}}</Button>
        </div>
      </div>

    </div>
  </transition>
</template>

<script>
import Icon from "_c/icon";
import Button from "_c/button";
import { throttle } from 'lodash'
const components = {
  Icon,
  Button,
};
export default {
  name: 'ElDialog',
  components,
  data() {
    return {
      visible: false,
      modal: true,
      confirmTxt: '确认',
      text: '',
      type: 'default',
      cancel: true,
      icon: true,
      subtext: '',
      textLeft: false,
      isMobile: false
    };
  },
  computed: {
    wrapperStyles() {
      let styles = {};
      (!this.modal) && (styles.background = 'rgba(0,0,0,0)');
      return styles;
    },
  },
  watch: {
    visible(newVal) {
      if (!newVal) {
        document.removeEventListener('keydown', this.keydown)
        this.$el.remove()
      }
    }
  },
  methods: {
    close() {
      this.visible = false
      if (typeof this.onCancel === 'function') {
        this.onCancel(this);
      }
    },
    confirm() {
      this.visible = false;
      if (typeof this.onConfirm === 'function') {
        this.onConfirm(this)
      }
    },
    keydown(e) {
      if (e.keyCode === 27) { // esc关闭消息
        if (this.visible) {
          this.close();
        }
      }
    },
  },
  mounted() {
    document.addEventListener('keydown', this.keydown);
    this.isMobile = document.body.clientWidth < 768;
    window.addEventListener('resize', throttle(() => {
      this.isMobile = document.body.clientWidth < 768
    }, 200))
  },

};
</script>
<style scoped lang="less">
.el-dialog__close {
  width: 40px;
  height: 40px;
  border-radius: 0px 4px 0px 0px;
  position: absolute;
  right: 0;
  top: 0;
}
.el-dialog__close:hover {
  background-color: #dc4b4b;
}
.el-dialog__close:hover /deep/ .s-icon {
  color: #fff !important;
}
.close {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}
.dialog-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 2001!important;
  background: rgba(0, 0, 0, 0.5);
}
.el-dialog {
  width: 460px;
  min-height: 300px;
  background-color: #ffffff;
  box-shadow: 0px 6px 20px 0px rgba(154, 167, 179, 0.3);
  border-radius: 4px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2100;
}
.el-dialog__header {
  margin-top: 59px;
  text-align: center;
}
.el-dialog__body {
  margin-top: 42px;
  text-align: center;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: 0px;
  color: #354052;
}
.el-dialog__footer {
  margin-top: 41px;
  text-align: center;
}
.ml40 {
  margin-left: 40px;
}

@v: 100vw/750;

.mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  .el-dialog-mobile {
    width: 500 * @v;
    background-color: #fff;
  }
  .el-dialog__footer {
    height: 110 * @v;
    display: flex;
    align-items: center;
    margin-top: 0;
    .btn {
      flex: 1;
      height: 100%;
    }
    .confirm {
      color: #1991eb;
      border-left: none;
    }
    .cancel {
      color: #7f7f7f;
    }
  }
  .el-dialog__header {
    .warning {
      font-size: 40 * @v!important;
    }
  }
  .el-dialog__body {
    padding: 63 * @v 50 * @v;
    margin-top: 0;
    .text {
      font-size: 30 * @v;
      color: #323233;
      line-height: 1.6;
    }
    .subtext {
      margin-top: 41 * @v;
      font-size: 24 * @v;
      color: #808080;
    }
  }
  .has-icon {
    .el-dialog__footer {
      margin-top: 48 * @v;
    }
    .el-dialog__header {
      margin-top: 58 * @v;
    }
    .el-dialog__body {
      padding: 0 50 * @v;
      margin-top: 25 * @v;
    }
  }
}
.web{
  .el-dialog__footer {
    margin-bottom: 54px;
  }
}
.text-left {
  line-height: 1.6;
  text-align: left;
  padding: 0 30px;
}
</style>
