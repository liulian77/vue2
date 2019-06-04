<template>
  <Layout :class="[isMobile?'s-home-xs':'s-home-web']">
    <Header class="s-content-header">
      <div class="header-left">
        <template v-if="!isMobile">
          <DatePicker type="daterange"
            :options="options1"
            :confirm="true"
            placement="top-start"
            placeholder="选择日期"
            style="width: 274px"
            class="mr10"
            @on-ok="selectDate"
            v-model="date"
          >
          </DatePicker>
          <LevelCheckbox
                  :width="167"
                  placeholder="自定义列"
                  v-model="listSelected"
                  :defaultProps="{children: 'children',label: 'title'}"
                  class="mr10"
                  defaultValue="title"
                  :labelsShow="false"
          >
            <LevelCheckboxItem
                    :items="columns"
                    :button="true"
                    :defaultProps="{children: 'children',label: 'title'}"
                    v-model="listSelectedItem"
            ></LevelCheckboxItem>
          </LevelCheckbox>
          <LevelSearch :width="300"
                       :placeholder="'请选择'"
                       v-model="filterObj.search"
                       :searchItems="searchItems"
                       @search="search"
                       @downLoad="downLoad('searchItems')"
                       defaultValue="label"
                       class="mr10"
          >
            <LevelSearchItem
                    title="媒体商"
                    :items="agentData"
                    :button="true"
                    v-model="agent"
                    :defaultProps="{label:'username'}"
                    @downLoad="downLoad('agentData')"
                    :scrollLoad="true"
                    defaultValue="_id"
            ></LevelSearchItem>
            <LevelSearchItem
                    ref="resourceData"
                    :items="resourceData"
                    title="媒体"
                    v-model="resource"
                    :styles="{'transform':'translate(100%,100%)','margin-left':'10px'}"
                    :defaultProps="{label:'title'}"
                    @downLoad="downLoad('resourceData')"
                    :scrollLoad="true"
                    defaultValue="_id"
            ></LevelSearchItem>
            <LevelSearchItem
                    title="广告位"
                    ref="AdZoneData"
                    :items="AdZoneData"
                    v-model="AdZone"
                    :styles="{'transform':'translate(200%,100%)','margin-left':'20px'}"
                    :triangle="false"
                    :defaultProps="{label:'title'}"
                    @downLoad="downLoad('AdZoneData')"
                    :scrollLoad="true"
            ></LevelSearchItem>
          </LevelSearch>

          <Select :width="130" class="mr10"
                    :placeholder="typeObj.label"
                    v-model="filterObj.resource"
                    @change="typeChange"
            >
              <Option v-for="item in mediaTypes"
                      :label="item.label"
                      :value="item.value"
              >
              </Option>
            </Select>
          <Select :width="130" class="mr10"
                    placeholder="购买方式"
                    v-model="filterObj.resource"
                    @change="typeChange"
            >
              <Option label="全部" :value="1" />
              <Option label="竞价" :value="2" />
              <Option label="排期" :value="3" />
            </Select>
          <Select :width="130" class="mr10"
                    placeholder=""
                    v-model="filterObj.resource"
                    @change="typeChange"
            >
              <Option label="按天" :value="1" />
              <Option label="按小时" :value="2" />
            </Select>
        </template>
        <template v-if="isMobile">
          <DatePicker type="daterange"
                      v-model="date"
                      @on-ok="selectDate"
            :options="options1"
            :confirm="true"
            placement="top-start"
            placeholder="选择日期"
            class="mr10 DatePicker">
          </DatePicker>
<!--          <Select :width="105"
            placeholder="自定义列"
            v-model="statusType"
            class="mr10">
            <Option v-for="item in statusList"
              :label="item.label"
              :value="item.value">
            </Option>
          </Select>-->

          <SearchXs width="100%"
                    class="SearchXs"
                    :height="32"
                    :searchItems="searchItems"
                    @search="change"
                    defaultValue="label"
                    v-model="filterObj.search"
          ></SearchXs>

        </template>

      </div>
      <div class="header-right"
        @click="down"
        v-if="!isMobile">
        <Icon type="download"
          color="#c5ccd4"
          size="18" />
      </div>
    </Header>
    <div class="s-report-echarts s-home-left-card4">
      <SCard>
        <p slot="title">数据趋势图</p>
        <ReportMain :items="lineData" :lineSeries="lineSeries" ></ReportMain>
      </SCard>
    </div>
    <Content>
      <Table v-if="!isMobile"
             :columns="columnsData"
             :data="tableData"
             :loading="loading"
             @on-sort-change="handleSortChange">

        <template slot-scope="{row}" slot="date">
          {{row.date | formatTime('YYYY-MM-DD','YYYYMMDD')}}
        </template>

      </Table>

      <Table v-if="isMobile"
             class="table-xs"
             :columns="columnsMobile"
             :data="tableData"
             :loading="loading"
             @on-sort-change="handleSortChange">

        <template slot-scope="{row}"
                  slot="enable">
          <Switch class="s-table-switch"
                  :beforeChange="beforeSwitchChange"
                  @on-change="handleSwitch(row,'enable')"
                  :true-value="1"
                  :false-value="0"
                  v-model="row.enable"></Switch>
        </template>

        <template slot-scope="{row}"
                  slot="distributor_ratio">
          {{row.distributor_ratio}}%
        </template>

        <template slot-scope="{row}"
                  slot="type">
          {{mediaType[row.type]}}
        </template>

      </Table>

      <SnPage :total="totalCount"
              :current="filterObj.page"
              :page-size="filterObj.row"
              show-sizer
              show-elevator
              show-total
              placement="bottom"
              @on-change="handleChangePage"
              @on-page-size-change="handleChangeSizePage">
      </SnPage>
    </Content>
  </Layout>
</template>
<script>
import {Button,Icon,Select,Option,Input,SearchXs,LevelSearch,LevelSearchItem,DatePicker,SCard,Report,SnPage,TableExpand,LevelCheckbox,LevelCheckboxItem} from "_c"
import { mapState } from 'vuex'
import { Layout, Content, Header, Table } from 'iview'
import { api_common,api_report } from '@/api'
import { tableMixin } from '@/mixins'
import { formatTime,toRegularNum } from '@/mixins/globalMixin'
import { deepCopy } from '@/utils/assist'
import moment from 'moment'
import { throttle } from 'lodash'
import { baseUrl } from '@/common/config'

const components= {
    SearchXs,
    Input,
    ReportMain:Report,
    SCard,
    LevelSearch,
    LevelSearchItem,
    LevelCheckbox,
    LevelCheckboxItem,
    DatePicker,
    Table,
    Icon,
    Button,
    Layout,
    Content,
    Header,
    Select,
    Option,
    SnPage,
};

let tableReq = {
    funcName: 'report_list',
    funcResName: 'data()',
    tableName: 'V2ReportSsp',
    column: ['date','type','aid','price','total.pv','total.show','total.uv','total.ip','fillper','cpm'],
    tableInfo: {
        "resource":"site",		//必传参,site  app  soft
        "search":"",			//搜索框参数
        "date%d":"20180821,20180827",	//时间
        "@order": "date-",
    },
}

const columns = [
    {
        title: '投放名称',
        slot: 'date',
        sortable:'custom',
        sortKey:'date',
    }, {
        title: '状态',
        key: 'agent_username',
    }, {
        title: '所属投放',
        key: 'resource',
    }, {
        title: '展示量',
        key: 'adzone',
    }, {
        title: '点击量',
        render: (h, params) =>h('span',{domProps: {innerHTML: `￥${toRegularNum(params.row.price,0)}`}}),
        align:'right',
        sortable:'custom',
        sortKey:'price',
    }, {
        title: '点击率',
        render: (h, params) =>h('span',{domProps: {innerHTML: toRegularNum(params.row.total.pv,0)}}),
        align:'right',
        sortable:'custom',
        sortKey:'total.pv',
    }, {
        title: '花费',
        render: (h, params) =>h('span',{domProps: {innerHTML: toRegularNum(params.row.total.show,0)}}),
        align:'right',
        sortable:'custom',
        sortKey:'total.show',
    }, {
        title: '转化指标',
        render: (h, params) =>h('span',{domProps: {innerHTML: `${params.row.fillper}%`}}),
        align:'right',
        sortable:'custom',
        sortKey:'fillper',
    }, {
        title: '转化成本',
        render: (h, params) =>h('span',{domProps: {innerHTML: toRegularNum(params.row.total.clks,0)}}),
        align:'right',
        sortable:'custom',
        sortKey:'total.clks',
    }];

const columnsMobile = [
    {
        type: 'expand',
        width: 50,
        render: (h, params) => h(TableExpand, {
            props: {
                row: params.row,
                fields: [{
                    key: 'price',
                    label: '预估收入',
                    render:()=>`￥${toRegularNum(params.row.price)}`
                }, {
                    label: '请求量',
                    render:()=>toRegularNum(params.row.total.pv,0)
                }, {
                    label: '展现量',
                    render:()=>toRegularNum(params.row.total.show,0)
                }, {
                    label: '填充率',
                    render:()=>`${params.row.fillper}%`
                }, {
                    label: '每千次展现收入',
                    render:()=>`￥${toRegularNum(params.row.cpm,2)}`
                }, {
                    label: '独立访客',
                    render:()=>`${toRegularNum(params.row.total.uv,0)}`
                }, {
                    label: '独立IP',
                    render:()=>`${toRegularNum(params.row.total.ip,0)}`
                }]
            }
        })
    }, {
        title: '日期',
        key: 'date'
    }, {
        title: '媒体商',
        key: 'agent_username'
    }, {
        title: '媒体名称',
        key: 'resource',
    }, {
        title: '广告位',
        key: 'adzone',
    }]

const lineData={
    "pv_sum": 0,
    "show_sum": 0,
    "clks_sum": 0,
    "uv_sum": 0,
    "ip_sum": 0,
    "price_sum": 0,
    "fillper_sum": 0,
    "cpm_sum": 0,
    "clks_per": 0
}

let filterObj = {
    // "resource":"soft",
    // "search":"qudao9910/qudao9910",
    // "date%d":"20180821,20180827",
    // "@order":"date+",
    row: 10,
    page: 1
};

let typeObj={
    label: '软件',
    value: 'soft',
    name:'ResourceSoft'
};

const selectFilter={
    'agentData':{
        page:1,
        count:10,
        total:0,
        pageTotal:0
    },
    'resourceData':{
        page:1,
        count:10,
        total:0,
        pageTotal:0
    },
    'AdZoneData':{
        page:1,
        count:10,
        total:0,
        pageTotal:0
    },
    'searchItems':{
        page:1,
        count:10,
        total:0,
        pageTotal:0
    },
};

export default {
  name:'report',
  mixins: [tableMixin],
  data() {
    return {
      tableReq,
      filterObj,
      typeObj,
      columns,
      columnsMobile,
      tableData: [],
      lineData,
      lineSeries:{},
      date:'',
      listSelected:[],
      listSelectedItem:'',
      selectFilter,
      options1: {
        shortcuts: [
          {
            text: "今天",
            value() {
              const start = new Date();
              const end = new Date();
              return [start, end];
            },
            onClick: (picker) => {
                this.isMobile && (picker.handlePickSuccess());
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
            onClick: (picker) => {
              this.isMobile && (picker.handlePickSuccess());
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
            onClick: (picker) => {
              this.isMobile && (picker.handlePickSuccess());
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
            onClick: (picker) => {
                this.isMobile && (picker.handlePickSuccess());
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
            onClick: (picker) => {
              this.isMobile && (picker.handlePickSuccess());
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
            onClick: (picker) => {
              this.isMobile && (picker.handlePickSuccess());
            }
          }
        ]
      },
      agentData: [],
      AdZoneData: [],
      resourceData: [],
      agent:'',
      resource:'',
      AdZone:'',
      searchItems:[],
    }
  },
  computed: {
    ...mapState('basic', [
      'isMobile','mediaTypes','userinfo'
    ]),
    columnsData(){
        let val=this.listSelected;
        let arr=[];
        columns.forEach(item=>{
            val.includes(item.title)&&arr.push(item)
        });
        return arr;
    }
  },
  components,
  methods: {
    async down() {
      let tableReq=deepCopy(this.tableReq);
      tableReq.funcParams=['xls'];
      let query = this.getQuery();
      tableReq.tableInfo = {
          ...this.tableInfoOrigin,
          ...query
      };
      let url=baseUrl+'/apijson/get?json='+JSON.stringify(api_common.getTableApijson(tableReq).json);
      window.open(url);
    },
    search(val){
        this.getSearchData(val);
        this.$set(this.selectFilter.searchItems,'page',1);
    },
    change(val){
        this.$set(this.selectFilter.searchItems,'page',1);
        this.getSearchData(val);
    },
    getQuery() {
            let data=this.filterObj["date%d"];
           let order=this.tableReq.tableInfo['@order'];
           let search=this.filterObj.search;
           let resource=this.filterObj.resource;
           return { "date%d":data, "@order":order,search,resource}
      },
    async getLineTableData(){
        let type=this.filterObj.resource;
        let date=this.filterObj["date%d"];
        let {data}=await api_common.getLineTableData({type,date});
        this.lineData=toString.call(data)==='[object Array]'?lineData:data
    },
    async getLineData(){
        let options=deepCopy(this.gatherOptions());
        options.funcParams=["echarts"];
        options.pageInfo.count=7;
        let {data} = await api_common.getList(options);
        this.lineSeries=toString.call(data)==='[object Array]'?{}:data;
    },
    async getAgentData(){
        if(!this.userinfo.distributor){
            return false;
        }
        let page=this.selectFilter.agentData.page;
        let count=this.selectFilter.agentData.count;
        let res=await api_report.getAgentData({page,count});
        this.dataListLoading(res,'agentData',page,count);
    },
    async getResourceData(){
        let page=this.selectFilter.resourceData.page;
        let count=this.selectFilter.resourceData.count;
        let type=this.filterObj.resource;
        let id=this.agent;

        let res=await api_common.addList("resource_list()",["resource_list",type,id,page,count]);
        let data={
            'data[]':res.resource_list.data,
            'data[total]':res.resource_list.total,
        };
        this.dataListLoading(data,'resourceData',page,count);
    },
    async getAdZoneData(){
        let page=this.selectFilter.AdZoneData.page;
        let count=this.selectFilter.AdZoneData.count;
        let type=this.filterObj.resource;
        let id=this.resource;
        let res=await api_report.getAdZoneData({page,count,type,id});
        this.dataListLoading(res,'AdZoneData',page,count);
    },
    async getSearchData(val){
        if(val.length==0){
            return false;
        }
        let page=this.selectFilter.searchItems.page;
        let count=this.selectFilter.searchItems.count;
        let type=this.filterObj.resource;
        let res=await  api_common.addList("data()",["resource_search",val,type]);
        let arr=[];
        res.data.data.forEach(item=>{
            arr.push({label:item})
        });
        let data={
            'data[]':arr,
            'data[total]':res.data.total,
        };
        this.dataListLoading(data,'searchItems',page,count);
    },
    typeChange(val){
        this.mediaTypes.forEach(item=>{
            if(item.value==val){
                this.typeObj=item;
            }
        })
    },
    selectDate(){
       let date=this.date.map(item=>{
            if(item){
                return moment(item).format('YYYYMMDD')
            }
        });
        this.$set(this.filterObj,'date%d',date.join(','));
        this.getLineTableData();
        this.getLineData();
    },
    resetSelectItem:throttle((domArr)=>{
        domArr.forEach(item=>{
            item.reset();
        })
    },200),
    downLoad(type){
        let data=this.selectFilter[type];
        if(data.pageTotal<=data.page){
            return false;
        }
        this.$set(data,'page',data.page+1)
    },
    dataListLoading(res,type,page,count){


        let data,total;
        try {
            data= res['data[]']?res['data[]']:res.data['data[]'];
            total=res['data[total]']?res['data[total]']:res.data['data[total]'];
        }catch (e) {
            console.log(e);
            data=[];
            total=0;
        }
        if(page==1){
            this[type]=data;
        }else{
            this[type] = [...this[type], ...data];
        }
        this.selectFilter[type].total=total;
        this.selectFilter[type].pageTotal=Math.ceil(total/count);
    },
  },
  created(){
      this.getLineTableData();
      this.getLineData();
      this.getAgentData();
      this.getAdZoneData();
      this.getResourceData();
      columns.forEach((item,i)=>{
          this.listSelected.push(item.title)
      })
  },
  watch:{
      'selectFilter.agentData.page'(){
          this.getAgentData();
      },
      'selectFilter.AdZoneData.page'(){
          this.getAdZoneData();
      },
      'selectFilter.resourceData.page'(){
          this.getResourceData();
      },
      'selectFilter.searchItems.page'(){
          this.getSearchData();
      },
      agent(){
          this.$set(this.selectFilter.resourceData,'page',1);
          this.getResourceData();
          this.resetSelectItem([this.$refs.resourceData,this.$refs.AdZoneData]);
      },
      resource(){
          this.$set(this.selectFilter.AdZoneData,'page',1);
          this.getAdZoneData();
          this.resetSelectItem([this.$refs.AdZoneData]);
      },
  }
}
</script>
<style lang="less" scoped>
  /deep/ .none{
     display: none!important;
  }
.s-content-header {
  height: 96px;
  padding: 30px;
  line-height: 36px;
  background: #ebedf2;
  display: flex;
  .header-left {
    flex: 1;
    display: flex;
  }
  .header-right {
    width: 36px;
    height: 36px;
    line-height: 36px;
    box-sizing: border-box;
    border: 1px solid #dfe2e6;
    text-align: center;
    background-color: #fff;
    cursor: pointer;
  }
}
.ivu-layout-content {
  background: @white-color;
}
.open-icon {
  position: relative;
  top: -1px;
}

.mr10 {
  margin-right: 10px;
}

.s-home-web {
  .s-report-echarts {
    height: 500px;
    margin-bottom: 30px;
    /deep/ .s-report-main-legend {
      -webkit-box-flex: 0;
      -ms-flex: 0 1 60px;
      flex: 0 1 60px;
    }
  }
  .s-report-table {
    flex: 1;
  }
  .h30 {
    height: 30px;
  }
}
@v: 100vw/750;
.s-home-xs {
  display: block;
  background-color: transparent;
  .header-left {
    flex-wrap: wrap;
  }
  .DatePicker {
    width: 475 * @v;
    height: 36px;
    margin-right: 20 * @v;
  }
  /deep/ .el-select,
  /deep/ .el-select-menu {
    width: 200 * @v!important;
    margin-right: 0;
  }
  .s-content-header {
    padding: 30 * @v 20 * @v;
  }
  .mt20 {
    margin-top: 24 * @v;
  }
  .s-report-echarts {
    padding-top: 20 * @v;
  }
  .s-report-table {
    padding-top: 30 * @v;
  }
  .SearchXs {
    margin-top: 20 * @v;
  }
  /deep/ .ivu-date-picker .ivu-select-dropdown {
    width: 475 * @v;
    overflow: hidden;
  }
}

.ivu-date-picker /deep/ .ivu-input-icon,
.ivu-date-picker /deep/ .ivu-input {
  height: 36px;
  line-height: 36px;
}
</style>

