<template>
  <Layout :class="[isMobile?'s-home-xs':'s-home-web']">
    <Header class="s-content-header">
      <div class="header-left"
        v-if="!isMobile">
        <Button @click.native="editForm = true"
          type="primary"
          class="open-btn"
          size="stretch-h36"
          v-if="!isMobile">
          <Icon type="open"
            color="#fff"
            size="12"
            class="open-icon"
            @click.native="del(item,i)" />
          新建媒体</Button>
      </div>
      <div class="header-right">
        <template v-if="!isMobile">
          <div>
            <Search :width="270"
              showName="label"
              :pretext="'搜索媒体名称'"
              :Level="true"
              :disabled="true"
              v-model="filterObj.title$"></Search>
          </div>
          <div class="mr10">
            <Select :width="110"
              placeholder="全部状态"
              v-model="filterObj.status">
              <Option v-for="item in status"
                :label="item.label"
                :value="item.value">
              </Option>
            </Select>
          </div>
          <div class="mr10">
            <Select :width="130"
              :placeholder="typeObj.label"
              v-model="filterObj.type"
              @change="typeChange"
            >
              <Option v-for="item in mediaTypes"
                      :label="item.label"
                      :value="item.name"
                      :selected="item.selected"
              >
              </Option>
            </Select>
          </div>
        </template>
        <template v-else>
          <div class="mr10">
            <Select :width="130"
                    :placeholder="typeObj.label"
                    v-model="filterObj.type"
                    @change="typeChange"
            >
              <Option v-for="item in mediaTypes"
                      :label="item.label"
                      :value="item.name"
                      :selected="item.selected"
              >
              </Option>
            </Select>
          </div>
          <div class="mr10">
            <Select :width="110"
              placeholder="全部状态"
              v-model="filterObj.status">
              <Option v-for="item in status"
                :label="item.label"
                :value="item.value">
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
        @on-sort-change="handleSortChange">

        <template slot-scope="{row}"
          slot="agent_id">
          {{row.agent_id}}
        </template>

        <template slot-scope="{row}"
          slot="status">
          <Switch class="s-table-switch"
            :beforeChange="beforeSwitchChange"
            @on-change="handleSwitch(row)"
            :true-value="1"
            :false-value="0"
            v-model="row.status"></Switch>
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
          </div>
        </template>
        <template slot-scope="{row}"
          slot="mediaType">
           {{typeObj.value}}
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
          {{row.agent_id}}
        </template>

        <template slot-scope="{row}"
          slot="status">
          <Switch class="s-table-switch"
            :beforeChange="beforeSwitchChange"
            @on-change="handleSwitch(row)"
            :true-value="1"
            :false-value="0"
            v-model="row.status"></Switch>
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
    <Modal v-model="editForm"
      :footer-hide="true"
      fullscreen
     :transfer="false"
     :title="id?'修改媒体':'新建媒体'"
           :mask="false"
      :transition-names="['slide-down','slide-down']" >
      <div>
        <EditResource  @submitSuccess="submitSuccess" :id="id" :editReq="editReq"></EditResource>
      </div>
    </Modal>
  </Layout>
</template>
<script>
import { mapState } from 'vuex'
import { Button, Icon, Switch, Select, Search, Option, SnPage, TableExpand } from "_c"
import EditResource from "./edit-resource";
import { Layout, Content, Header, Modal, Table } from 'iview';
import { api_common } from '@/api'
import { tableMixin } from '@/mixins'

const columns = [
  {
    title: '媒体名称',
    key: 'title',
    sortable: 'custom'
  },
  {
    title: '媒体类型',
    key: 'type',
    sortable: 'custom'
  },
  {
    title: '媒体类别',
    slot: 'mediaType'
  },
  {
    title: '媒体商',
    slot: 'agent_id'
  },
  {
    title: '平台',
    key: 'platform'
  },
  {
    title: '适用终端',
    key: 'terminal'
  },
  {
    title: '状态',
    slot: 'status'
  },
  {
    title: '操作',
    slot: 'action'
  },
]


let tableReq = {
  funcName: 'resource_table',
  funcResName: 'data()',
  tableName: 'ResourceSoft',
  column: ['title', 'type', 'agent_id', 'platform', 'terminal', 'status', 'description'],
  tableInfo: {
    "agent": {
      "AgentUser": {
        "_id": "$agent_id",
        "@column": "username"
      }
    },
  }
}

let filterObj = {
  type: 'ResourceSoft',       // 媒体类型搜索
  title$: '',      // 媒体名称筛选
  status: null,      // 媒体状态筛选
}


let editReq = {
    tableName: 'ResourceSoft',
    column: ['domain', 'title', 'filing', 'type', 'visitnum', 'ex_ad_type', 'ex_ad_ctg', 'description', 'download_url', 'use_num', 'download_num', 'keyword', 'terminal', 'packge_name', 'version', 'platform',],
};

export default {
  name:'resource',
  mixins: [tableMixin],
  data() {
    return {
      tableReq,
      filterObj,
      columns,
      editReq,
        typeObj: {
          label: '软件',
          value: 'soft',
          name:'ResourceSoft'
      },
      columnsMobile:[
          {
              type: 'expand',
              width: 50,
              render: (h, params) => {
                  let self=this;
                  return h(TableExpand, {
                      props: {
                          row: params.row,
                          fields: [
                              { label: '媒体类别',render:()=>self.typeObj.value},
                              { key: 'platform', label: '平台' },
                              { key: 'terminal', label: '适用终端' },
                          ]
                      }
                  })
              }
          },
          {
              title: '媒体名称',
              key: 'title',
          },
          {
              title: '媒体类型',
              key: 'type',
              sortable: 'custom'
          },
          {
              title: '媒体商',
              slot: 'agent_id'
          },
          {
              title: '状态',
              slot: 'status'
          },
      ],
      tableData: [],
    }
  },
  computed: {
    ...mapState('basic', [
      'mediaTypes'
    ]),
    ...mapState('app/resource', [
        'mediaType','visitnum','platforms','terminal','status'
    ],),
  },
  components: {
    Table,
    EditResource,
    Search,
    Icon,
    Button,
    Layout,
    Content,
    Header,
    Select,
    Option,
    Modal,
    'i-switch': Switch,

    TableExpand,
    SnPage,
  },
  methods: {
    getQuery() {
      const isNone = field => field == undefined || field === ''
      const {  title$, status } = this.filterObj
        let query = {
        "status": status,
        "title$": title$,     // 媒体名称筛选
      }
      if (isNone(status)) delete query.status
      return query
    },
    typeChange(val){
        this.$set(this.tableReq,'tableName',val);
        this.mediaTypes.forEach(item=>{
            if(item.name==val){
                this.typeObj=item;
            }
        })
    }
  },
  watch:{
      'tableReq.tableName'(val){
          this.$set(this.editReq,'tableName',val);
      }
  }
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
}
/deep/ .s-table-btn-group .s-btn {
  margin: 0 10px 0 0;
}

/deep/ .ivu-modal-body {
  top: 68px;
  background-color: #f9fafb;
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
/deep/ .ivu-modal-header {
  padding: 22px 16px;
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

