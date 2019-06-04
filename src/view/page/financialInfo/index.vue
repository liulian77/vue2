<template>
  <sn-layout class="content">
    <sn-row class="container mt20">
      <h1>财务信息</h1>
    </sn-row>
    <sn-row class="container main-wrapper">
      <sn-col class="box" span="24">
        <sn-row class="info">
          <sn-col span="12">
            <p>账户余额</p>
            <p>
              {{panelInfo?toRegularNum(panelInfo.balance):0}}
              <span>元</span>
            </p>
          </sn-col>
          <sn-col span="12">
            <sn-button type="primary" class="mgr mr30" @click.native="visibleChange(true)">充值</sn-button>
          </sn-col>
        </sn-row>
      </sn-col>
    </sn-row>
    <sn-header class="s-content-header">
      <div class="header-left">
        <sn-tabs type="card" class="Tabs-box" @on-click="tabsClick">
          <sn-tabPane label="消费记录"></sn-tabPane>
          <sn-tabPane label="充值记录"></sn-tabPane>
        </sn-tabs>
      </div>
      <div class="header-right">
<!--        <sn-select
          :width="130"
          class="mr10"
          placeholder="全部"
          v-if="tableShow === 0"
          v-model="filterObj.aid"
        >
          <sn-option label="全部" value></sn-option>
          <sn-option v-for="(item,idx) in appList" :label="item.name" :value="item._id" :key="idx"></sn-option>
        </sn-select>-->

        <scroll-select  class="mr10 flr h36"  v-model="filterObj.aid" :list="appList"  style="height: 35px;"         v-if="tableShow === 0"></scroll-select>

        <date-picker
          type="daterange"
          :options="options1"
          :confirm="true"
          placement="bottom-end"
          placeholder="选择日期"
          :clearable="false"
          style="width: 274px;"
          class="fll"
          @on-ok="selectDate"
          @on-change="getDownTime"
          v-model="date"
        ></date-picker>
      </div>
    </sn-header>
    <sn-content ref="tableContent" class="header tab-content">
      <sn-table0
        :tableHeight="tableHeight"
        :tableData="tableData"
        :loading="loading"
        @handleSortChange="handleSortChange"
        v-if="tableShow==0"
        ref="table"
      ></sn-table0>
      <sn-table1
        :tableHeight="tableHeight"
        :tableData="tableData"
        :loading="loading"
        @handleSortChange="handleSortChange"
        v-else-if="tableShow==1"
        ref="table"
      ></sn-table1>
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
  Search,
  SnPage,
  TableExpand,
  Recharge,
  scrollSelect,
} from "_c";
import { table0, table1 } from "./components";
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
  Avatar,
  DatePicker,
  Tabs,
  Notice,
  TabPane
} from "iview";
import { tableMixin } from "@/mixins";
import { deepCopy } from "@/utils/assist";
import { formatTime, toRegularNum } from "@/mixins/globalMixin";
import { api_global } from "@/api";
import moment from "moment";

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
  'sn-search':Search,
  "sn-table0": table0,
  "sn-table1": table1,
  "sn-row": Row,
  "sn-col": Col,
  "sn-card": Card,
  "sn-tabs": Tabs,
  "sn-recharge": Recharge,
  "sn-tabPane": TabPane,
  "date-picker": DatePicker,
  'scroll-select':scrollSelect,
  Avatar,
  TableExpand
};
const urls = ["/report/getlist.json", "/charge.json"];

let filterObj = {
  operator: "",
  beeditor: "",
  row: 10,
  page: 1,
};
let filterObjs = [
  {
    row: 10,
    page: 1,
    date: "",
    aid: "",
    need: 'price',
    sort_field: 'date',
    sort_dir: 'desc'
  },
  {
    row: 10,
    page: 1,
    date: "",
    sort_field: 'itime',
    sort_dir: 'desc'
  }
];
const datePickOption = {

};
const fuzzyDels = [["page", "row", 'date','need','aid','sort_field','sort_dir'], ["page", "row", 'date','need','sort_field','sort_dir']];
export default {
  name: "Index",
  components,
  mixins: [tableMixin],
  data() {
    return {
      modal: false,
      tableShow: 0,
      filterObj: deepCopy(filterObjs[0]),
      tableData: [],
      tableHeight: 645,
      datePickOption,
      date: "",
      appListUrl: "/apps.json",
      appList: null,
      panelUrl: "/home.json",
      getUrl: deepCopy(urls[0]),
      panelInfo: null,
      isFuzzy: true,
      fuzzyDel: deepCopy(fuzzyDels[0]),
      selectType: {
        1: "全部",
        2: "只看代理商",
        3: "只看广告主"
      },
      options1: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now();
      },
        shortcuts: [
          {
            text: "今天",
            value() {
              const start = new Date();
              const end = new Date();
              return [start, end];
            },
            onClick: picker => {
              this.isMobile && picker.handlePickSuccess();
            }
          },
          {
            text: "昨天",
            value() {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              return [start, end];
            },
            onClick: picker => {
              this.isMobile && picker.handlePickSuccess();
            }
          },
          {
            text: "最近7天",
            value() {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            },
            onClick: picker => {
              this.isMobile && picker.handlePickSuccess();
            }
          },
          {
            text: "最近30天",
            value() {
              const start = new Date();
              const end = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            },
            onClick: picker => {
              this.isMobile && picker.handlePickSuccess();
            }
          },
          {
            text: "本月",
            value() {
              const start = new Date();
              const end = new Date();
              start.setTime(start.setDate(1));
              return [start, end];
            },
            onClick: picker => {
              this.isMobile && picker.handlePickSuccess();
            }
          },
          {
            text: "上月",
            value() {
              var start = new Date();
              const end = new Date();
              var now = new Date();
              now.setDate(1);
              now.setHours(0, 0, 0, 0);
              var time = now.getTime() - 1;
              end.setTime(now.setTime(time));
              start.setTime(now.setDate(1));
              return [start, end];
            },
            onClick: picker => {
              this.isMobile && picker.handlePickSuccess();
            }
          }
        ]
      }
    };
  },
  methods: {
    toRegularNum,
    visibleChange(val) {
      this.modal = val;
    },
    tabsClick(active) {
      if (this.tableShow !== active) {
        this.tableData = [];
      }
      this.tableShow = active;
      this.filterObj = deepCopy(filterObjs[active]);
      let time = moment().format("YYYY-MM-DD");
      let start = moment().subtract(30, 'days').format('YYYY-MM-DD')
      this.date = [start, time];
      this.filterObj.date = start + " - " + time;
      this.fuzzyDel = deepCopy(fuzzyDels[active]);

      this.getUrl = deepCopy(urls[active]);
    },
    async getPanelInfo() {
      let options = {
        url: this.panelUrl
      };
      let res = await api_global.getMessage(options);
      this.panelInfo = deepCopy(res);
    },
    getDownTime(e) {
      if (e[0] !== '' && e[1] !== '') {
        let val = [new Date(e[0]), new Date(e[1])];
        if ((val[1].getTime() -val[0].getTime()) / 1000/60/60/24 > 31) {
          let d = (val[1].getTime() -val[0].getTime()) / 1000/60/60/24 - 31;
          val[1] = new Date(val[1].getTime() - d * 1000 * 60 * 60 *24);
          console.log(moment(val[0]).format('YYYY-MM-DD') + ' - ' + moment(val[1]).format('YYYY-MM-DD'));
          this.filterObj.date = moment(val[0]).format('YYYY-MM-DD') + ' - ' + moment(val[1]).format('YYYY-MM-DD');
          this.date = [val[0], val[1]];
          Notice.warning({title:'所选时间段大于31天,请选择31天以内'});
          return;
        }
        this.filterObj.date = e[0] + " - " + e[1];
      } else {
        this.filterObj.date = '';
      }
    },
    selectDate(e) {},
    async getAppList() {
      let options = {
        url: this.appListUrl,
        data: {
          sort_field: 'itime',
          sort_dir: 'desc',
          page: 1,
          row: 0
        }
      };
      let res = await api_global.getMessage(options);
      this.appList = res.aaData;
    }
  },
  created() {
    let time = moment().format("YYYY-MM-DD");
    let start = moment().subtract(30, 'days').format('YYYY-MM-DD')
    this.date = [start, time];
    this.filterObj.date = start + " - " + time;
    this.getPanelInfo();
    this.getAppList();
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
  .mgr {
    float: right;
  }
  .mr30 {
    margin-right: 30px;
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
    .box {
      background-color: #fff;
      margin: 15px 0;
      box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      .info {
        margin: 20px;
      }
    }
  }
  .s-content-header {
    height: 96px;
    padding: 30px 0;
    line-height: 36px;
    background: #ebedf2;
    display: flex;
    .header-left {
      flex: 1;
      display: flex;
      border-bottom: 1px solid #e1e3e8;
      /deep/ .ivu-tabs-tab {
        border: none;
        padding: 7px 20px;
        &:hover {
          &:after {
            content: "";
            position: absolute;
            bottom: 1px;
            left: 0;
            width: 100%;
            height: 1px;
            background: #4297ff;
          }
        }
      }
      /deep/ .ivu-tabs-tab-active {
        border: none;
        background: none;
        color: #4297ff;
        &:after {
          content: "";
          position: absolute;
          bottom: 1px;
          left: 0;
          width: 100%;
          height: 1px;
          background: #4297ff;
        }
      }
    }
    .header-right {
      width: 760px;
      height: 36px;
      line-height: 36px;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
    }
  }
  /deep/ .s-btn-primary {
    background: linear-gradient(90deg, #348ef1, #49afff);
  }
}
.fll {
  margin-left: 15px;
  height: 36px;
  /deep/ .ivu-input-icon {
    margin-top: 2px;
  }
  /deep/ .ivu-input {
    height: 35px;
  }
}
/deep/ .ivu-table {
  th {
    background-color: #F4F5F7 !important;
    height: 60px !important;
    span {
      color: #ADB1B6;
      font-weight: normal;
    }
  }
  td {
    border-bottom: 1px solid #f2f3f5;
  }
}
  .w130{
    width: 130px;
    /deep/ .ivu-select-single .ivu-select-selection{
      height: 36px;
      line-height: 36px;
    }
  }
  .h36 {
    height: 35px;
    /deep/ .ivu-select-selection {
      height: 35px;
      line-height: 35px;
    }
  }
</style>
