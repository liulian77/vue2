<template>
  <sn-layout class="content">
    <sn-row class="row header">
      <sn-col span="6" class="card">
        <sn-icon type="flow-analysis" :size="30"></sn-icon>
        <div class="info">
          <p class="main">iOS 超级签名</p>
          <p>告别整数掉签烦恼</p>
        </div>
      </sn-col>
    </sn-row>
    <sn-row class="header mt20">
      <h1>账户资料</h1>
    </sn-row>
    <sn-row class="header">
      <sn-col span="12">
        <div class="main-card">
          <div slot="title" class="info-head">
            <div class="user-info">
              <Avatar
                style="background-color: #c5c5c5"
                icon="ios-person"
                size="large"
                class="ml10"
              />
              <div class="user-warpper">
                <h3 class>18202850955</h3>
                <div>
                  <span>已认证</span>
                  <span>个人版</span>
                </div>
              </div>
            </div>
            <div class="balance-info">
              <div>
                <p class="balance-title">账户余额</p>
                <p class="balance">
                  0.00
                  <span>元</span>
                </p>
              </div>
              <sn-button type="primary" size="stretch"
                  @click.native="withdraw">充值</sn-button>
            </div>
          </div>
          <sn-row class="footer">
            <sn-col span="8">
              <div class="foot-content">
                <p class="title">今日收益</p>
                <p>12</p>
              </div>
            </sn-col>
            <sn-col span="8">
              <div class="foot-content">
                <p class="title">今日下载</p>
                <p>12</p>
              </div>
            </sn-col>
            <sn-col span="8">
              <div class="foot-content no-border">
                <p class="title">开发者今日消费</p>
                <p>12</p>
              </div>
            </sn-col>
          </sn-row>
        </div>
      </sn-col>
      <sn-col span="12">
        <div class="container">
          <sn-row>
            <sn-col span="12">
              <sn-row class="mini-card">
                <sn-col class="card-icon" span="6">
                  <img src="/image/notes.png" alt>
                </sn-col>
                <sn-col span="18" class="card-content">
                  <p class="title">基本信息</p>
                  <p class="content">用户名、联系人、手机号、邮箱等</p>
                </sn-col>
              </sn-row>
            </sn-col>
            <sn-col span="12">
              <sn-row class="mini-card" @click.native="goto_financial">
                <sn-col class="card-icon" span="6">
                  <img src="/image/banknote.png" alt>
                </sn-col>
                <sn-col span="18" class="card-content">
                  <p class="title">财务信息</p>
                  <p class="content">账户余额、充值提现、收支记录</p>
                </sn-col>
              </sn-row>
            </sn-col>
          </sn-row>
          <sn-row>
            <sn-col span="12">
              <sn-row class="mini-card">
                <sn-col class="card-icon" span="6">
                  <img src="/image/folder.png" alt>
                </sn-col>
                <sn-col span="18" class="card-content">
                  <p class="title">我的方案</p>
                  <p class="content">价格方案</p>
                </sn-col>
              </sn-row>
            </sn-col>
            <sn-col span="12">
              <sn-row class="mini-card">
                <sn-col class="card-icon" span="6">
                  <img src="/image/setting.png" alt>
                </sn-col>
                <sn-col span="18" class="card-content">
                  <p class="title">通知设置</p>
                  <p class="content">手机短信、邮箱、微信通知</p>
                </sn-col>
              </sn-row>
            </sn-col>
          </sn-row>
        </div>
      </sn-col>
    </sn-row>
    <sn-content ref="tableContent" class="header mt20 tab-content">
      <sn-table
        v-if="!isMobile"
        :height="tableHeight"
        :columns="columns"
        :data="tableData"
        :loading="loading"
        @on-sort-change="handleSortChange"
        ref="table"
      >
        <!--optype before after-->
        <template slot-scope="{row}" slot="optype">
          <div class="plr5">
            <p v-for="(item,key) in row.optype" :key="key">{{item}}</p>
          </div>
        </template>
        <template slot-scope="{row}" slot="before">
          <div class="plr5">
            <p v-for="(item,key) in row.before" :key="key">{{item.name}} : {{item.value}}</p>
          </div>
        </template>
        <template slot-scope="{row}" slot="after">
          <div class="plr5">
            <p v-for="(item,key) in row.after" :key="key">{{item.name}} : {{item.value}}</p>
          </div>
        </template>
      </sn-table>
      <sn-page
        :total="totalCount"
        :current="filterObj.page"
        :page-size="filterObj.row"
        show-sizer
        show-elevator
        show-total
        placement="bottom"
        @on-change="handleChangePage"
        class="page"
        @on-page-size-change="handleChangeSizePage"
      ></sn-page>
    </sn-content>
    <sn-recharge :visible="modal" @visibleChange="visibleChange"></sn-recharge>
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
  Recharge,
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
  "sn-recharge": Recharge,
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
  mixins: [tableMixin],
  data() {
    return {
      modal: false,
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
    visibleChange(val) {
      this.modal = val;
    },
    withdraw() {
      this.modal = true;
    },
    goto_financial() {
      this.$router.push({name: 'financialInfo'})
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  padding: 15px 15px 0;
  .mt20 {
    margin-top: 20px;
  }
  .header {
    padding: 0 15px;
    .card {
      display: flex;
      font-size: 0;
      i {
        width: 40px;
        line-height: 70px;
        margin: 0 10px;
      }
      .info {
        font-size: 14px;
        display: flex;
        flex-direction: column;
        p {
          color: #9e9e9e;
          margin-top: 5px;
        }
        .main {
          color: #333;
          font-size: 16px;
          margin-top: 10px;
        }
      }
      &:hover {
        background: #fff;
        box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      }
    }
    h1 {
      color: #5a5959;
      margin-bottom: 5px;
      font-size: 16px;
      text-transform: none;
      font-weight: 400;
      padding: 0;
    }
    .main-card {
      background: #fff;
      box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      height: 245px;
      .info-head {
        background: #f5f6f8;
        padding: 35px 15px 0;
        height: 65%;
        display: flex;
        justify-content: space-between;
        .user-info {
          display: flex;
          .ivu-avatar {
            margin: 0 15px;
          }
          .user-warpper {
            width: 190px;
            h3 {
              font-size: 18px;
              color: #5a5959;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-weight: 400;
            }
          }
        }
        .balance-info {
          display: flex;
          margin-right: 15px;
          button {
            margin-top: 10px;
            margin-left: 15px;
          }
          .balance-title {
            color: #9e9e9e;
            font-size: 13px;
          }
          .balance {
            font-size: 30px;
            span {
              font-size: 13px;
            }
          }
        }
      }
      .footer {
        height: 35%;
        .ivu-col {
          height: 100%;
          .foot-content {
            border-right: 1px solid #eee;
            margin: 12px;
            padding: 5%;
            p {
              color: #5a5959;
            }
            .title {
              color: #9e9e9e;
            }
          }
          .no-border {
            border: none;
          }
        }
      }
    }
    .container {
      padding-right: 15px;
      padding-left: 15px;
      .mini-card {
        margin-bottom: 15px;
        margin-left: 15px;
        height: 115px;
        border: 1px solid #e8e8e8;
        background: #fff;
        box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
        .card-icon {
          background: #f5f6f8;
          height: 100%;
          text-align: center;
          margin: auto;
          line-height: 115px;
        }
        .card-content {
          color: #9e9e9e;
          p {
            margin: 0 0 10px;
          }
          .title {
            font-size: 16px;
            margin-top: 30px;
            padding: 0px 15px 0;
            color: #5a5959;
          }
          .content {
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .tab-content {
    /deep/ .ivu-table {
      th {
        background-color: #f5f6f8 !important;
        height: 48px !important;
      }
    }
  }
  /deep/ .s-btn-primary {
    background: linear-gradient(90deg, #348ef1, #49afff);
  }
}
</style>
