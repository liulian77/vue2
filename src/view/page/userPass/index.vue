<template>
  <sn-layout class="content">
    <sn-row class="container mt20">
      <h1>
        修改密码
        <span @click="toUserInfo">设置</span>
      </h1>
    </sn-row>
    <sn-row class="box setting-wrapper">
      <div class="content-body">
        <sn-row class="mb30">
          <sn-col span="16" clas="user-info-label">
            <sn-form
              ref="formValidate"
              :model="formValidate"
              :rules="ruleValidate"
              class="form-class"
              label-position="top"
              @submit.native.prevent
            >
              <sn-form-item label="账户密码" prop="password" key="password">
                <sn-input size="large" v-model="formValidate.password" type="password" placeholder="请输入账户密码"/>
              </sn-form-item>
              <sn-form-item label="新密码" prop="passwordNew" key="passwordNew">
                <sn-input size="large" v-model="formValidate.passwordNew" type="password" placeholder="请输入新密码"/>
              </sn-form-item>
              <sn-form-item class="submit-box mb0">
                <sn-button
                  type="primary"
                  class="primary"
                  @click.native="handleSubmitNext('formValidate')"
                >确定</sn-button>
              </sn-form-item>
            </sn-form>
          </sn-col>
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
  Option,
  SnPage,
  TableExpand,
  FormItem,
  Form,
  Input,
  Search
} from "_c";
import { mapState, mapActions } from "vuex";
import { Dialog } from "_c/dialog";
import {
  Layout,
  Content,
  Header,
  Modal,
  Table,
  Row,
  Col,
  Card,
  Avatar
} from "iview";
import { tableMixin } from "@/mixins";
import { deepCopy } from "@/utils/assist";
import { formatTime } from "@/mixins/globalMixin";
import {api_global} from '@/api'

const components = {
  "sn-table": Table,
  "sn-icon": Icon,
  "sn-button": Button,
  "sn-layout": Layout,
  "sn-content": Content,
  "sn-input": Input,
  "sn-header": Header,
  "sn-select": Select,
  "sn-option": Option,
  "sn-modal": Modal,
  "sn-form": Form,
  "sn-form-item": FormItem,
  "i-switch": Switch,
  "sn-page": SnPage,
  "sn-search": Search,
  "sn-row": Row,
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
      tableHeight: 645,
      userPassUrl: '/staff/editpassword.json',
      isFuzzy: true,
      fuzzyDel: ["page", "row"],
      formValidate: {
        password: "",
        passwordNew: ""
      },
      ruleValidate: {
        password: [
          {
            required: true,
            pattern: /^[0-9A-Za-z]{6,12}$/,
            min: 6,
            max: 12,
            message: "请填写6-12位英文或数字",
            trigger: "blur"
          }
        ],
        passwordNew: [
          {
            required: true,
            pattern: /^[0-9A-Za-z]{6,12}$/,
            min: 6,
            max: 12,
            message: "请填写6-12位英文或数字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions("basic", ["DoLogout"]),
    toUserInfo() {
      this.$router.push({ name: "userInfo" });
    },
    async exit() {
      await this.DoLogout();
      this.$router.push("/login");
    },
    handleSubmitNext() {
      let self = this;
      self.$refs["formValidate"].validate(async valid => {
        if (valid) {
          try {
            let submitObj = {
              old: self.formValidate.password,
              password: self.formValidate.passwordNew,
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
                self.exit();
              },
              onCancel() {
                self.exit();
              }
            });
          } catch (err) {}
        }
      });
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
    .form-class {
      width: 100%;
    }
  }
  .ivu-row {
    line-height: 36px;
  }
}
</style>
