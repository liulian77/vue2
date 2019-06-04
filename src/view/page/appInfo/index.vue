<template>
  <sn-layout class="content">
    <sn-row class="container mt20">
      <h1>
        {{detail.name}}
        <!--<sn-button type="primary">上传新版本</sn-button> -->
      </h1>
    </sn-row>
    <sn-header class="s-content-header">
      <div class="header-left">
        <sn-tabs type="card" class="Tabs-box" @on-click="tabsClick">
          <sn-tabPane label="应用概述" name="name1" :index="1"></sn-tabPane>
          <sn-tabPane label="统计" name="name2" :index="2"></sn-tabPane>
          <sn-tabPane label="下载记录" name="name3" :index="3"></sn-tabPane>
          <sn-tabPane label="启动记录" name="name4" :index="4"></sn-tabPane>
          <sn-tabPane label="渠道" name="name5"  :index="5"></sn-tabPane>
          <sn-tabPane label="消息推送" name="name6" :index="6" v-if="messageShow"></sn-tabPane>
          <sn-tabPane label="设置" name="name7" :index="7"></sn-tabPane>
        </sn-tabs>
      </div>
    </sn-header>
    <sn-row class="container" v-if="tableShow==='name1'">
      <section class="box">
        <div class="content-body app-info-content">
          <div class="app-info-row">
            <div class="app-info">
              <div class="app-image">
                <img :src="detail.icon ? domain.static + detail.icon : ''" alt>
              </div>
            </div>
            <div class="app-view-btn app-info">
              <div class="app-detail pull-left">
                <div class="app-name-group">{{detail.name}}</div>
                <p class="app-attrs">
                  <span>版本：{{detail.version}}</span>
                </p>
                <p class="app-attrs">
                  <span>{{'适用于 IOS 设备'}}</span>
                </p>
              </div>
              <div class="app-view-btn-group">
                <sn-button type="primary" @click.native="visibleChange(true)">更新应用</sn-button>
              </div>
            </div>
          </div>

          <div class="app-info-section">
            <div class="app-info-item">
              <div class="first">今日下载量</div>
              <div>
                <span>{{detail.todayDown ? detail.todayDown : 0}}</span>
              </div>
            </div>
            <div class="app-info-item">
              <div class="first">总下载量</div>
              <div>
                <span>{{detail.allDown ? (detail.allDown + detail.todayDown) : 0}}</span>
              </div>
            </div>
            <div class="app-info-item">
              <div class="first">Bundle ID</div>
              <div>
                <span>{{detail.bundle_id ? detail.bundle_id : ''}}</span>
              </div>
            </div>
            <div class="app-info-item">
              <div class="first">下载地址</div>
              <div>
                <span>
                  <a
                          :href="`https://${detail.host}${domain.domain}`"
                          target="_blank"
                  >https://{{ detail.host ? detail.host + domain.domain : ''}}</a>
                </span>
              </div>
            </div>
          </div>
          <div></div>
        </div>
        <div class="h30"></div>
        <s-card  style="height: 300px;" class="detail-wrapper"> 
          <div class="head-info">汇总
            <sn-poptip placement="bottom-start" trigger="hover">
              <sn-icon type="explain" color="#ddd" :size="16" class="tips"></sn-icon>
            <div class="tips-table" slot="content">
              <p>新增用户：第一次启动应用的用户</p>
              <p>活跃用户：启动过应用的用户（去重），启动过一次的用户即视为活跃用户，包括新用户与老用户</p>
              <p>启动次数：截止到现在，应用的总启动次</p>
              <p>累计用户：截止到现在，启动过应用的所有独立用户</p>
            </div>
            </sn-poptip>
          </div>
          <div class="detail">
            <div class="today">
              <div class="detail-item">
                <div class="icon">今日</div>
              </div>
              <div class="detail-item">
                <p>新增用户</p>
                <h3>{{todayYestdayInfo ? todayYestdayInfo.now.new_user : 0}}</h3>
              </div>
              <div class="detail-item">
                <p>活跃用户</p>
                <h3>{{todayYestdayInfo ? todayYestdayInfo.now.active_user : 0}}</h3>
              </div>
              <div class="detail-item">
                <p>启动次数</p>
                <h3>{{todayYestdayInfo ? todayYestdayInfo.now.launch : 0}}</h3>
              </div>
              <div class="detail-item">
                <p>累计用户</p>
                <h3>{{todayYestdayInfo ? todayYestdayInfo.now.total_user : 0}}</h3>
              </div>
            </div>
            <div class="yestday">
              <div class="detail-item">
                <div class="icon">昨日</div>
              </div>
              <div class="detail-item">
                <p>新增用户</p>
                <h3>{{todayYestdayInfo ? todayYestdayInfo.pre.new_user : 0}}</h3>
              </div>
              <div class="detail-item">
                <p>活跃用户</p>
                <h3>{{todayYestdayInfo ? todayYestdayInfo.pre.active_user : 0}}</h3>
              </div>
              <div class="detail-item">
                <p>启动次数</p>
                <h3>{{todayYestdayInfo ? todayYestdayInfo.pre.launch : 0}}</h3>
              </div>
              <div class="detail-item">
                <p>累计用户</p>
                <h3>{{todayYestdayInfo ? todayYestdayInfo.pre.total_user : 0}}</h3>
              </div>
            </div>
          </div>
        </s-card>
        <div class="h30"></div>
        <s-card style="height: 600px;">
          <p slot="subTitle">(最近7天)</p>
          <report-main :lineSeries="lineSeries1"></report-main>
        </s-card>
      </section>
    </sn-row>
    <sn-row class="container mt20" v-if="tableShow==='name2'">
      <s-card  style="height: 600px;"> <!-- 下载统计  -->
        <div slot="title" class="scard-title-wrap">
          <div class="fl br" v-if="legendChecked.indexOf('pv') !== -1">PV：{{pvNum}}</div>
          <div class="fl ml10 br" v-if="legendChecked.indexOf('uv') !== -1">UV：{{uvNum}}</div>
          <div class="fl ml10 br" v-if="legendChecked.indexOf('ip') !== -1">独立IP：{{ipNum}}</div>
          <div class="fl ml10 br" v-if="legendChecked.indexOf('down') !== -1">总下载量：{{downNum}}</div>
          <div class="fl ml10 br" v-if="legendChecked.indexOf('launch') !== -1">启动次数：{{launchNum}}</div>
          <div class="fl ml10 br" v-if="legendChecked.indexOf('active_user') !== -1">活跃用户：{{activeUserNum}}</div>
          <div class="fl ml10" v-if="legendChecked.indexOf('new_user') !== -1">新增用户：{{newUserNum}}</div>
          <date-picker
                  type="daterange"
                  :options="options1"
                  :confirm="true"
                  placement="bottom-end"
                  placeholder="选择日期"
                  style="width: 274px"
                  class="flr"
                  v-model="date"
                  v-if="tableShow==1"
          ></date-picker>
          <scroll-select placeholder="请选择渠道"  :image="false" all="全部渠道" :list="channelsList" name="_id" label="name" class="mr10 flr" v-model="getChartChannel"></scroll-select>
        </div>
        <!-- <p slot="subTitle">(最近7天)</p> -->
        <report-main :lineSeries="lineSeries" @legendChange="legendChange"></report-main>
      </s-card>
      <div class="h30"></div>
      <div class="flex" style="height: 600px" >
        <div  class="EChartsMap">
          <s-card>
            <p slot="title" v-if="filteType === 'count'">区域下载量</p>
            <p slot="title" v-if="filteType === 'pv'">区域PV</p>
            <p slot="title" v-if="filteType === 'uv'">区域UV</p>
            <p slot="title" v-if="filteType === 'ip'">区域独立IP</p>
            <p slot="title" v-if="filteType === 'launch'">区域启动次数</p>
            <EChartsMap :option="mapData"></EChartsMap>
          </s-card>
        </div>
        <div class="top">
          <div>
            <date-picker
                  type="daterange"
                  :options="options1"
                  :confirm="true"
                  placement="bottom-end"
                  placeholder="选择日期"
                  style="width: 274px"
                  class="flr"
                  v-model="dateMap"
            ></date-picker>
            <scroll-select :image="false" placeholder="请选择" :list="filterListMap" :showAll="false" v-model="filteType" name="value" label="txt" class="mr10 flr"></scroll-select>
            <scroll-select placeholder="请选择渠道" :image="false" all="全部渠道" :list="channelsList" name="_id" label="name" class="mr10 flr" v-model="getMapChannel"></scroll-select>

          </div>
          <div class="top-box">
            <p class="area-list-title " v-if="filteType === 'count'">区域下载 Top10</p>
            <p class="area-list-title " v-if="filteType === 'pv'">区域PV Top10</p>
            <p class="area-list-title " v-if="filteType === 'uv'">区域UV Top10</p>
            <p class="area-list-title " v-if="filteType === 'ip'">区域独立IP Top10</p>
            <p class="area-list-title " v-if="filteType === 'launch'">启动次数 Top10</p>
            <div class="sub bold">
              <div>区域名称</div>
              <div v-if="filteType === 'count'">下载量</div>
              <div v-if="filteType === 'pv'">PV</div>
              <div v-if="filteType === 'uv'">UV</div>
              <div v-if="filteType === 'ip'">独立IP</div>
              <div v-if="filteType === 'launch'">启动次数</div>
            </div>
            <div class="sub" v-for="(item,i) in rank" :key="i">
              <div>{{item.name}}</div>
              <div v-if="filteType === 'count'">{{item.count}}</div>
              <div v-if="filteType === 'ip'">{{item.ip}}</div>
              <div v-if="filteType === 'pv'">{{item.pv}}</div>
              <div v-if="filteType === 'uv'">{{item.uv}}</div>
              <div v-if="filteType === 'launch'">{{item.launch}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex" style="height: 600px">
        <div class="EChartsMap">
          <s-card>
            <p slot="title" class="scard-title-wrap">
              <template v-if="filteTypePie === 'count'">下载统计 &nbsp;<span>总下载数量: {{pieCurren}}</span></template>
              <template v-if="filteTypePie === 'pv'">PV统计 &nbsp;<span>PV数量: {{pieCurren}}</span></template>
              <template v-if="filteTypePie === 'uv'">UV统计 &nbsp;<span>UV数量: {{pieCurren}}</span></template>
              <template v-if="filteTypePie === 'ip'">独立IP统计 &nbsp;<span>独立IP数量: {{pieCurren}}</span></template>
              <template v-if="filteTypePie === 'launch'">启动次数统计 &nbsp;<span>启动次数: {{pieCurren}}</span></template>
              <template v-if="filteTypePie === 'active_user'">活跃用户统计 &nbsp;<span>活跃用户数量: {{pieCurren}}</span></template>
              <template v-if="filteTypePie === 'new_user'">新增用户统计 &nbsp;<span>新增用户数量: {{pieCurren}}</span></template>
            </p>
            <EChartsPie :option="pieData"></EChartsPie>
          </s-card>
        </div>
        <div class="top">
          <div>
            <date-picker
                      type="daterange"
                      :options="options1"
                      :confirm="true"
                      placement="bottom-end"
                      placeholder="选择日期"
                      style="width: 274px"
                      class="flr"
                      v-model="pieDate"
              ></date-picker>
              <scroll-select :image="false" placeholder="请选择" :list="filterList" :showAll="false" v-model="filteTypePie" name="value" label="txt" class="mr10 flr"></scroll-select>
          </div>
          <div class="top-box2">
            <sn-table :columns="table2.columns" :height="370" :data="table2.data"></sn-table>
          </div>
        </div>
      </div>
      <s-card  style="height: 600px;" v-if="false">
        <p slot="title">
          IP下载量（top20)
          <date-picker
                  type="daterange"
                  :options="options1"
                  :confirm="true"
                  placement="bottom-end"
                  placeholder="选择日期"
                  style="width: 274px"
                  class="flr"
                  v-model="barDate"
          ></date-picker>
          <scroll-select placeholder="请选择渠道" :image="false" all="全部渠道" :list="channelsList" name="_id" label="name" class="mr10 flr" v-model="getDownChannel"></scroll-select>
        </p>
        <EChartsBar :option="barData"></EChartsBar>
      </s-card>
      <div class="h30"></div>
    </sn-row>
    <sn-row class="container" v-if="tableShow==='name3'"> <!--下载记录-->
      <sn-row class="mrb10">
        <sn-col span="20" offset="4">
          <div class="head-right">
            <date-picker
                    type="daterange"
                    :options="options1"
                    :confirm="true"
                    placement="bottom-end"
                    placeholder="选择日期"
                    style="width: 274px"
                    class="fll"
                    @on-ok="selectDate"
                    @on-change="getDownTime"
                    v-model="dateTable"
            ></date-picker>
          </div>
        </sn-col>
      </sn-row>
      <sn-table
              v-if="!isMobile"
              :height="tableHeight"
              :columns="columns"
              :data="DownloadRecord"
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
    </sn-row>
    <sn-row class="container" v-if="tableShow === 'name4'"> <!--启动记录-->
      <startRecord></startRecord>
    </sn-row>
    <sn-row class="container" v-if="tableShow === 'name5'">
      <Channels></Channels>
    </sn-row>
    <sn-row class="container" v-if="tableShow === 'name6'">
      <MessagePush></MessagePush>
    </sn-row>
    <sn-row class="container" v-if="tableShow === 'name7'">
      <dataReport :appinfo="detail" @updateInfo="getAppList"></dataReport>
    </sn-row>
	  <uploadApp :visible="updateAppModal" uploadBtnId="appInfoUploadApp"  title="更新应用" @visibleChange='visibleChange' :appInfo="detail"></uploadApp>
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
        Report,
        SCard,
        Search,
        scrollSelect,
        EChartsMap,
        EChartsBar,
        EChartsPie,
        uploadApp
    } from "_c";
    import { mapState } from "vuex";
    import moment from 'moment'
    import { debounce } from 'lodash'
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
        TabPane,
    } from "iview";
    import { Channels, dataReport,startRecord, MessagePush } from './components';
    import { tableMixin } from "@/mixins";
    import { deepCopy } from "@/utils/assist";
    import { formatTime } from "@/mixins/globalMixin";
    import { api_global } from "@/api";
    import { constants } from "crypto";
    import Poptip from "_c/poptip";
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
        'scroll-select':scrollSelect,
        "sn-search": Search,
        "sn-row": Row,
        "sn-col": Col,
        "sn-card": Card,
        "sn-tabs": Tabs,
        'sn-poptip': Poptip,
        "sn-tabPane": TabPane,
        "date-picker": DatePicker,
        "report-main": Report,
        "report-mains": Report,
        "s-card": SCard,
        dataReport,
        EChartsMap,
        EChartsBar,
        EChartsPie,
        Channels,
        MessagePush,
        startRecord,
        Avatar,
        uploadApp,
        TableExpand
    };
    const userTypeMap = {
      1: '新用户',
      2: '老用户',
      3: '重新下载',
      4: '更新'
    };
    const columns = [
        {
            title: "应用名称",
            key: "name"
        },
        {
            title: "单价",
            key: "price"
        },
        {
            title: "UDID",
            key: "udid"
        },
        {
            title: "设备型号",
            key: "product"
        },
        {
            title: "软件版本",
            key: "version"
        },
        {
            title: "IP",
            key: "ip"
        },
        {
            title: "用户状态",
            render: (h, {row}) => h('span', {domProps: {innerHTML: userTypeMap[row.user_type]}})
        },
        {
            title: "下载时间",
            key: "itime"
        }
    ];
    let filterObj = {
        row: 10,
        page: 1
    };
    let filterObjs = {
      2: {
          row: 10,
          page: 1
      },
      3: {
          row: 10,
          page: 1
      }
    };
    let urls = {
      2: '',
      3: ''
    };
    const filterList = [
      {txt: 'PV', value: 'pv'},
      {txt: 'UV', value: 'uv'},
      {txt: '下载量', value: 'count'},
      {txt: 'IP', value: 'ip'},
      {txt: '启动次数', value: 'launch'},
      {txt: '活跃用户', value: 'active_user'},
      {txt: '新增用户', value: 'new_user'}
    ];
    const filterListMap = [
      {txt: 'PV', value: 'pv'},
      {txt: 'UV', value: 'uv'},
      {txt: '下载量', value: 'count'},
      {txt: 'IP', value: 'ip'}
    ];
    const table2 = {
      columns: [
        {
          title: '渠道名',
          key: 'channel',
          render: (h, {row}) => h('span', {domProps: {innerHTML: row.channel === '' ? '未知' : row.channel}})
        },
        {
          title: 'PV',
          key: 'pv'
        },
        {
          title: 'UV',
          key: 'uv'
        },
        {
          title: 'IP',
          key: 'ip'
        },
        {
          title: '下载量',
          key: 'count'
        },
        {
          title: '启动次数',
          key: 'launch'
        },
        {
          title: '新增用户',
          key: 'active_user'
        },
        {
          title: '活跃用户',
          key: 'new_user'
        }
      ],
      data: [
      ]
    };
    export default {
        name: "Index",
        components,
        mixins: [tableMixin],
        data() {
            let self=this;
            return {
              filterObj: deepCopy(filterObj),
              columns: deepCopy(columns),
              table2,
              updateAppModal: false,
              filteType: 'count',
              filteTypePie: 'count',
              filterList,
              filterListMap,
              getChartChannel: '',
              getMapChannel: '',
              getDownChannel: '',
              legendChecked: ['pv', 'uv'],
              tableShow: 'name1',
              tableData: [],
              tableHeight: 585,
              getUrl: "",
              isFuzzy: true,
              chartInfo: null,
              fuzzyDel: ["page", "row"],
              date: [moment(new Date()).subtract(1,'months').toDate(),moment().toDate()],
              barDate: [moment(new Date()).subtract(1,'months').toDate(),moment().toDate()],
              pieDate: [moment(new Date()).subtract(1,'months').toDate(),moment().toDate()],
              dateTable: [moment(new Date()).subtract(1, 'months').toDate(),moment().toDate()],
              appListUrl: "/appsnew.json",
              appDownloadUrl: "/download.json",
              detail: {},
              // appChartInfoUrl: "/report/getchart.json",
              appChartInfoUrl: "/reportnew/getchart.json",
              DownloadRecord: [],
              DownloadRecords: [],
              chartDate: [],
              startTime: "",
              endTime: "",
              downNum: "",
              pvNum: "",
              uvNum: "",
              ipNum: "",
              launchNum: '',
              activeUserNum: '',
              newUserNum: '',
              pieCurren: '',
              sevDayData: [],
              selectType: {
                  1: "全部",
                  2: "只看代理商",
                  3: "只看广告主"
              },
              options1: {
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
                  ],
                  disabledDate (date) {
                      let start=new Date();
                      let startTime= start.setTime(new Date().setHours(0,0,0,0));
                      return date.getTime() >startTime;
                  }
              },
              lineData:[],
              lineData1:[],
              channelsList: [],
              mapData: {
                  tooltip: {
                      formatter: function (data) {
                          let str = ` <span style="color:#354052;font-weight: bolder;font-size: 12px;">${data.name ? data.name : ''}</span>
                      <br/>
                      <span>下載量：<span style="color: #2a9ff6;font-size: 12px;">${data.value ? data.value : 0}</span>次</span>
                      `;
                          return str;
                      },
                  },
                  series: [
                      {
                          data: []
                      },
                  ],
                  visualMap: {
                      text:['High','Low'],
                      realtime: false,
                      calculable: false,
                      //show:false,
                      inRange: {
                          color: ['lightskyblue','yellow', 'orangered']
                      }
                  },
              },
              dateMap:[moment(new Date()).subtract(1, 'months').toDate(), moment().toDate()],
              rank:[],
              barData: {
                  tooltip: {
                    backgroundColor: '#fff',
                    padding: [25, 70, 25, 25],
                    borderColor: '#dfe2e6',
                    formatter: function (data) {
                      return `
                          <span style="color: #354052;font-size: 16px;font-weight: bolder;margin-bottom: 10px;display: block">${data[0].axisValue}</span>
                          <span style="color: #7f8fa4;font-size: 12px;margin-bottom: 7px;display: block">下载量： ${data[0].value}</span>`;
                    }
                  },
                  xAxis: [{
                      data: [],
                  }],
                  series: [{
                      data: []
                  }]
              },
              pieCurrentData: null,
              pieData: {
                legend: {
                  orient: 'vertical',
                  // right: '15%',
                  // top: '20%',
                  x: 'left',
                  data: [],
                  formatter: function (name, a, b, c) {
                    return name + ` ${self.pieCurrentData[name]}`;
                  }
                },
                tooltip: {
                  formatter: '{b}: {c}次 {d}%'
                },
                series : [
                      {
                          data:[],
                          labelLine: {
                              normal: {
                                  show: false
                              }
                          },
                          selectedMode: 'single',
                          label: {
                              normal: {
                                  show: false,
                              },
                              emphasis: {
                                  show: false,
                              }
                          },
                      }
                  ]
              },
              todayYestdayInfo: null
            };
        },
        computed: {
            ...mapState('basic',['domain']),
            messageShow() {
              if (this.detail) {
                console.log(this.detail.has_push);
                if (this.detail.has_push == 1) {
                  return true;
                } else{
                  return false;
                }
              } else {
                return false;
              }
            },
            lineSeries() {
                let lineData=deepCopy(this.lineData);
                this.downNum = lineData.reduce((result, curr) => {
                    result += curr.count?curr.count:0;
                    return result;
                }, 0);
                this.pvNum = lineData.reduce((result, curr) => {
                    result += curr.pv?curr.pv:0;
                    return result;
                }, 0);
                this.uvNum = lineData.reduce((result, curr) => {
                    result += curr.uv?curr.uv:0;
                    return result;
                }, 0);
                this.ipNum = lineData.reduce((result, curr) => {
                    result += curr.ip?curr.ip:0;
                    return result;
                }, 0);
                this.launchNum = lineData.reduce((result, curr) => {
                    result += curr.launch?curr.ip:0;
                    return result;
                }, 0);
                this.activeUserNum = lineData.reduce((result, curr) => {
                    result += curr.active_user?curr.ip:0;
                    return result;
                }, 0);
                this.newUserNum = lineData.reduce((result, curr) => {
                    result += curr.new_user?curr.ip:0;
                    return result;
                }, 0);
                
                let date=lineData.map(item=>item.date);
                let down=lineData.map(item=>item.count);
                let pv=lineData.map(item=>item.pv);
                let uv=lineData.map(item=>item.uv);
                let ip=lineData.map(item=>item.ip);
                let launch=lineData.map(item=>item.launch);
                let active_user=lineData.map(item=>item.active_user);
                let new_user=lineData.map(item=>item.new_user);
                return {
                    xAxis: {
                        data: date
                    },
                    series: {
                        down,
                        pv,
                        uv,
                        ip,
                        launch,
                        active_user,
                        new_user
                    }
                };
            },
            lineSeries1(){
                let lineData=deepCopy(this.lineData1);
                let date=lineData.map(item=>item.date);
                let down=lineData.map(item=>item.count);
                let pv=lineData.map(item=>item.pv);
                let uv=lineData.map(item=>item.uv);
                let ip=lineData.map(item=>item.ip);
                let launch=lineData.map(item=>item.launch);
                let active_user=lineData.map(item=>item.active_user);
                let new_user=lineData.map(item=>item.new_user);
                return {
                    xAxis: {
                        data: date
                    },
                    series: {
                        down,
                        pv,
                        uv,
                        ip,
                        launch,
                        active_user,
                        new_user
                    }
                };
            }
        },
        watch: {
            '$route': {
                async handler(val){
                    this.getAppList();
                    if(this.tableShow==='name1'){
                        this.getTodayYestday();
                        this.getChartInfo(true);
                    }else if(this.tableShow==='name2'){
                        await this.getChannels();
                        this.getChartInfo();
                        this.getMapData();
                        this.getPieData();
                        // this.getDown([]);
                    } else if (this.tableShow==='name3') {
                      this.getDownloadRecord();
                    }
                },
                deep: true
            },
            tableShow: {
                async handler(val){
                    this.getData();
                    if(val==='name1'){
                        this.getTodayYestday();
                        this.getChartInfo(true);
                    }else if(val==='name2'){
                        await this.getChannels();
                        this.getChartInfo();
                        this.getMapData();
                        this.getPieData();
                        // this.getDown([]);
                    }
                },
                immediate: true
            },
            filteType(val) {
                this.getMapData();
            },
            filteTypePie(val) {
              this.getPieData();
            },
            dateMap(val){
                if (val[0] !== '' && val[1] !== '') {
                  if ((val[1].getTime() -val[0].getTime()) / 1000/60/60/24 > 31) {
                    let d = (val[1].getTime() -val[0].getTime()) / 1000/60/60/24 - 31;
                    val[1] = new Date(val[1].getTime() - d * 1000 * 60 * 60 *24);
                    this.dateMap = [val[0], val[1]];
                    Notice.warning({title:'所选时间段大于31天,请选择31天以内'});
                    return;
                  }
                  this.getMapData(val);
                }
            },
            barDate(val){
                if ((val[1].getTime() -val[0].getTime()) / 1000/60/60/24 > 31) {
                  let d = (val[1].getTime() -val[0].getTime()) / 1000/60/60/24 - 31;
                  val[1] = new Date(val[1].getTime() - d * 1000 * 60 * 60 *24);
                  this.barDate = [val[0], val[1]];
                  Notice.warning({title:'所选时间段大于31天,请选择31天以内'});
                  return;
                }
                this.getDown(val);
            },
            pieDate(val) {
                if ((val[1].getTime() -val[0].getTime()) / 1000/60/60/24 > 31) {
                  let d = (val[1].getTime() -val[0].getTime()) / 1000/60/60/24 - 31;
                  val[1] = new Date(val[1].getTime() - d * 1000 * 60 * 60 *24);
                  this.pieDate = [val[0], val[1]];
                  Notice.warning({title:'所选时间段大于31天,请选择31天以内'});
                  return;
                }
                this.getPieData(val);
            },
            date(val){
                if ((val[1].getTime() -val[0].getTime()) / 1000/60/60/24 > 31) {
                  let d = (val[1].getTime() -val[0].getTime()) / 1000/60/60/24 - 31;
                  val[1] = new Date(val[1].getTime() - d * 1000 * 60 * 60 *24);
                  this.date = [val[0], val[1]];
                  Notice.warning({title:'所选时间段大于31天,请选择31天以内'});
                  return;
                }
                this.getChartInfo();
            },
            dateTable(val){
                if ((val[1].getTime() -val[0].getTime()) / 1000/60/60/24 > 31) {
                  let d = (val[1].getTime() -val[0].getTime()) / 1000/60/60/24 - 31;
                  val[1] = new Date(val[1].getTime() - d * 1000 * 60 * 60 *24);
                  this.dateTable = [val[0], val[1]];
                  Notice.warning({title:'所选时间段大于31天,请选择31天以内'});
                  return;
                }
                this.getDownloadRecord();
            },
            filterObj: {
                handler:debounce(function (val) {
                    this.getDownloadRecord();
                },200),
                deep: true
            },
            getChartChannel(val) {
              this.getChartInfo();
            },
            getMapChannel(val) {
              this.getMapData();
            },
            getDownChannel(val) {
              this.getDown();
            }
        },
        methods: {
          // 更新应用
          visibleChange(val) {
            this.updateAppModal = val;
          },
          getData() {
              this.getAppList();
              this.getDownloadRecord();
          },
          tabsClick(active) {
              if (this.tableShow !== active) {
                  this.tableData = [];
              }
              this.tableShow = active;
          },
          selectDate(e) {},
          // 获得下载选择时间
          getDownTime(e) {
              this.DownloadRecord = this.DownloadRecords;
              let start = Number(e[0].split("-").join(""));
              let end = Number(e[1].split("-").join(""));
              this.DownloadRecord = this.DownloadRecord.filter(item => {
                  return (
                      Number(
                          item.itime
                              .slice(0, 11)
                              .split("-")
                              .join("")
                      ) >= start &&
                      Number(
                          item.itime
                              .slice(0, 11)
                              .split("-")
                              .join("")
                      ) <= end
                  );
              });
          },

          // 获得当前APP产品数据
          async getAppList() {
              let _id = this.$route.query.id;
              let options = {
                  url: this.appListUrl,
                  data: {
                      _id
                  }
              };
              let res = await api_global.getMessage(options);
              this.detail=res;
          },
          async getDownloadRecord() {
              let val=this.dateTable;
              let end,start;
              if(val[0]&&val[1]){
                  start=val[0]&&moment(val[0]).format('YYYY-MM-DD');
                  end =val[1]&&moment(val[1]).format('YYYY-MM-DD');
              }else {
                  start=moment(new Date()).subtract(1,'months').format('YYYY-MM-DD');
                  end =moment(new Date()).format('YYYY-MM-DD');
              }
              let page=this.filterObj.page;
              let row=this.filterObj.row;
              let options = {
                  url: '/download.json',
                  data: {
                      page,
                      row,
                      sort_field: 'itime',
                      sort_dir: 'desc',
                      app_id: this.$route.query.id
                  }
              };
              if(start&&end){
                  options.data.date=`${start} - ${end}`;
              }
              let res = await api_global.getMessage(options);
              this.totalCount = res.count;
              this.DownloadRecords = res.aaData;
              this.DownloadRecord = res.aaData;
          },
          // 获得进入 获得最近30天图表数据
          async getChartInfo(flag) {
              //获取7天的图标
              if(flag){
                  let end =moment(new Date()).format('YYYY-MM-DD');
                  let start=moment(new Date()).format('YYYY-MM-DD');
                  let options = {
                      url: this.appChartInfoUrl,
                      data: {
                          aid: this.$route.query.id,
                          date: `${start} - ${end}`
                      }
                  };
                  this.lineData1=await api_global.getMessage(options);
                  return false;
              }
              
              let val=this.date;
              let end,start;
              if(val[0]&&val[1]){
                  start=moment(val[0]).format('YYYY-MM-DD');
                  end =moment(val[1]).format('YYYY-MM-DD');
              }else {
                  end =moment(new Date()).format('YYYY-MM-DD');
                  start=moment(new Date()).subtract(1,'week').format('YYYY-MM-DD');
              }
              let options = {
                  url: this.appChartInfoUrl,
                  data: {
                      aid: this.$route.query.id,
                      date: `${start} - ${end}`
                  }
              };
              if (this.getChartChannel !== '') {
                options.data.channel_id = this.getChartChannel;
              }
              this.lineData=await api_global.getMessage(options);
          },
          //获取饼图数据
          async getPieData() {
            let channelArr = this.channelsList.map(item => item.name);
            var val = this.pieDate;
            let end,start;
            if(val[0]&&val[1]){
                start=moment(val[0]).format('YYYY-MM-DD');
                end =moment(val[1]).format('YYYY-MM-DD');
            }else {
                end =moment(new Date()).format('YYYY-MM-DD');
                start=moment(new Date()).subtract(1,'week').format('YYYY-MM-DD');
            }
            let options={
                url:'/reportnew/pie.json',
                data: {
                    aid: this.$route.query.id,
                    field: this.filteTypePie,
                    date: `${start} - ${end}`
                }
            };
            let {list}=await api_global.getMessage(options);
            let data = [];
            this.table2.data = [];
            list.map(item=>{
              if (channelArr.indexOf(item.channel) !== -1 || !channelArr.length) {
                  data.push({name:item.channel === '' ? '未知' : item.channel,value:item[options.data.field]})
                  this.table2.data.push(item);
              }
            });
            let legendData = []; 
            list.map(item=> {
              if (channelArr.indexOf(item.channel) !== -1 || !channelArr.length) {
                legendData.push({
                  name: item.channel === '' ? '未知' : item.channel,
                  icon: 'circle'
                }); 
              }
            });
            let obj = {};
            data.forEach(item => {
              obj[item.name] = item.value
            });
            this.pieCurren = data.reduce((result, curr) => {
                result += curr.value?curr.value:0;
                return result;
            }, 0);
            this.pieCurrentData = obj;
            this.$set(this.pieData.series[0],'data',data);
            this.$set(this.pieData.legend,'data',legendData);
          },
          //获取今日昨日数据
          async getTodayYestday() {
            let end =moment(new Date()).format('YYYY-MM-DD');
            let start=moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD');
            let options = {
                url: '/reportnew/twoDay.json',
                data: {
                    _id: this.$route.query.id
                }
            };
            this.todayYestdayInfo=await api_global.getMessage(options);
          },
          //获取地图数据
          async getMapData(){
              let val=this.dateMap;
              let end,start;
              if(val[0]&&val[1]){
                  start=moment(val[0]).format('YYYY-MM-DD');
                  end =moment(val[1]).format('YYYY-MM-DD');
              }else {
                  end =moment(new Date()).format('YYYY-MM-DD');
                  start=moment(new Date()).subtract(1,'week').format('YYYY-MM-DD');
              }
              let options={
                  url:'/reportnew/map.json',
                  data: {
                      aid: this.$route.query.id,
                      field: this.filteType,
                      date: `${start} - ${end}`,
                      channel_id: this.getMapChannel
                  }
              };
              let {list}=await api_global.getMessage(options);
              let rank=list.length>10?list.slice(0,10):list;
              this.rank=rank;
              let arr=list.map(item=>item[options.data.field]);
              if (!arr.length) {
                arr = [0];
              }
              let max=Math.max.call(null,...arr);
              let data=list.map(item=>{
                  return {
                      name:item.name,
                      value:item[options.data.field]
                  }
              });
              let map = {
                'count': '下载量',
                'pv': 'PV',
                'uv': 'UV',
                'ip': 'IP',
                'launch': '启动次数'
              };
              this.mapData.tooltip.formatter = function (data) {
                  let str = ` <span style="color:#354052;font-weight: bolder;font-size: 12px;">${data.name ? data.name : ''}</span>
                              <br/>
                              <span>${map[options.data.field]}：<span style="color: #2a9ff6;font-size: 12px;">${data.value ? data.value : 0}</span>次</span>
                            `;
                  return str;
              }
              this.$set(this.mapData.series[0],'data',data);
              this.$set(this.mapData.visualMap,'text',[max?max:200,0]);
              this.$set(this.mapData.visualMap,'max',max?max:200);
          },


          //获取下载量
          async getDown(){
              let val=this.barDate;
              let end,start;
              if(val[0]&&val[1]){
                  start=moment(val[0]).format('YYYY-MM-DD');
                  end =moment(val[1]).format('YYYY-MM-DD');
              }else {
                  end =moment(new Date()).format('YYYY-MM-DD');
                  start=moment(new Date()).subtract(1,'week').format('YYYY-MM-DD');
              }
              let options={
                  url:'/reportnew/topIp.json',
                  data: {
                      aid: this.$route.query.id,
                      date: `${start} - ${end}`,
                      channel_id: this.getDownChannel
                  }
              };
              let {list}=await api_global.getMessage(options);
              // let x=list.map(item=>item.cip);
              let data = [];
              let x = [];
              list.map((item,idx)=>{
                if (item.count > 0) {
                  data.push(item.count);
                  x.push(item.cip);
                }
              });
              this.$set(this.barData.xAxis[0],'data',x);
              this.$set(this.barData.series[0],'data',data);
          },
          legendChange(checked) {
            this.legendChecked =  checked;
          },
          //获取渠道列表 
          async getChannels() {
            let data = {
              row: 0,
              app_id: this.$route.query.id
            };
            let options = {
              url: '/channel.json',
              data
            }
            let {aaData}=await api_global.getMessage(options);
            this.channelsList = deepCopy(aaData);
          }
        },
    };
</script>

<style lang="less" scoped>
  .content {
    padding: 15px 15px 0;
    margin: 0 15px;
    font-size: 13px;
    color: #5a5959;
    .mt20 {
      margin-top: 10px;
    }
    .flr {
      float: right;
    }
    .fll {
      float: left;
    }
    .mr10 {
      margin-right: 10px;
    }
    .mrb10 {
      margin-bottom: 10px;
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
        font-size: 20px;
        text-transform: none;
        font-weight: 400;
        padding: 0;
        button {
          margin-left: 10px;
        }
      }
      .head-right {
        float: right;
      }
      .head-left {
        float: left;
      }
      .box {
        background-color: #fff;
        margin: 15px 0;
        margin-top: 0;
        box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
        .content-body {
          padding: 5px 30px 30px;
          background-color: #fff;
          border: 1px solid #e8e8e8;
          border-top: 0;
          transition: 800ms;
        }
        .app-info-content {
          padding: 0 0px;
          height: 308px;
          .app-info-row {
            background: #f5f6f8;
            height: 192px;
            display: flex;
            align-items: center;
            .app-info {
              width: 100px;
              margin-left: 56px;
              .app-image {
                img {
                  vertical-align: middle;
                  width: 100px;
                  height: 100px;
                  border-radius: 10px;
                }
              }
              .app-detail {
                flex: 1;
                .app-name-group {
                  display: flex;
                  flex-direction: row;
                  flex-wrap: wrap;
                  margin-bottom: 20px;
                  font-size: 16px;
                  margin-top: 2px;
                  color: #6F7378;
                  font-weight: 400;
                }
                .app-attrs {
                  &:nth-child(2) {
                    margin-bottom: 10px;
                  }
                  margin-bottom: 5px;
                  button {
                    margin-right: 10px;
                  }
                  span {
                    color: #9e9e9e;
                    font-size: 12px !important;
                  }
                  span:not(:last-child) {
                    margin-right: 15px;
                  }
                  span.label {
                    color: #fff;
                  }
                  span .fa {
                    color: #819199;
                  }
                }
              }
              .pull-left {
                float: left;
                margin-left: 12px;
              }
              .app-view-btn-group {
                float: right;
                margin-right: 36px;
                p {
                  color: #9e9e9e;
                  font-size: 13px;
                  span {
                    color: #45474a;
                    font-size: 18px;
                  }
                }
              }

            }
            .app-view-btn {
              flex: 1;
              margin-left: 10px;
            }
          }
          .app-info-section {
            padding-left: 15px;
            padding-right: 15px;
            height: 116px;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
            .app-info-item {
              padding: 20px 0;
              flex: 1;
              div {
                margin-left: 56px;
                font-size: 14px;
                color: #adb1b6;
                span {
                  font-size: 20px;
                  color: #45474a;
                  a {
                    color: #45474a;
                    &:hover {
                      text-decoration: none;
                    }
                  }
                }
              }
            }
            .first {
              margin-bottom: 5px;
            }
          }
        }
      }
      /deep/ .scard-main-title {
        color: #6f7378;
        font-weight: normal;
        width: 100%;
        height: 32px;
      }
    }
    .s-content-header {
      height: 56px;
      padding: 10px 0;
      margin-bottom: 10px;
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

  .h30{
    background-color: #ebedf2;
    height: 30px;
  }
  .mt20{
    margin-top: 10px;
  }
  .EChartsMap{
    width: 600px;
    height: 600px;
    .scard{
      border: none;
    }
  }
  .flex{
    display: flex;
    background-color: #fff;
    margin-bottom: 30px;
    .top{
      flex: 1;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .ivu-table-wrapper {
        flex: 1;
      }
      .top-box{
        margin-top: 30px;
        width: 400px;
        align-items: center;
      }
      .top-box2 {
        margin-top: 45px;
        width: 750px;
        max-height: 370px;
        align-items: center;
      }
      .area-list-title {
        font-size: 16px;
        line-height: 30px;
        color: #676767;
        font-weight: 400;
        text-transform: uppercase;
        text-align: center;
      }
      .sub{
        display: flex;
        text-align: center;
        border-bottom: 1px solid #f1f2f4;
        &:last-child{
          border-bottom: none;
        }
        div{
          flex: 1;
          color: #5a5959;
          font-size: 13px;
          height: 39px;
          line-height: 39px;
        }
      }
      .bold{
        font-weight: bold;
      }
    }
  }
  /deep/ .s-btn-primary {
	background: linear-gradient(90deg, #348ef1, #49afff);
	color: #ffffff !important;
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
  .scard-title-wrap {
    span {
      font-size: 14px;
    }
  }
  .fl {
    float: left;
  }
  .ml10 {
    margin-left: 10px;
  }
  .flr {
    float: right;
  }
  .br {
    padding-right: 10px;
    border-right: 1px solid #f2f3f5;
  }
   .detail-wrapper {
    display: flex;
    flex-direction: column;
    .head-info {
    }
    .detail {
      flex: 1;
      .today {
        height: 50%;
        border-bottom: 1px solid #eee;
        display: flex;
        .icon {
          background: #2196f3;
        }
      }
      .yestday {
        height: 50%;
        display: flex;
        .icon {
          background: #ffc107;
        }
      }
      .detail-item {
        flex: 1;
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      .icon {
        display: inline-block;
        width: 48px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        border-radius: 50%;
        color:#fff;
        align-self: center;
      }
      h3 {
        font-size: 20px;
        color: #45474a;
        font-weight: 500;
      }
      p {
        font-size: 14px;
        color: #adb1b6;
      }
    }
  }
  /deep/ .tips-table{
      padding: 20px;
      background-color: #fff;
      color: #354052;
  }
  .tab-content {
    flex: 1;
    padding: 20px;
  }
</style>
