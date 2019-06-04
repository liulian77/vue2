<template>
  <Layout class="lay-main">
    <Header :class="{'s-header-xs': isMobile }">
      <div class="header-col menu_ico">
        <img title="菜单" v-on:click="toggleMenu" class="menu-img" src="/image/menu_ico.png">
      </div>
      <div class="header-col logo">
        <router-link to="/index">
          <img src="/image/logo.png" alt>
          <span>iOS App超级签名</span>
        </router-link>
      </div>
      <div class="header-col breadcrumb" >
        <!-- <Breadcrumb :breadCrumbList="breadCrumbList"></Breadcrumb> -->
        <!-- <div>
          <img src="/image/bread.png" alt="">
        </div>
        <div @click="addApp"><span>发布/更新应用</span></div> -->
      </div>
      <div class="header-col user">
        <!-- <Button type="default" class="help-btn" @click="infoVisibleChange(true)" size="stretch">自定义渠道</Button> -->
        <Dropdown  @on-click='dropdownClick'>
          <Button class="Poptip-btn">
            <template v-if="!isMobile">
              <span  class="ml10">{{userinfo?userinfo.username:''}}</span>
              <sm-icon type="arrow-down" class="arrow-down" size="10" color="#7f8fa4"/>
            </template>
            <img src="/image/avatar.png" class="poptip-btn-img" alt="">
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name='userInfo'><sm-icon type="modify"/><span>修改资料</span></DropdownItem>
            <DropdownItem name='logout'><sm-icon type="sign-out"/><span>退出</span></DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Header>
    <Layout class="lay-body">
      <Sider
        v-if="!collapsed"
        :class="{'sider-xs': isMobile }"
        width="siderWidth"
        v-clickoutside="handleClose"
      >
        <side-menu :width="siderWidth" ></side-menu>
      </Sider>
      <Content class="s-main-content">
        <router-view/>
      </Content>
    </Layout>
    <sn-modal
      :footer-hide="true"
      v-model="passwordDialog"
      class-name="vertical-center-modal"
      width="650"
      @on-visible-change="userPassVisibleChange">
      <div class="dialog-box">
        <div class="dialog-title">修改密码</div>
        <div class="mt44">
          <sn-form
            ref="userPassformValidate"
            :model="formValidate"
            :rules="ruleValidate"
            :label-width="140"
            @submit.native.prevent
            class="w440"
          >
            <sn-form-item label="原密码" prop="password" key="a">
              <sn-input
                size="large"
                v-model="formValidate.password"
                placeholder="请输入原密码"
                class="w300"
                type="password"
              />
            </sn-form-item>
            <sn-form-item label="新密码" prop="passwordNew" key="b">
              <sn-input
                size="large"
                v-model="formValidate.passwordNew"
                placeholder="请输入新密码"
                class="w300"
                type="password"
              />
            </sn-form-item>
            <sn-form-item label="确认新密码" prop="passwordConfirm" key="c">
              <sn-input
                size="large"
                v-model="formValidate.passwordConfirm"
                placeholder="请输入新密码"
                class="w300"
                type="password"
              />
            </sn-form-item>
            <sn-form-item class="submit-box mt40">
              <sn-button @click.native="handleReset('formValidate')">取消</sn-button>
              <sn-button
                type="primary"
                class="primary ml40"
                @click.native="handleSubmit('formValidate')"
              >确定</sn-button>
            </sn-form-item>
          </sn-form>
        </div>
      </div>
    </sn-modal>
  </Layout>
</template>


<script>
import { throttle } from "lodash";
import store from "@/store";
import Clickoutside from "@/directives/clickoutside";
const SideMenu = () =>
  import(/* webpackChunkName: "Menu" */ "_c/main/components/side-menu");
const Breadcrumb = () =>
  import(/* webpackChunkName: "Menu" */ "_c/main/components/breadcrumb");
import { Poptip, Icon, Button, Input, Form, FormItem } from "_c";
import { Dialog } from "_c/dialog";
import { mapActions, mapState, mapMutations } from "vuex";
import { Layout, Avatar, Sider, Content, Header, Modal,Dropdown,DropdownMenu,DropdownItem,Table } from "iview";
import { removeCookie } from "@/libs/util";
import { async } from "q";
import { api_global } from "@/api";
const table1 = {
  columns: [
    {
      title: '参数',
      key: 'param1'
    },
    {
      title: '是否必须',
      key: 'param2'
    },
    {
      title: '含义',
      key: 'param3'
    },
    {
      title: '说明',
      width: 350,
      key: 'param4'
    }
  ],
  data: [
    {param1: 'cn_id', param2: '否', param3: '渠道id', param4: '由开发者后台渠道管理生成'},
    {param1: 'cn_i2', param2: '否', param3: '自定义参数1', param4: '用于数据上报传递自定义参数，长度不超过100位，超长会被置空。该值中如果包含特殊号或中文则需进行urlencode编码,否则会影响参数传递'},
    {param1: 'cn_id3', param2: '否', param3: '自定义参数1', param4: '同上'},
  ]
};
const table2 = {
  columns: [
    {
      title: '参数',
      key: 'param1'
    },
    {
      title: '是否必须',
      key: 'param2'
    },
    {
      title: '含义',
      key: 'param3'
    },
    {
      title: '说明',
      width: 300,
      key: 'param4'
    }
  ],
  data: [
    {param1: 'name', param2: '是', param3: 'app名称', param4: '-'},
    {param1: 'bid', param2: '是', param3: 'app bundleid', param4: '-'},
    {param1: 'version', param2: '是', param3: 'app版本', param4: '-'},
    {param1: 'udid', param2: '否', param3: '设备udid', param4: '-'},
    {param1: 'cn_id', param2: '否', param3: '渠道id', param4: '由开发者后台渠道管理生成'},
    {param1: 'ud_id1', param2: '否', param3: '自定义参数1', param4: '用于数据上报传递自定义参数长度不超过100位'},
  ]
};

export default {
  name: "Main",
  components: {
    SideMenu,
    Breadcrumb,
    "sm-icon": Icon,
    "sm-poptip": Poptip,
    Sider,
    Layout,
    Avatar,
    Header,
    Content,
    "sn-button": Button,
    "sn-input": Input,
    "sn-form": Form,
    "sn-form-item": FormItem,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    'sn-table':Table,
    "sn-modal": Modal
  },
  data() {
    const validatePasswdConfirm = (rule, value, callback) => {
      if (this.formValidate.passwordNew !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      headerHeight: 50,
      collapsed: false,
      siderWidth: "4.5rem",
      passwordDialog: false,
      disabled: false,
      infoModal: false,
      table1,
      table2,
      userPassUrl: "/platform/upPassword.json",
      formValidate: {
        username: "",
        password: "",
        passwordNew: "",
        passwordConfirm: "",
        distributor_ratio: "",
        type: "",
        mobile: "",
        qq: "",
        email: "",
        memo: ""
      },
      ruleValidate: {
        password: [
          {
            required: true,
            pattern: /^[0-9A-Za-z]{6,12}$/,
            min: 6,
            max: 12,
            message: "请填写6-12位字母或数字",
            trigger: "blur"
          }
        ],
        passwordNew: [
          {
            required: true,
            pattern: /^[0-9A-Za-z]{6,12}$/,
            min: 6,
            max: 12,
            message: "请填写6-12位字母或数字",
            trigger: "blur"
          }
        ],
        passwordConfirm: [
          {
            required: true,
            pattern: /^[0-9A-Za-z]{6,12}$/,
            min: 6,
            max: 12,
            validator: validatePasswdConfirm,
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    isMobile: function(val) {
      if (val) {
        //移动
        this.siderWidth = "4.5rem";
        this.collapsed = true;
      } else {
        //PC
        this.siderWidth = "200px";
        this.collapsed = false;
      }
    },
    $route: {
      handler: function(newRoute) {
        this.SET_BREAD_CRUMB(newRoute);
      },
      immediate: true
    }
  },
  directives: { Clickoutside },
  computed: {
    ...mapState("basic", ["isMobile", "userinfo", "breadCrumbList",'domain']),
    titleShow() {
      if (this.breadCrumbList) {
        if (this.breadCrumbList[0].name.indexOf("advertiser") !== -1) {
          return "蒲公英";
        } else if (this.breadCrumbList[0].name.indexOf("agent") !== -1) {
          return "蒲公英";
        } else {
          return "";
        }
      }
    }
  },
  methods: {
    ...mapActions("basic", ["DoLogout", 'setShowUploadModal']),
    infoVisibleChange(val) {
      this.infoModal = val;
    },
    toggleMenu() {
      this.collapsed = !this.collapsed;
    },
    dropdownClick(name) {
      if (name === 'userInfo') {
        this.$router.push({name: 'userInfo'});
      } else {
        this.exit();
      }
    },
    handleClose(event) {
      if (
        !this.$el.querySelector(".menu-img").contains(event.target) &&
        this.isMobile
      ) {
        this.collapsed = true;
      }
    },
    ...mapMutations("basic", ["SET_BREAD_CRUMB"]),
    ...mapActions("basic", [
      "HandleSetDeviceType",
      "HandleSetDeviceScreen",
      "AutoLogin"
    ]),
    async exit() {
      await this.DoLogout();
      this.$router.push("/login");
    },
    modify() {
      this.$router.push("/userInfo");
    },
    userPassVisibleChange(val) {
      this.passwordDialog = val;
      if (!val) {
        this.formValidate.password = "";
        this.formValidate.passwordNew = "";
        this.formValidate.passwordConfirm = "";
      }
    },
    handleSubmit() {
      let self = this;
      self.$refs["userPassformValidate"].validate(async valid => {
        if (valid) {
          try {
            let submitObj = {
              _id: self.userinfo.login._id,
              oldpassword: self.formValidate.password,
              newpassword: self.formValidate.passwordNew,
              repeatpassword: self.formValidate.passwordConfirm
            };
            let options = {
              url: self.userPassUrl,
              data: submitObj
            };
            await api_global.postMessage(options);
            Dialog({
              type: "default",
              text: "操作成功",
              onConfirm() {
                self.userPassVisibleChange(false);
                self.exit();
              },
              onCancel() {
                self.userPassVisibleChange(false);
                self.exit();
              }
            });
          } catch (err) {}
        }
      });
    },
    async getAppList() {
      let options = {
        url: this.appListUrl,
        data: {
          page: 1,
          row: 0
        }
      };
      let res = await api_global.getMessage(options);
      this.appListInfo = res.aaData;

    },
    handleReset() {},
    addApp() {
      this.setShowUploadModal(true);
    }
  },
  mounted() {
    window.addEventListener(
      "resize",
      throttle(() => {
        this.HandleSetDeviceType();
        this.HandleSetDeviceScreen();
      }, 200),
      false
    );
    window.addEventListener("load", () => {
      this.HandleSetDeviceType();
      this.HandleSetDeviceScreen();
    });
  },
  async created() {
    let data=await  this.AutoLogin();
  },
  activated() {
    this.AutoLogin();
  }
};
</script>
<style lang="less" scoped>
@mobileHeaderHeight: 0.88rem;

.displayflex {
  display: flex;
  display: -webkit-flex;
}
.ivu-layout-header {
  box-shadow: 0 2px 4px rgba(33, 33, 33, 0.2);
  position: relative;
  z-index: 3;
  .displayflex;
  padding: 0;
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  .header-col {
    height: 100%;
  }
  .menu_ico {
    display: none;
  }
  .logo {
    flex: 0 1 260px;
    background: linear-gradient(-126deg, #49afff, #1863df);
    .displayflex;
    a {
      width: 100%;
      font-size: 0;
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      color: #fff;
      .logo-bg {
        display: inline-block;
        width: 30px;
        height: 34px;
        background: url(/image/logo.png) no-repeat;
        background-size: 131px 34px;
        vertical-align: middle;
      }
      i {
        display: inline-block;
        vertical-align: top;
      }
      span {
        margin-left: 10px;
        font-size: 14px;
      }
      img {
        position: relative;
        top: 9px;
      }
    }
  }
  .breadcrumb {
    flex-grow: 1;
  }
  .user {
    flex: 0 1 300px;
    text-align: right;
    padding-right: 30px;
  }
}
.lay-body {
  flex: 1;
  overflow-x: hidden;
}
.s-header-xs {
  height: @mobileHeaderHeight;
  line-height: @mobileHeaderHeight;
  .menu_ico {
    flex: 0 1 1rem;
    display: block;
    width: 0.6rem;
    img {
      width: 0.63rem;
      vertical-align: middle;
    }
  }
  .logo {
    flex: auto;
    flex-grow: 1;
    img {
      width: 1.15rem;
    }
  }
  .breadcrumb {
    display: none;
  }
  .user {
    flex: 0 1 1rem;
    text-align: center;
  }
}
.ivu-layout-sider {
  background-color: #fff;
  width: 260px;
  box-shadow: 0 0 10px 0 rgba(33, 33, 33, 0.2);
  height: 100%;
}
.s-main-content {
  background-color: #ebedf2;
  overflow-x: hidden;
  height: 100%;
}
.ivu-layout {
  
  width: 100%;
}
.lay-main {
  height: 100%;
}
.sider-xs {
  position: fixed;
  top: @mobileHeaderHeight;
  left: 0;
  width: 4.5rem !important;
  height: 100%;
  z-index: 100;
}
.breadcrumb {
  margin-left: 30px;
  display: flex;
  font-size: 0;
  cursor: pointer;
  span {
    color: #45474A;
    font-size: 14px;
  }
  img {
    vertical-align: middle;
    margin-right: 15px;
  }
}
.ivu-layout-content {
  flex: 1;
  background: #ebedf2;
  .ivu-layout {
    background: #ebedf2;

  }
}

.content-item {
  padding: 0 16px;
  display: flex;
  align-items: center;
  height: 42px;
  cursor: pointer;
}
.content-item:hover {
  background-color: #2a9ff6;
  color: #fff;
}
.ml10 {
  margin-left: 10px;
}
.arrow-down {
  transform: scale(0.6);
}
.Poptip-btn {
  cursor: pointer;
  border: none;
  background: none;
  outline: 0;
  img {
    width: 26px;
    border-radius: 50%;
    position: relative;
    top: 6px;
  }
}
/deep/ .vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  .ivu-modal {
    top: 0;
  }
}
.w300 {
  width: 300px;
}
.dialog-box {
  .dialog-title {
    height: 16px;
    font-size: 16px;
    font-weight: bold;
    color: rgba(53, 64, 82, 1);
    line-height: 1;
    box-sizing: content-box;
  }
  .mt44 {
    margin-top: 44px;
  }
  .w400 {
    width: 400px;
  }
  .ml40 {
    margin-left: 40px;
  }
}
.ivu-dropdown-item {
  padding: 0 16px;
  display: flex;
  align-items: center;
  height: 42px;
  cursor: pointer;
  &:hover {
    background-color: #2a9ff6;
    color: #fff;
  }
  span {
    margin-left: 10px;
  }
}
.help-btn {
  display: inline-block;
  height: 32px;
  line-height: 32px;
  margin-bottom: 0;
  font-weight: 400;
  text-align: center;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  user-select: none;
  padding: 0px 15px 0px;
  font-size: 12px;
  border-radius: 4px;
  transition: color .2s linear,background-color .2s linear,border .2s linear,box-shadow .2s linear;
  color: #515a6e;
  background-color: #fff;
  border-color: #dcdee2;
}
.info-item {
  h3 {
    text-align: center;
    font-size: 16px;
    margin: 10px;
  }
  li {
    p {
      text-indent: 2em;
    }
  }
  p {
    color: #7b7f83;
    line-height: 30px;
  }
}
.info-item-scroll {
  max-height: 700px;
  overflow: auto;
  margin-bottom: 20px;
  h4 {
    color: #7B7F83;
    font-weight: bold;
    font-size: 14px;
    margin-top: 20px;
    margin-bottom: 20px;
    .num {
      display:inline-block;
      width: 14px;
      height: 14px;
      color: #fff;
      font-size: 12px;
      background: #067AFE;
      border-radius: 50%;
      text-align: center;
      line-height: 14px;
      margin-right: 5px;
    }
  }
  .href {
    color: #067AFE;
  }
  .w19 {
    width: 19px;
    display: inline-block;
  }
  .mb0 {
    margin-bottom: 0;
  }
  .mb20 {
    margin-bottom: 20px;
  }
  .w35 {
    width: 35px;
    display: inline-block;
  }
}
.img-wrap {
  text-align: center;
}
</style>




