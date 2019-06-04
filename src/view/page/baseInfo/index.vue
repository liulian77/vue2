<template>
  <sn-layout class="content">
    <sn-row class="container mt20">
      <h1>
        基本信息
        <span @click="toUserInfo">设置</span>
      </h1>
    </sn-row>
    <sn-row class="box setting-wrapper">
      <div class="content-body">
        <sn-row class="mb30">
          <sn-col span="4" clas="user-info-label">用户名</sn-col>
          <sn-col span="4" class="user-info-value font-gray">{{userinfo?userinfo.username : ''}}</sn-col>
        </sn-row>
        <sn-row class="mb30">
          <sn-col span="4" clas="user-info-label">邮箱</sn-col>
          <sn-col
            span="4"
            class="user-info-value font-gray"
            v-if="!modify"
          >{{userinfo?userinfo.email : ''}}</sn-col>
          <sn-col span="4" class="user-info-value font-gray" v-if="modify">
            <sn-input v-model="email"></sn-input>
            <div class="error" v-if="showError">请输入正确的邮箱地址</div>
          </sn-col>
          <sn-col span="4" class="user-info-value font-gray" v-if="!modify">
            <sn-button size="stretch" @click.native="modifyEmail">绑定邮箱</sn-button>
          </sn-col>
          <sn-col span="4" class="user-info-value font-gray" v-if="modify">
            <sn-button type="primary" size="stretch" @click.native="saveEmail">保存</sn-button>
          </sn-col>
        </sn-row>
        <sn-row class="mb30">
          <sn-col span="4" clas="user-info-label">手机号</sn-col>
          <sn-col span="4" class="user-info-value font-gray">{{userinfo?userinfo.mobile : ''}}</sn-col>
        </sn-row>
      </div>
    </sn-row>
  </sn-layout>
</template>

<script>
import {
  Button,
  Icon,
  Switch,
  Select,
  Input,
  Option,
  SnPage,
  TableExpand,
  Search
} from "_c";
import { mapState, mapActions } from "vuex";
import {
  Layout,
  Content,
  Header,
  Modal,
  Table,
  Row,
  Col,
  Card,
  Avatar,
  Message
} from "iview";
import { Dialog } from "_c/dialog";
import { tableMixin } from "@/mixins";
import { deepCopy } from "@/utils/assist";
import { formatTime } from "@/mixins/globalMixin";
import { api_global } from "@/api";
import fetch from "@/common/fetch";

const components = {
  "sn-table": Table,
  "sn-icon": Icon,
  "sn-button": Button,
  "sn-layout": Layout,
  "sn-content": Content,
  "sn-header": Header,
  "sn-select": Select,
  "sn-option": Option,
  "sn-modal": Modal,
  "i-switch": Switch,
  "sn-page": SnPage,
  "sn-search": Search,
  "sn-row": Row,
  "sn-input": Input,
  "sn-col": Col,
  "sn-card": Card,
  Avatar,
  TableExpand
};
const columns = [
  {
    title: "开发者名字",
    key: "puttime",
    render: (h, { row }) => {
      return h("span", {
        domProps: { innerHTML: formatTime(row.puttime * 1000) }
      });
    }
  },
  {
    title: "下载量",
    key: "operator"
  },
  {
    title: "开发者消费",
    key: "beeditor"
  },
  {
    title: "收益",
    slot: "optype"
  },
  {
    title: "操作",
    slot: "before"
  }
];
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
      filterObj: deepCopy(filterObj),
      columns: deepCopy(columns),
      tableData: [],
      saveUrl: "/staff.json",
      modify: false,
      baseInfo: null,
      showError: false,
      email: "",
      tableHeight: 645,
      isFuzzy: true,
      fuzzyDel: ["page", "row"]
    };
  },
  methods: {
    ...mapActions("basic", ["AutoLogin"]),
    toUserInfo() {
      this.$router.push({ name: "userInfo" });
    },
    modifyEmail() {
      this.modify = true;
    },
    async saveEmail() {
      let options = {
        url: this.saveUrl,
        data: {
          _id: this.userinfo._id,
          email: this.email
        }
      };
      if (!/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/.test(this.email)) {
        this.showError = true;
        return;
      }
      this.showError = false;
      await fetch({
        method: "PUT",
        url: this.saveUrl,
        data: {
          _id: this.userinfo._id,
          email: this.email
        }
      });
      // await api_global.postMessage(options);
      let self = this;
      Message.success('操作成功');
      
      self.AutoLogin();
      self.showError = false;
      self.modify = false;
        
    }
  },
  computed: {
    ...mapState("basic", ["userinfo"])
  },
  mounted() {
    this.email = this.userinfo.email;
  },
  activated() {
    this.email = this.userinfo.email;
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
        margin-right: 5px;
        cursor: pointer;
      }
    }
  }
  .box {
    background-color: #fff;
    margin: 15px 0;
    box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
    .content-body {
      padding: 30px 30px 30px;
      background-color: #fff;
      border: 1px solid #e8e8e8;
      border-top: 0;
      transition: 800ms;
      .user-info-value {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
  .ivu-row {
    line-height: 36px;
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
