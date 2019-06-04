<template>
  <sn-modal
    :footer-hide="true"
    v-model="isShow"
    class-name="vertical-center-modal"
    width="750"
    @on-visible-change="visibleChange"
    :mask-closable="false"
  >
    <div class="dialog-box">
      <div class="dialog-title">快速充值</div>
      <div class="mt50 ml90">
        <div class="flex money">
          <div class="label">充值金额</div>
          <!-- <div class="money-box ml0 money-box-active">2,000元</div> -->
          <template v-for="(money, index) in moneyList">
            <div
              class="money-box"
              :class="{'ml0': index === 0, 'money-box-active': index === chooseIndex }"
              @click="chooseMoney(money, index)"
              :key="index"
            >{{money.txt}}</div>
          </template>
          <!-- <div class="money-box">3,000元</div> -->
          <!-- <div class="money-box">6,000元</div> -->
          <!-- <div class="money-box">10,000元</div> -->
          <!-- <div class="money-box">20,000元</div> -->
        </div>
        <sn-form
          ref="formValidate"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="92"
          class="charge-form"
          @submit.native.prevent
        >
          <sn-form-item label="其他金额" prop="balance" key="balance">
            <sn-input size="large" 
              v-model="formValidate.balance" 
              type="tel" 
              :maxlength="4"
              placeholder="充值金额为10-5000元整数" 
              class="w266"/>
          </sn-form-item>
        </sn-form>
        <div class="flex way">
          <div class="label h50">支付方式</div>
          <div
            class="way-box ml0"
            :class="[typeActive===1?'way-box-active':'']"
            @click="type=typeChange(1, 2)"
          >
            <sn-icon type="alipay" color="#2A9FF6" size="26" class="icon"/>支付宝
          </div>
          <div
            class="way-box"
            @click="typeChange(2, 1)"
            :class="[typeActive===2?'way-box-active':'']"
          >
            <sn-icon type="wechat" color="#03C902" size="26" class="icon"/>微信
          </div>
          <div
            class="way-box"
            @click="typeChange(3, 4)"
            v-if="false"
            :class="[typeActive===3?'way-box-active':'']"
          >
            <img src="/image/unionpay.png" class="icon" width="33" height="26" alt>
            银联
          </div>
        </div>
        <div class="mt80 mb40" v-if="!rechargeLoading">
          <span>{{moneyShow}}</span>
          <span>元</span>
        </div>
        <div class="loading-wrapper" v-if="rechargeLoading">
          <Loading class="loading" :visible="rechargeLoading"></Loading>
          <div style="text-align: center;">正在充值，请稍后...</div>
        </div>
        <template v-if="false">
          <div class="dialog-btn">
            <sn-button
              type="primary"
              shape="circle"
              @click.native="chargeSubmit"
              size="stretch"
            >立即充值</sn-button>
          </div>
        </template>
        <template v-if="(typeActive === 2 || typeActive === 1) && !rechargeLoading">
          <div class="dialog-img">
            <img :src="qrcodeUrl" alt>
          </div>
          <p class="tip-1">请使用{{typeActive === 1 ? '支付宝':'微信'}}“扫一扫”完成支付</p>
          <p class="tip-2">
            付款码将在
            <span>30分钟</span>后失效
          </p>
          <!-- <p class="tip-2">
              正在充值请稍后...
          </p> -->
        </template>
      </div>
    </div>
    <div v-show="false" ref="submitGetRef"></div>
  </sn-modal>
</template>

<script >
import { Dialog } from "_c/dialog";
import { Icon, Button,FormItem,
  Form } from "_c";
import { Modal, Input } from "iview";
import { toRegularNum } from "@/mixins/globalMixin";
import { api_global } from "@/api";
import { axios } from "axios";
import { baseUrl } from "@/common/config";
import {debounce} from 'lodash'

const components = {
  "sn-modal": Modal,
  "sn-input": Input,
  "sn-icon": Icon,
  "sn-form": Form,
  "sn-form-item": FormItem,
  "sn-button": Button
};
const moneyList = [
  { value: 2000, txt: "2,000元" },
  { value: 3000, txt: "3,000元" },
  { value: 5000, txt: "5,000元" }
];
export default {
  name: "recharge",
  props: {
    visible: { type: Boolean }
  },
  data() {
    const validateBalance = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else {
        if (!/^[+]{0,1}(\d+)$/.test(value) || (parseInt(value) < 10 || parseInt(value) > 5000)) {
          callback(new Error('充值金额为10-5000元整数'));
        } else {
          callback();
        }
      }
    };
    return {
      isShow: false,
      typeActive: 2,
      moneyList,
      chooseIndex: 0,
      amount: 2000,
      orderInfo: "",
      balance: "",
      payType: 1,
      timer: null,
      payStatus: 0,
      payHtml: "",
      qrcodeUrl: '',
      rechargeLoading: false,
      generateUrl: "/charge/createOrder.json",
      wechatQrcodeUrl: "/charge/pay.json",
      alipayUrl: "/charge/pay.json",
      paySatusUrl: "/charge/orderStatus.json",
      formValidate: {
        balance: ''
      },
      ruleValidate: {
        balance: [{
          required: true,
          message: "充值金额为10-5000元整数",
          validator: validateBalance,
          trigger: "blur"
        }]
      }
    };
  },
  components,
  methods: {
    cleanData() {
      this.chooseIndex = 0;
      this.typeActive = 2;
      this.amount = 2000;
      this.balance = "";
      this.formValidate.balance = '';
      this.payType = 1;
      this.payStatus = 0;
      this.qrcodeUrl = '';
      this.orderInfo = "";
      this.rechargeLoading = false;
      this.$refs.submitGetRef.innerHTML = "";
    },
    visibleChange(val) {
      this.cleanData();
      if (val === false) {
        if (this.timer) {
          window.clearInterval(this.timer);
          this.timer = null;
        }
      }
      !val && this.$emit("visibleChange", val);
      if (val) {
        this.$nextTick(() => {
          this.typeChange(this.typeActive, this.payType);
        })
      }
    },
    async typeChange(val, payType) {
      this.typeActive = val;
      console.log(payType);
      this.rechargeLoading = false;
      if (this.timer) {
          window.clearInterval(this.timer);
          this.timer = null;
        }
      this.payType = payType;
      // if (payType === 1) {
        //微信
        this.rechargeLoading = true;
        let obj = {
          amount: this.amount,
          type: payType
        };
        let options = {
          url: this.generateUrl,
          data: obj
        };
        let res = await api_global.postMessage(options);
        this.orderId = res.msg;
        this.qrcodeUrl = baseUrl + this.wechatQrcodeUrl + "?id=" + res.msg;
        this.rechargeLoading = false;
        this.getStatus();
      // }
    },
    async chargeSubmit() {
      this.rechargeLoading = true;
      let obj = {
        amount: this.amount,
        type: this.payType
      };
      let options = {
        url: this.generateUrl,
        data: obj
      };
      let res = await api_global.postMessage(options);
      this.orderId = res.msg;
      window.open(baseUrl + this.alipayUrl + "?id=" + res.msg);
      this.getStatus();
    //   this.rechargeLoading = false;
    },
    chooseMoney(money, index) {
      this.chooseIndex = index;
      this.amount = money.value;
    },
    async getOrderStatus() {
        let options = {
            url: this.paySatusUrl,
            data: {
                id: this.orderId
            }
        };
        let res = await api_global.getMessage(options);
        let self = this;
        this.payStatus = res;
        if (this.payStatus == 1) {
          window.clearInterval(self.timer);
          this.timer = null;
          Dialog({
              type: "default",
              text: "充值成功",
              onConfirm() {
                  self.visibleChange(false);
                  self.rechargeLoading = false;
              },
              onCancel() {
                  self.visibleChange(false);
                  self.rechargeLoading = false;
              }
          });
        }
    },
    getStatus() {
        let self = this;
        let num = 0;
        self.timer = window.setInterval(() => {
            if (num == 24) {
                window.clearInterval(self.timer);
                this.timer = null;
                self.rechargeLoading = false;
                return;
            }
            if (this.payStatus == 1) {
                window.clearInterval(self.timer);
                this.timer = null;
                Dialog({
                    type: "default",
                    text: "充值成功",
                    onConfirm() {
                        self.visibleChange(false);
                        self.rechargeLoading = false;
                    },
                    onCancel() {
                        self.visibleChange(false);
                        self.rechargeLoading = false;
                    }
                });
                return;
            }
            this.getOrderStatus();
            num++;
        }, 5000);
    }
  },
  computed: {
    moneyShow() {
      return toRegularNum(this.amount);
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.isShow = val;
      },
      immediate: true
    },
    'formValidate.balance': function(val) {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          if (val !== '') {
            this.chooseIndex = -1;
            this.amount = val;
            debounce(function(){
              this.typeChange(this.typeActive, this.payType)
            }, 300);
          }
        }
      });
    },
    balance(val) {
      if (val !== "") {
        this.chooseIndex = -1;
        this.amount = parseFloat(val);
      }
    },
    amount:debounce(function (val) {
        this.typeChange(this.typeActive, this.payType)
    },200),
  }
};
</script>

<style scoped lang="less">
/*弹窗部分*/
/deep/ .ivu-modal-body {
  padding: 20px;
}

.dialog-title {
  height: 16px;
  font-size: 16px;
  font-weight: bold;
  color: rgba(53, 64, 82, 1);
  line-height: 1;
  box-sizing: content-box;
}
.mt50 {
  margin-top: 50px;
}
.mb30 {
  margin-bottom: 30px;
}
.ml90 {
  margin-left: 90px;
}
.flex {
  display: flex;
  margin-top: 35px;
  .label {
    width: 70px;
    height: 36px;
    line-height: 36px;
    text-align: right;
    font-size: 14px;
    font-weight: 400;
    color: rgba(127, 143, 164, 1);
    margin-right: 20px;
  }
  &:first-child {
    margin-top: 0;
  }
  .money-box {
    padding: 0 15px;
    height: 34px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(223, 226, 230, 1);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 400;
    color: rgba(74, 82, 98, 1);
    margin-left: 10px;
    cursor: pointer;
  }
  .money-box-active {
    background: #2a9ff6;
    color: rgba(255, 255, 255, 1);
  }
  .ml0 {
    margin-left: 0 !important;
  }
  .input {
    width: 360px;
  }
  .way-box {
    width: 120px;
    height: 50px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(223, 226, 230, 1);
    border-radius: 2px;
    margin-left: 20px;

    font-size: 14px;
    font-weight: 400;
    color: rgba(53, 64, 82, 1);

    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .icon {
      margin-right: 17px;
    }
  }
  .way-box-active {
    border: 1px solid rgba(3, 201, 2, 1);
    position: relative;
    &:after {
      content: "";
      display: inline-block;
      width: 0;
      height: 0;
      border-bottom: 28px solid rgba(3, 201, 2, 1);
      border-left: 28px solid transparent;
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 20;
    }
    &:before {
      content: "";
      display: inline-block;
      width: 12px;
      height: 7px;
      border-bottom: 2px solid #fff;
      border-left: 2px solid #fff;
      position: absolute;
      right: 2px;
      bottom: 6px;
      z-index: 21;
      transform: rotate(-45deg);
    }
  }
}

.dialog-box {
  .mt80 {
    margin-left: -90px;
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: bold;
    color: rgba(42, 159, 246, 1);
    line-height: 1;
    text-align: center;
    &:last-child {
      font-size: 14px;
    }
  }
  .dialog-img {
    margin-left: -90px;
    margin-top: 10px;
    text-align: center;
    img {
      width: 194px;
      height: 194px;
    }
  }
  .tip-1 {
    margin-left: -90px;
    margin-top: 20px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(42, 159, 246, 1);
    line-height: 1;
    text-align: center;
  }
  .tip-2 {
    margin-left: -90px;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: rgba(127, 143, 164, 1);
    line-height: 1;
    margin-top: 10px;
    margin-bottom: 36px;
    span {
      font-weight: Bold;
    }
  }
  .dialog-btn {
    margin-left: -90px;
    margin-top: 60px;
    text-align: center;
    margin-bottom: 202px;
  }
}
/deep/ .s-btn-stretch.s-btn-circle {
  border-radius: 30px;
  height: 40px;
  line-height: 40px;
  padding: 0 30px;
}
.vertical-center-modal .dialog-box .h50 {
  height: 50px;
  line-height: 50px;
}
.loading-wrapper {
  margin: 40px;
  text-align: center;
}
.charge-form{ 
  margin-left: 0;
  margin-top: 15px;
}
.w266 {
  width: 266px;
}
/*弹窗部分*/
</style>
