<template>
  <Layout :class="[isMobile?'s-home-xs':'s-home-web']">
      <Header class="s-content-header">
        <div class="header-left"
          v-if="!isMobile">
          <Button @click.native="editForm = true"
            type="primary"
            class="open-btn"
            v-if="!isMobile"
            size="stretch-h36">
            <Icon type="open"
              color="#fff"
              size="12"
              class="open-icon"
              @click.native="del(item,i)" />
            新建广告位</Button>
        </div>
        <div class="header-right">
          <template v-if="!isMobile">
            <div>
              <Select :width="110"
                placeholder="全部状态"
                v-model="filterObj.status">
                <Option v-for="item in statusList"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                >
                </Option>
              </Select>
            </div>
            <div class="mr10">
              <Select
                      :width="130"
                      :search="true"
                      placeholder="全部广告位"
                      :scrollLoad="true"
                      @downLoad="downLoad"
                      @search="search"
                      v-model="filterObj.title$"
              >
                <Option :value="''"  :key="''">全部广告位</Option>
                <Option :value="item.title" v-for="item in titleList" :key="item._id">{{item.title}}</Option>
              </Select>
            </div>
          </template>
          <template v-else>
            <div class="mr10">
              <Select
                      :width="130"
                      :search="true"
                      placeholder="全部广告位"
                      :scrollLoad="true"
                      @downLoad="downLoad"
                      @search="search"
                      v-model="filterObj.title$"
              >
                <Option :value="''"  :key="''">全部广告位</Option>
                <Option :value="item.title" v-for="item in titleList" :key="item._id">{{item.title}}</Option>
              </Select>
            </div>
            <div>
              <Select :width="110"
                      placeholder="全部状态"
                      v-model="filterObj.status">
                <Option v-for="item in statusList"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value"
                >
                </Option>
              </Select>
            </div>
          </template>
        </div>
      </Header>
      <Content>
        <Table v-if="!isMobile"
               height="645"
               :columns="columns"
               :data="tableData"
               :loading="loading"
               @on-sort-change="handleSortChange"
               ref='tableData'
        >

          <template slot-scope="{row}"
                    slot="setting.platform">
            {{row.setting.platform}}
          </template>
          <template slot-scope="{row}"
                    slot="type">
            {{ADType[row.type]}}
          </template>
          <template slot-scope="{row}"
                    slot="setting.type">
            {{settingType[row.setting.type]}}
          </template>
          <template slot-scope="{row}"
                    slot="setting.size">
            {{row.setting.size}}
          </template>
          <template slot-scope="{row}"
                    slot="status">
            <sn-switch class="s-table-switch"
                    :beforeChange="beforeSwitchChange"
                    @on-change="handleSwitch(row)"
                    :true-value="1"
                    :false-value="0"
                    v-model="row.status"
            ></sn-switch>
          </template>
          <template slot-scope="{row}"
                    slot="action">
            <div class="s-table-btn-group">
              <Button type="primary"
                      size="stretch"
                      ghost
                      @click.native="update(row)">修改</Button>
              <Button type="error"
                      size="stretch"
                      ghost
                      @click.native="del(row)">删除</Button>
              <Button type="success"
                      size="stretch"
                      ghost
                      @click.native="del">广告接口</Button>
            </div>
          </template>

        </Table>



        <Table v-if="isMobile"
               class="table-xs"
               :columns="columnsMobile"
               :data="tableData"
               :loading="loading"
               @on-sort-change="handleSortChange">
          <template slot-scope="{row}"
                    slot="agent_id">
            {{row.agent.username}}
          </template>

          <template slot-scope="{row,index}"
                    slot="status">
            <sn-switch class="s-table-switch"
                   :beforeChange="beforeSwitchChange"
                   @on-change="handleSwitch(row)"
                    :true-value="1"
                    :false-value="0"
                    v-model="row.status"
            ></sn-switch>
          </template>

        </Table>
        <SnPage :total="totalCount"
                :current="tableReq.pageInfo.page"
                :page-size="tableReq.pageInfo.count"
                show-sizer
                show-elevator
                show-total
                placement="bottom"
                @on-change="handleChangePage"
                @on-page-size-change="handleChangeSizePage">
        </SnPage>
      </Content>
      <Modal
        v-model="editForm"
        :footer-hide="true"
        fullscreen
        :mask="false"
        :transition-names="['slide-down','slide-down']"
       :title="id?'修改广告位':'新建广告位'"
      >
        <div>
          <EditZone :item="editFormData" :editReq="editReq" :id="id" @submitSuccess="submitSuccess" :transfer="false"></EditZone>
        </div>
      </Modal>
  </Layout>
</template>
<script>
import { mapState } from 'vuex'
import {Button,Icon,Switch,Select,Search,Option,SnPage,TableExpand} from "_c"
import { Layout, Content, Header,Table,Modal} from 'iview';
import EditZone from "./edit-zone";
import { tableMixin,selectMixin } from '@/mixins'


const components={
    SnPage,
    Table,
    EditZone,
    Search,
    Icon,
    Button,
    Layout,
    Content,
    Header,
    Select,
    Option,
    Modal,
    'sn-switch': Switch
};
const columns = [
    {
        title: '广告位名称',
        key: 'title',
    },
    {
        title: '媒体名称',
        key: 'resource_title',
    },
    {
        title: '媒体商',
        key: 'agent_username'
    },
    {
        title: '平台',
        slot: 'setting.platform'
    },
    {
        title: '效果',
        slot: 'setting.type'
    },
    {
        title: '尺寸',
        slot: 'setting.size'
    },
    {
        title: '支持的广告类型',
        slot: 'type',
    },
    {
        title: '状态',
        slot: 'status',
    },
    {
        title: '备注',
        key: 'memo'
    },
    {
        title: '操作',
        slot: 'action',
        width:300
    },
]


const statusTypes = [
    {
    label: '全部状态',
    value:undefined
},{
    label: '停用',
    value:0
}, {
    label: '正常',
    value:1
}, {
    label: '未审核',
    value: 2
}, {
    label: '未通过',
    value: 3
}];
const settingType={
    'float':'悬浮',
    'inlay':'嵌入',
    'splash':'闪烁',
    'in_feed':'信息流',
};
const columnsMobile = [
    {
        type: 'expand',
        width: 50,
        render: (h, params) => h(TableExpand, {
            props: {
                row: params.row,
                fields: [
                    { label: '平台',render:()=>params.row.setting.platform },
                    { label: '效果',render:()=>settingType[params.row.setting.type]},
                    { label: '尺寸',render:()=>params.row.setting.size},
                    { label: '支持的广告类型',render:()=>params.row.setting.size==1?'cpc':'cps'},
                ]
            }
        })
    },
    {
        title: '广告位名称',
        key: 'title',
    },
    {
        title: '媒体名称',
        key: 'resource_title',
    },
    {
        title: '媒体商',
        key: 'agent_username'
    }, {
        title: '状态',
        slot: 'status',
    },
]

let tableReq = {
    funcName: 'adzone_table',
    funcResName: 'data()',
    funcNextResName: 'data[]',
    tableName: 'AdZone',
    column: ['title','resource','resource_id','agent_id','setting.size','setting.platform','setting.type','type','status','memo','agent_username','resource_title'],
    tableInfo: {
        "agent":{
            "AgentUser":{
                "_id":"$agent_id",
                "@column":"username"
            }
        }
    }
};

let filterObj = {
    title$: '',       // 媒体类型搜索
    status: null,      // 媒体状态筛选
}

let editReq = {
    tableName: 'Adzone',
    column: ['resource', 'agent_id', 'agent_username', 'resource_title', 'resource_id', 'title', 'setting.platform', 'setting.type', 'setting.position', 'setting.size','setting.adtype_mobile','setting.adtype_pc',],
}


export default {
  mixins: [tableMixin,selectMixin],
  name:'zone',
  data() {
    return {
      tableReq,
      filterObj,
      columns,
      columnsMobile,
      editReq,
      settingType,
      statusType:'',
      statusList:statusTypes,
      filterType:'',
      tableData: [],
      titleList:[],
      editFormData:{}
    }
  },
  computed: {
    ...mapState('basic', [
      'isMobile'
    ]),
    ...mapState('app/zone', [
      'ADType',
    ]),
  },
  components,
  methods: {
      getQuery() {
          const isNone = field => field == undefined || field === ''
          const {title$, status} = this.filterObj
          let query = {
              "title$": title$,      // 媒体类型搜索
              "status": status,
          }
          if (isNone(status)) delete query.status
          return query
      },
  },
}
</script>
<style lang="less" scoped>
.s-content-header {
  height: 96px;
  padding: 30px;
  line-height: 36px;
  background: #ebedf2;
  display: flex;
  .header-left {
    width: 119px;
    position: relative;
    top: -1px;
  }
  .header-right {
    flex: 1;
    display: flex;
    flex-direction: row-reverse;
  }
}
.ivu-layout-content {
  background: @white-color;
}
.ivu-modal-wrap {
  top: 30px;
}
.open-icon {
  position: relative;
  top: -1px;
}

.mr10 {
  margin-right: 10px;
}

@v: 100vw/750;
.s-home-xs {
  padding: 0;
  .header-right {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .s-content-header {
    padding: 30 * @v 20 * @v;
    height: auto;
  }
  /deep/ .s-table-table td {
    text-align: center;
  }
  /deep/ .s-table-mobile-hide-name {
    text-align: left;
  }
  /deep/ .s-table-th {
    font-size: 12px;
  }
  .w100 {
    width: 100%;
    margin-top: 24 * @v;
  }
  .w100 /deep/ .container {
    width: 100%;
  }
}
/deep/ .s-btn {
  margin: 0 10px 0 0;
}
/deep/ .s-table-mobile-hide-name {
  width: 278 * @v;
  padding-left: 80 * @v;
}
/deep/ .ivu-modal-header-inner {
  text-align: center;
}

/deep/ .ivu-modal-body {
  top: 68px;
  background-color: #f9fafb;
}
/deep/ .ivu-modal-header {
  padding: 22px 16px;
}
/deep/ .ivu-modal-close {
  border-radius: 50%;
  background-color: #354052;
  right: 30px;
  top: 20px;
  .ivu-icon-ios-close {
    color: #fff;
    font-size: 26px;
  }
}
/deep/ .ivu-modal-header-inner {
  text-align: center;
  font-size: 16px;
  color: #354052;
}
/deep/ .ivu-modal-wrap {
  border-top: 1px solid #f1f2f4;
  box-shadow: 0px -6px 20px 0px rgba(154, 167, 179, 0.3);
}
</style>

