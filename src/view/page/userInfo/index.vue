<template>
  <sn-layout class="content">
    <sn-row class="container mt20">
      <h1>设置</h1>
    </sn-row>
    <sn-row class="container setting-wrapper">
      <sn-col span="8" class="setting-item user-center" >
        <div @click="toUserInfo">
          <div class="setting-icon">
            <img src="/image/notes.png" alt>
          </div>
          <div class="setting-title">基本资料</div>
          <div class="setting-content">查看和修改账户的基本资料</div>
        </div>
      </sn-col>
      <sn-col span="8" class="setting-item user-center">
        <div @click="toUserPass">
          <div class="setting-icon">
            <img src="/image/lock.png" alt>
          </div>
          <div class="setting-title">修改密码</div>
          <div class="setting-content">修改当前账号的登录密码</div>
        </div>
      </sn-col>
      <sn-col span="8" class="setting-item user-center">
        <div @click="toFinancial">
          <div class="setting-icon">
            <img src="/image/banknote.png" alt>
          </div>
          <div class="setting-title">财务信息</div>
          <div class="setting-content">查看消费记录和充值记录</div>
        </div>
      </sn-col>
    </sn-row>
    <sn-row class="container setting-wrapper mt20">
      <sn-col span="8" class="setting-item user-center no-after off">
        <div>
          <div class="setting-icon">
            <img src="/image/setting.png" alt>
          </div>
          <div class="setting-title">通知设置</div>
          <div class="setting-content">暂未开通</div>
        </div>
      </sn-col>
      <sn-col span="8" class="setting-item user-center off">
        <div>
          <div class="setting-icon">
            <img src="/image/invoice.png" alt>
          </div>
          <div class="setting-title">发票</div>
          <div class="setting-content">暂未开通</div>
        </div>
      </sn-col>
      <sn-col span="8" class="setting-item user-center no-after off">
        <div>
          <div class="setting-icon">
            <img src="/image/folder.png" alt>
          </div>
          <div class="setting-title">我的方案</div>
          <div class="setting-content">暂未开通</div>
        </div>
      </sn-col>
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
  Search
} from "_c";
import { mapState } from "vuex";
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
      getUrl: "/user/logs.json",
      isFuzzy: true,
      fuzzyDel: ["page", "row"]
    };
  },
  methods: {
    toUserInfo() {
      this.$router.push({ name: "baseInfo" });
    },
    toUserPass() {
      this.$router.push({ name: "userPass" });
    },
    toFinancial() {
      this.$router.push({ name: "financialInfo" });
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  padding: 15px 15px 0;
  margin: 0 15px;
  .mt20 {
    margin-top: 20px;
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
    }
    .user-center{
      text-align: center;
    }

    .setting-item {
      position: relative;
      padding: 40px 48px 30px;
      border: none;
      margin-top: 0;
      height: 219px;
      font-size: 13px;
      cursor: pointer;
      &.off {
        background: #fafafa;
        cursor: auto;
      }
      &:hover {
        background: #fafafa;
      }
      &:after {
        content: "";
        display: block;
        position: absolute;
        border-right: 1px solid #eff2f4;
        right: 0;
        height: 66%;
        top: 17%;
      }
      &.no-after {
        &:after {
          content: "";
          width: 0;
          height: 0;
        }
      }
      .setting-icon {
        margin-bottom: 32px;
        height: 34px;
      }
      .setting-title {
        font-size: 16px;
        margin-bottom: 14px;
      }
      .setting-content {
        color: #9e9e9e;
        min-height: 46px;
      }
    }
  }
}
</style>
