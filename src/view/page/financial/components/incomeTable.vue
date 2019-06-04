<template>
  <div>
    <Table v-if="!isMobile"
           height="520"
      :columns="columns"
      :data="tableData"
      :loading="loading"
      @on-sort-change="handleSortChange">

      <template slot-scope="{row}"
        slot="date">
        {{row.date | formatTime('YYYY-MM')}}
      </template>

      <template slot-scope="{row}"
        slot="pretax_income">
        <!--￥{{row.pretax_income | toRegularNum}}-->
          <tablePoptip  :data="row.agents" :columns="row | popColumns" :income="row.pretax_income | toRegularNum"></tablePoptip>
      </template>

      <template slot-scope="{row}"
        slot="pretax_pay">
        ￥{{row.pretax_pay | toRegularNum}}
      </template>

      <template slot-scope="{row}"
        slot="tax">
        ￥{{row.tax | toRegularNum}}
      </template>

      <template slot-scope="{row}"
        slot="agent_username">
        {{type[row.type]}}
      </template>

      <template slot-scope="{row}"
        slot="suffix_tax">
        ￥{{(row.pretax_pay + row.tax) | toRegularNum}}
      </template>

    </Table>

    <Table v-if="isMobile"
      class="table-xs"
      :columns="columnsMobile"
      :data="tableData"
      :loading="loading"
      @on-sort-change="handleSortChange">
      <template slot-scope="{row}"
        slot="agent_username">
        {{type[row.type]}}
      </template>
      <template slot-scope="{row}"
                slot="pretax_income">
        <!--￥{{row.pretax_income | toRegularNum}}-->
        <tablePoptip  :data="row.agents" :columns="row | popColumns" :income="row.pretax_income | toRegularNum"></tablePoptip>
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
  </div>
</template>

<script>
import { tableMixin } from '@/mixins'
import { SnPage, TableExpand,TablePoptip } from '_c'
import { Table } from 'iview'
import { mapState } from 'vuex'
import { formatTime, toRegularNum } from '@/mixins/globalMixin'
let filterObj = {
    "@order":"",
}
const columns = [{
  title: '月份',
  key: 'date',
  slot: 'date',
  sortable:'custom',
  sortKey:'date',
}, {
  title: '财务对象',
  slot: "agent_username",
}, {
  title: '我的税前收入',
  key: 'pretax_income',
  slot: 'pretax_income',
  align:'right',
  className:'flex-right',
  sortable:'custom',
  sortKey:'pretax_income',
}, {
  title: '实际税前支付',
  key: 'pretax_pay',
  slot: 'pretax_pay',
  align:'right',
    sortable:'custom',
    sortKey:'pretax_pay',
}, {
  title: '代扣税',
  key: 'tax',
  slot: 'tax',
  align:'right',
    sortable:'custom',
    sortKey:'tax',
}, {
  title: '实际税后支付',
  slot: 'suffix_tax',
  align:'right',
}, {
  title: '备注',
  key: 'memo_agent'
}]

const columnsMobile = [{
  type: 'expand',
  width: 50,
  render: (h, params) => h(TableExpand, {
    props: {
      row: params.row,
      fields: [{
        key: 'pretax_pay',
        label: '实际税前支付',
        render({ value }) {
          return formatTime(value, 'YYYY-MM')
        }
      }, {
        key: 'tax',
        label: '代扣税',
        render({ value }) {
          return toRegularNum(value)
        }
      },
      {
        key: 'suffix_tax',
        label: '实际税后支付',
        render({ row }) {
          return toRegularNum(row.pretax_pay + row.tax)
        }
      },
      {
        key: 'memo_agent',
        label: '备注'
      }]
    }
  })
}, {
  key: 'agent_username',
  title: '财务对象',
  slot: 'agent_username'
}, {
  key: 'pretax_income',
  title: '我的税前收入',
  slot: 'pretax_income'
}]

let tableReq = {
  funcName: 'user_account',
  funcResName: 'data()',
  tableName: 'FinancialAccount',
  column: ['date', 'type', 'pretax_income', 'pretax_pay', 'tax', 'pay', 'memo_agent', 'agent_id','distributor_id'],
  tableInfo: {
    'agent': {
      "AgentUser": {
        "_id": "$agent_id",
        "@column": "username,distributor_ratio"
      }
    }
  }
}



export default {
  mixins: [tableMixin],
  data() {
    return {
      tableReq,
      columns,
      columnsMobile,
      tableData:[]
    }
  },
  computed: {
    ...mapState('basic', [
      'isMobile'
    ]),
    ...mapState('app/financial', [
        'type',
    ]),
  },
  methods: {
    getQuery() {
        let order=this.tableReq.tableInfo['@order'];
        return { "@order":order }
    },
  },
  components: {
    Table,
    SnPage,
    TableExpand,
    TablePoptip,
  },
  filters:{
      popColumns(val){
          return [
              {
                  title: '媒体商',
                  key: 'username',
              },
              {
                  title: '渠道分成比例',
                  key:'distributor_ratio',
                  render:(val)=>`${val}%`
              },
              {
                  title: '媒体商收益',
                  key:'pretax_income',
                  render:(val)=>`￥${val}`
              },
          ]
      }
  }

}
</script>
<style scoped>
  /deep/ .flex-right{
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
