<template>
  <sn-layout class="content">
    <sn-row class="container mt20">
      <s-card  style="height: 600px;">
        <div slot="title">
          <div class="fl br" v-if="legendChecked.indexOf('pv') !== -1">PV：{{infoShow.pvNum}}</div>
          <div class="fl ml10 br" v-if="legendChecked.indexOf('uv') !== -1">UV：{{infoShow.uvNum}}</div>
          <div class="fl ml10 br" v-if="legendChecked.indexOf('ip') !== -1">独立IP：{{infoShow.ipNum}}</div>
          <div class="fl ml10 br" v-if="legendChecked.indexOf('down') !== -1">总下载量：{{infoShow.downNum}}</div>
          <div class="fl ml10 br" v-if="legendChecked.indexOf('launch') !== -1">启动次数：{{infoShow.launchNum}}</div>
          <div class="fl ml10 br" v-if="legendChecked.indexOf('active_user') !== -1">活跃用户：{{infoShow.activeUserNum}}</div>
          <div class="fl ml10" v-if="legendChecked.indexOf('new_user') !== -1">新增用户：{{infoShow.newUserNum}}</div>
          <date-picker
                  type="daterange"
                  :options="options1"
                  :confirm="true"
                  placement="bottom-end"
                  placeholder="选择日期"
                  style="width: 274px"
                  class="flr"
                  v-model="date"
          ></date-picker>
          <scroll-select @dataChange="dataChange" @queryChange="queryChange" class="mr10 flr"  v-model="appId" :list="appLists"></scroll-select>
        </div>
        <!-- <p slot="subTitle">(最近7天)</p> -->
        <report-main :lineSeries="lineSeries" @legendChange="legendChange"></report-main>
      </s-card>
      <div class="h30"></div>
      <div class="flex" style="height: 600px;">
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
                    v-model="dateMap"
                    class="flr"
            ></date-picker>
            <scroll-select @dataChange="dataChange" @queryChange="queryChange" class="flr mr10"  v-model="mapAppId" :list="appLists"></scroll-select>
            <scroll-select :image="false" placeholder="请选择" :list="filterList" :showAll="false" v-model="filteType" name="value" label="txt" class="flr mr10"></scroll-select>
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
          <scroll-select @dataChange="dataChange" @queryChange="queryChange" class="mr10 flr"  v-model="downAppId" :list="appLists"></scroll-select>
        </p>
        <EChartsBar :option="barData"></EChartsBar>
      </s-card>
      <div class="h30"></div>
    </sn-row>
  </sn-layout>
</template>

<script>
    import {
        Button,
        Icon,
        Switch,
        SnPage,
        TableExpand,
        Report,
        SCard,
        Search,
        EChartsMap,
        scrollSelect,
        EChartsBar
    } from "_c";
    import { mapState } from "vuex";
    import moment from 'moment'
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
        TabPane,
        Select,
        Option,
        Notice
    } from "iview";
    import { tableMixin } from "@/mixins";
    import Emitter from '@/mixins/emitter';
    import { deepCopy } from "@/utils/assist";
    import { formatTime } from "@/mixins/globalMixin";
    import { api_global } from "@/api";
    import { constants } from "crypto";
    const components = {
        "sn-table": Table,
        "sn-icon": Icon,
        "sn-button": Button,
        "sn-layout": Layout,
        "sn-content": Content,
        "sn-header": Header,
        'scroll-select':scrollSelect,
        "sn-modal": Modal,
        "i-switch": Switch,
        "sn-page": SnPage,
        "sn-search": Search,
        "sn-row": Row,
        "sn-col": Col,
        "sn-card": Card,
        "sn-tabs": Tabs,
        "sn-tabPane": TabPane,
        "date-picker": DatePicker,
        "report-main": Report,
        "report-mains": Report,
        "s-card": SCard,
        EChartsMap,
        EChartsBar,
        Avatar,
        TableExpand
    };

    const selectObj={
        page:1,
        row:0,
        fuzzy:'name',
        name:'',
    };
    const filterList = [
      {txt: 'PV', value: 'pv'},
      {txt: 'UV', value: 'uv'},
      {txt: '下载量', value: 'count'},
      {txt: 'IP', value: 'ip'}
    ];
    export default {
        name: "Index",
        mixins: [Emitter],
        inject: {
            app: {
                default: ''
            }
        },
        components,
        data() {
            let self=this;
            return {
                filterList,
                date: [moment(new Date()).subtract(1, 'months').toDate(),moment().toDate()],
                dateMap:[moment(new Date()).subtract(1, 'months').toDate(),moment().toDate()],
                chartDate: [moment(new Date()).subtract(1, 'months').toDate(),moment().toDate()],
                barDate:[moment(new Date()).subtract(1, 'months').toDate(),moment().toDate()],
                filteType: 'count',
                legendChecked: ['pv', 'uv'],
                infoShow: {
                  downNum:0,
                  pvNum: 0,
                  uvNum: 0,
                  ipNum: 0,
                  launchNum: 0,
                  activeUserNum: 0,
                  newUserNum: 0
                },
                detail: {},
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
                        return date.getTime() > startTime;
                    }
                },
                lineData:[],
                mapData: {
                    tooltip: {
                        formatter: function (data) {
                            let str = ` <span style="color:#354052;font-weight: bolder;font-size: 12px;">${data.name ? data.name : ''}</span>
                        <br/>
                        <span>下载量：<span style="color: #2a9ff6;font-size: 12px;">${data.value ? data.value : 0}</span>次</span>
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
                appId:'',
                mapAppId:'',
                downAppId:'',
                appLists:[],
                selectObj:deepCopy(selectObj),
                stop:false,
            };
        },
        computed: {
            lineSeries() {
                let lineData=deepCopy(this.lineData);
                this.totoalComputed(lineData);
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
        },
        async created() {
          if (this.$route.query.today) {
            this.date = [moment().toDate(), moment().toDate()];
            this.dateMap = [moment().toDate(), moment().toDate()];
            this.chartDate = [moment().toDate(), moment().toDate()];
            this.barDate = [moment().toDate(), moment().toDate()];
          } else {
            this.getChartInfo();
            this.getAppList();
            this.getMapData();
            // this.getDown();
          }
        },
        watch: {
            dateMap(val){
                if ((val[1].getTime() -val[0].getTime()) / 1000/60/60/24 > 31) {
                  let d = (val[1].getTime() -val[0].getTime()) / 1000/60/60/24 - 31;
                  val[1] = new Date(val[1].getTime() - d * 1000 * 60 * 60 *24);
                  this.dateMap = [val[0], val[1]];
                  Notice.warning({title:'所选时间段大于31天,请选择31天以内'});
                  return;
                }
                this.getMapData(val);
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
            filteType(val) {
                this.getMapData();
            },
            appId(val){
                this.getChartInfo();
            },
            mapAppId(){
                this.getMapData();
            },
            downAppId(){
                this.getDown();
            },
        },
        methods: {
            // 获得当前APP产品数据
            async getAppList(type) {
                let selectObj=deepCopy(this.selectObj);
                Object.keys(selectObj).forEach(item=>{
                    if(!selectObj[item]){
                        delete selectObj[item];
                    }
                });
                let options = {
                    url: '/apps.json',
                    data:{...selectObj,sort_field: 'itime',sort_dir: 'desc',}
                };
                let rs = await api_global.getMessage(options);

                if(rs.count<selectObj.row){
                    this.stop=true;
                }
                if(selectObj.page===1){
                    this.appLists = rs.aaData;
                }else{
                    this.appLists = [...this.appLists, ...rs.aaData];
                }
                this.$set(this.selectObj, 'page', rs.page);
            },
            //计算下载数
            totoalComputed(val){
                this.infoShow.downNum = val.reduce((result, curr) => {
                    result += curr.count;
                    return result;
                }, 0);
                this.infoShow.pvNum = val.reduce((result, curr) => {
                    result += curr.pv;
                    return result;
                }, 0);
                this.infoShow.uvNum = val.reduce((result, curr) => {
                    result += curr.uv;
                    return result;
                }, 0);
                this.infoShow.ipNum = val.reduce((result, curr) => {
                    result += curr.ip;
                    return result;
                }, 0);
                this.infoShow.launchNum = val.reduce((result, curr) => {
                    result += curr.launch*1;
                    return result;
                }, 0);
                this.infoShow.activeUserNum = val.reduce((result, curr) => {
                    result += curr.active_user*1;
                    return result;
                }, 0);
                this.infoShow.newUserNum = val.reduce((result, curr) => {
                    result += curr.new_user*1;
                    return result;
                }, 0);
            },
            // 获得进入 获得最近30天图表数据
            async getChartInfo() {
                let val=this.date;
                let app_id=this.appId;
                //获取7天的图标
                let end,start;
                if(val[0]&&val[1]){
                    start=moment(val[0]).format('YYYY-MM-DD');
                    end =moment(val[1]).format('YYYY-MM-DD');
                }else {
                    end =moment(new Date()).format('YYYY-MM-DD');
                    start=moment(new Date()).subtract(1,'week').format('YYYY-MM-DD');
                }
                let options = {
                    url: '/reportnew/getchart.json',
                    data: {
                        date: `${start} - ${end}`,
                        level:2
                    }
                };
                if(app_id){
                    options.data.aid=app_id;
                    delete options.data.level;
                }else{
                    options.data.level=2;
                    delete options.data.app_id;
                }
                this.lineData=await api_global.getMessage(options);
            },
            //获取地图数据
            async getMapData(){
                let val=this.dateMap;
                let app_id=this.mapAppId;
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
                        field: this.filteType,
                        date: `${start} - ${end}`
                    }
                };
                if(app_id){
                    options.data.aid=app_id;
                    delete options.data.level;
                }else{
                    options.data.level=2;
                    delete options.data.aid;
                }

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
                let app_id=this.downAppId;
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
                        date: `${start} - ${end}`
                    }
                };
                if(app_id){
                    options.data.aid=app_id;
                    delete options.data.level;
                }else{
                    options.data.level=2;
                    delete options.data.aid;
                }
                let {list}=await api_global.getMessage(options);
                let x=list.map(item=>item.cip);
                let data=list.map(item=>item.count);
                this.$set(this.barData.xAxis[0],'data',x);
                this.$set(this.barData.series[0],'data',data);
            },


            //下来加载
            dataChange(){
/*                if(this.stop){
                    return false;
                }
                this.$set(this.selectObj,'page',+this.selectObj.page+1);
                this.getAppList();*/
            },
            queryChange(keywords){
/*                this.stop=false;
                this.$set(this.selectObj,'page',1);
                this.$set(this.selectObj,'name',keywords);
                this.getAppList();*/
            },
            legendChange(checked) {
              this.legendChecked =  checked;
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
        font-size: 16px;
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
        height: 30px;
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

  .h30{
    background-color: #ebedf2;
    height: 30px;
  }
  .mt20{
    margin-top: 20px;
  }
  .EChartsMap{
    width: 600px;
    height: 550px;
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
      .top-box{
        margin-top: 30px;
        width: 400px;
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
}
/deep/ .ivu-table {
  th {
    background-color: #F4F5F7 !important;
    height: 60px !important;
  }
}


  .w110{
    width: 110px;
  }
  .mr10{
    margin-right: 10px;
  }
  .fl {
    float: left;
  }
  .ml10 {
    margin-left: 10px;
  }
  .br {
    padding-right: 10px;
    border-right: 1px solid #f2f3f5;
  }
</style>
