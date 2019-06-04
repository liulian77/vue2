<template>
  <div class="login-box">
    <Loading :visible="loading"
      class="Loading"></Loading>
    <div class="login-ad"></div>
    <div class="login-content" v-if="loginShowIndex === 0">
      <div class="logo">
        用户登录
      </div>
      <div class="login-form">
        <p class="error-info"
          v-show="fail">
          <sn-icon type="warning" />{{errorInfo}}
        </p>
        <div class="login-item">
          <input type="text"
            placeholder="请输入用户名"
            maxlength="11"
            v-model="username"
            @keyup.enter="submit">
          <sn-icon type="username" />
        </div>
        <div class="login-item">
          <input type="password"
            placeholder="请输入密码"
            maxlength="12"
            v-model="password"
            @keyup.enter="submit">
          <sn-icon type="password" />
        </div>
        <div class="flex">
          <sn-checkbox-group class="login-keep" v-show="false"
            v-model="savePassword">
            <sn-checkbox value="true">记住登录信息</sn-checkbox>
          </sn-checkbox-group>
          <div class="forgot">
            <a href="javascript:;" @click="forgotPass">忘记密码</a>
          </div>
        </div>
        <sn-button type="primary"
          size="large"
          shape="circle"
          @click.native="submit">登录</sn-button>
      </div>
      <div class="bot-tools">
        还未注册?<router-link to="/register">注册</router-link>
      </div>
    </div>
    <div class="login-content" v-if="loginShowIndex !== 0">
      <div class="logo">
        找回密码
      </div>
      <div class="login-form">
        <p class="error-info"
          v-show="fail">
          <sn-icon type="warning" />{{errorInfo}}
        </p>
        <template v-if="loginShowIndex === 1">
          <div class="login-item">
            <input type="text"
              placeholder="请输入手机号"
              maxlength="11"
              v-model="mobile"
              @keyup.enter="resetPass">
            <sn-icon type="username" />
          </div>
          <div class="login-item">
            <input type="text" placeholder="请输入验证码" maxlength="6"  @keyup.enter="resetPass" v-model="vertifyCode">
            <sn-icon type="denglu-yanzhengma" :more="true"/>
            <a href="javascript:;" v-if="!vertifyClick" class="git-code" @click="getVertifyCode">立即获取</a>
            <span class="git-code" v-if="vertifyClick" >{{times}}秒后重发</span>
          </div>
        </template>
        <template v-if="loginShowIndex === 2">
          <div class="login-item">
            <input type="password"
              placeholder="请输入密码"
              v-model="passwordnew"
              maxlength="12"
              @keyup.enter="submitNow">
            <sn-icon type="password" />
          </div>
          <div class="login-item">
            <input type="password"
              placeholder="再次输入密码"
              v-model="passwordconfirm"
              maxlength="12"
              @keyup.enter="submitNow">
            <sn-icon type="password" />
          </div>
        </template>
        <sn-button type="primary"
          size="large"
          shape="circle"
          class="mt40"
          v-if="loginShowIndex === 1"
          @click.native="resetPass">重设密码</sn-button>
        <sn-button type="primary"
          size="large"
          shape="circle"
          class="mt40"
          v-if="loginShowIndex === 2"
          @click.native="submitNow">确认修改</sn-button>
      </div>
      <div class="bot-tools">
        已有账号<a href="javascript:;" @click="loginShowIndex = 0;clear();">登录</a>
      </div>
    </div>
  </div>
  
</template>

<script>
import {Icon,Button,Checkbox,CheckboxGroup} from "_c"
import { mapActions} from 'vuex'
import { Dialog } from "_c/dialog";
import { api_global } from "@/api";
import fetch from '@/common/fetch'

export default {
  components: {
    'sn-icon':Icon,
    'sn-checkbox':Checkbox,
    'sn-checkbox-group':CheckboxGroup,
    'sn-button':Button
  },
  data() {
    return {
      username: '',
      password: '',
      vertifyCode: '',
      vertifyClick: false,
      times: 60,
      fail: false,
      forgotUrl: '/login/forgetpwd.json',
      getCodeUrl: "/login/getcode.json",
      resetUrl: '/login/setpwd.json',
      timer: null,
      mobile: '',
      passwordnew: '',
      passwordconfirm: '',
      savePassword: [],
      resetId: '',
      loginShowIndex: 0,
      remember: 0,
      loading: false,
      errorInfo: ''
    }
  },
  watch: {
    savePassword(val) {
      val.length > 0 ? this.remember = 1 : this.remember = 0;
    }
  },
  methods: {
    ...mapActions('basic', [
      'DoLogin', 'AutoLogin','setMenu'
    ]),
    clear() {
      this.fail = false;
      this.username = '';
      this.mobile = '',
      this.vertifyCode = '';
      this.times = 60;
      this.password = '';
      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
      this.passwordnew = '';
      this.vertifyClick = false;
      this.passwordconfirm = '';
      this.savePassword = [];
    },
    forgotPass() {
      this.clear();
      this.loginShowIndex = 1;
    },
    async resetPass() {
      if (!this.checkBeforeSubmit()) {
        return false;
      }
      let obj = {
        phone: this.mobile,
        code: this.vertifyCode
      };
      let options = {
        url: this.forgotUrl,
        noDialog: true,
        data: obj
      };
      try {
        let res = await api_global.postMessage(options);
        this.resetId = res.msg;
        console.log(res,this.resetId);
        let self = this;
        self.loginShowIndex = 2;
        self.clear();
        // Dialog({
        //   type: "default",
        //   text: "操作成功",
        //   cancel: false,
        //   onConfirm() {
        //     self.loginShowIndex = 2;
        //     self.clear();
        //   },
        //   onCancel() {
        //     self.loginShowIndex = 2;
        //     self.clear();
        //   }
        // });
      } catch (errMsg) {
        this.fail = true;
        this.errorInfo = errMsg.data.msg;
      }
    },
    async submitNow() {
      if (!this.checkBeforeSubmit(1)) {
        return false;
      }
       let obj = {
        _id: this.resetId,
        password: this.passwordnew
      };
      
      try {
        let res = await fetch({
          method: 'PUT',
          url: this.resetUrl + `?_id=${obj._id}`,
          noDialog: true,
          data: obj
        });
        let self = this;
        Dialog({
          type: "default",
          text: "操作成功",
          cancel: false,
          onConfirm() {
            self.loginShowIndex = 0;
            self.clear();
          },
          onCancel() {
            self.loginShowIndex = 0;
            self.clear();
          }
        });
      } catch (errMsg) {
        this.fail = true;
        this.errorInfo = errMsg.data.msg;
      }
    },
    checkMobile() {
      if (!/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(this.mobile)) {
        this.errorInfo = "请输入手机号码";
        this.fail = true;
        return false;
      }
      return true;
    },
    checkBeforeSubmit(flag) {
      if (!flag) {
        let res = this.checkMobile();
        if (!res) {
          return res;
        }
        if (this.vertifyCode === '') {
          this.errorInfo = "输入的验证码有误";
          this.fail = true;
          return false;
        }
      }
      if (flag) {
        if (!/^[A-Za-z0-9]{6,16}$/.test(this.passwordnew)) {
          this.errorInfo = "密码请输入6-12位英文或数字";
          this.fail = true;
          return false;
        }
        if (this.passwordnew !== this.passwordconfirm) {
          this.errorInfo = "两次输入的密码不一致";
          this.fail = true;
          return false;
        }
      }

      return true;
    },
    getVertifyCode() {
      if (!this.checkMobile()) {
        return false;
      }
      let options = {
        url: this.getCodeUrl,
        noDialog: true,
        data: {
          phone: this.mobile
        }
      };
      this.vertifyClick = true;
      let num = 60;
      this.times = num;
      let self = this;
      api_global
        .getMessage(options)
        .then(res => {
          self.fail = false;
          self.timer = window.setInterval(() => {
            if (num === 0) {
              window.clearInterval(self.timer);
              self.timer = null;
              self.vertifyClick = false;
            }
            num--;
            self.times = num;
          }, 1000);
        })
        .catch(errMsg => {
          self.fail = true;
          self.errorInfo = errMsg.data.msg;
          self.vertifyClick = false;
        });
    },
    async submit() {
      let username = this.username.trim();
      let password = this.password.trim();
      let remember = this.remember;
      try {

        let {data}=await this.DoLogin({ remember, username, password });
        this.fail = false;

        /*删除*/
        // data.agent_id='1231231';
        // data.user_type=2;
        /*删除*/
        /* if(data.agent_id ===""){ //直客
            this.setMenu(3);
            this.$router.push({ name: 'advertiserIndex' });
        }else  */
        /* if(data.user_type===1 || data.user_type === 3){//广告商
            this.setMenu(2);
            this.$router.push({ name: 'advertiserIndex' });
        }else {  //代理商
            this.setMenu(1);
            this.$router.push({ name: 'agentIndex' });
        } */
        this.clear();
        this.$router.push({ name: 'index' });

      } catch (errMsg) {
          this.fail = true;
          this.errorInfo = errMsg.data.msg;
      }
    }
  },
  mounted(){

  },
  activated() {
    this.clear();
  }
};
</script>

<style lang="less">
html,
body {
  min-height: auto !important;
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f6f8fa;
}
.login-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  height: 100%;
  box-shadow:0 40px 40px rgba(219,220,223,.5);
  @media screen and (min-width: 750px) {
    height: auto;
  }
  background: #fff;
  .login-ad {
    display: none;
    @media screen and (min-width: 750px) {
      display: block;
      flex: 0 0 50%;
    }
    @media screen and (min-width: 970px) {
      flex: 0 0 62%;
    }
    min-height: 650px;
    background: url("/image/login-ad.jpg");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .login-content {
    flex: 0 0 100%;
    @media screen and (min-width: 750px) {
      flex: 0 0 50%;
    }
    @media screen and (min-width: 970px) {
      flex: 0 0 38%;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 70px;
      text-align: center;
      img {
        width: 86px;
      }
    }
    .login-form {
      position: relative;
      width: 80%;
      @media screen and (min-width: 750px) {
        width: 60%;
      }
      margin: 0 auto;
    }
    .login-item {
      position: relative;
      padding-left: 37px;
      border-bottom: #e3e4e4 1px solid;
      input {
        display: block;
        width: 100%;
        .line-height(50px);
        border: none;
        background: none;
        color: #354052;
        outline: none;
        caret-color: #1f96ee;
        &:focus + i {
          color: #1f96ee;
        }
        &::-webkit-input-placeholder {
          color: #c5ccd4;
        }
        &:-moz-placeholder {
          color: #c5ccd4;
        }
        &::-moz-placeholder {
          color: #c5ccd4;
        }
        &:-ms-input-placeholder {
          color: #c5ccd4;
        }
      }
      .s-icon,.iconfont-more {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        color:#A6AAB3;
      }
      .git-code {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .login-keep {
      display: block;
      margin: 20px 0 60px;
    }
  }
  .error-info {
    position: absolute;
    width: 100%;
    .line-height(34px);
    bottom: 100%;
    background: #fef3f3;
    border-radius: @border-radius-l;
    color: @error-color;
    .s-icon {
      margin: -2px 13px 0;
    }
  }
}
  .bot-tools {
    margin-top: 80px;
    text-align: center;
    color: #CBD1D8;
    a {
      color: #1F96EE;
      margin-left: 10px;
    }
  }
</style>
<style scoped lang="less">
.login-box {
  position: relative;
}
.Loading {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  -ms-transform: translateY(-50%); /* IE 9 */
  -moz-transform: translateY(-50%); /* Firefox */
  -webkit-transform: translateY(-50%); /* Safari 和 Chrome */
  -o-transform: translateY(-50%); /* Opera */
}
.flex {
  display: flex;
  justify-content: flex-end;
  .forgot {
    margin-top: 20px;
    margin-bottom: 40px;
  }
}
.mt40 {
  margin-top: 40px;
}
</style>
