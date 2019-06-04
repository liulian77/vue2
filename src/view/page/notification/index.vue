<template>
  <sn-layout class="content">
    <sn-row class="container mt20">
      <h1>
        通知设置
        <span @click="toUserInfo">设置</span>
      </h1>
    </sn-row>
    <sn-card class="notification-wrapper">
      <div class="flex mg20">
        <div>是否接收手机短信的通知</div>
        <RadioGroup class="flex radio-group-wrap" 
            v-model="is_msg"
            @on-change='change'>
          <div>
            <Radio :label="1">接收手机短信的通知</Radio>
          </div>
          <div>
            <Radio :label="0">不接收手机短信的通知</Radio>
          </div>
        </RadioGroup>
      </div>
      <div class="flex mg20 sub-title">填写手机号码后，即可通过手机号收到来自超级签名的通知，例如账户余额预警等</div>
    </sn-card>
  </sn-layout>
</template>

<script>
import {
  Button,
  Icon,
  Input
} from "_c";
import { mapState, mapActions } from "vuex";
import {
  Layout,
  Content,
  Header,
  RadioGroup,
  Radio,
  Message,
  Row,
  Card
} from "iview";
import { Dialog } from "_c/dialog";
import { tableMixin } from "@/mixins";
import { deepCopy } from "@/utils/assist";
import { formatTime } from "@/mixins/globalMixin";
import { api_global } from "@/api";
import fetch from "@/common/fetch";

const components = {
  "sn-icon": Icon,
  "sn-button": Button,
  "sn-layout": Layout,
  "sn-content": Content,
  "sn-header": Header,
  "sn-input": Input,
  'sn-row': Row,
  RadioGroup,
  Radio,
  "sn-card": Card
};
let filterObj = {
  operator: "",
  beeditor: "",
  row: 10,
  page: 1
};
export default {
  name: "Index",
  components,
  data() {
    return {
      is_msg: 0
    };
  },
  computed: {
    ...mapState('basic', ['userinfo'])
  },
  watch: {
    userinfo: {
      handler: function(val) {
        if (val) {
          this.is_msg = val.is_msg;
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions("basic", ["AutoLogin"]),
    toUserInfo() {
      this.$router.push({ name: "userInfo" });
    },
    async change(val) {
      let vm = this;
      if (val === 1) {
        if (vm.userinfo.mobile === '') {
           Dialog({
            type: "default",
            text: '请先绑定手机号。',
            confirmTxt: '去绑定',
            onConfirm() {
              vm.$router.push({name: 'baseInfo'});
            },
            onCancel() {
            }
          });
          vm.$nextTick(() => {
            vm.is_msg = 0;
          });
          return;
        }
      };
      try {
        await fetch({
          method: 'PUT',
          url: '/staff.json',
          data: {
            is_msg: val,
            _id: this.userinfo._id
          }
        });
        Message.success('操作成功');
        this.AutoLogin();
      } catch (error) {
        Message.warning('操作失败');
      }
      
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  padding: 15px 15px 0;
  margin: 0 15px;
  font-size: 13px;
  color: #5a5959;
  .mt20 {
    margin-top: 20px;
  }
  .mg20 {
    margin: 20px;
  }
  .mb30 {
    margin-bottom: 20px;
  }
  .font-gray {
    color: #9e9e9e;
  }
  .container {
    &.setting-wrapper {
      box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      border: 1px solid #e8e8e8;
      border-top: 0;
      background: #fff;
    }
    h1 {
      color: #5a5959;
      margin-bottom: 5px;
      font-size: 16px;
      text-transform: none;
      font-weight: 400;
      padding: 0;
      span {
        float: right;
        margin-right: 15px;
        cursor: pointer;
      }
    }
  }
  .flex {
    display: flex;
  }
  .radio-group-wrap {
    flex: 1;
    div {
      flex: 1;
      text-align: center;
    }
  }
  .sub-title {
    color: #9e9e9e;
  }
  .notification-wrapper {
    min-height: 600px;
    margin-right: 15px;
  }
}
.error {
  color: red;
}
/deep/ .s-btn-primary {
  background: linear-gradient(90deg, #348ef1, #49afff);
  height: 32px;
  margin-left: 5px;
}
</style>
