<template>
  <div>
    <Table v-if="!isMobile"
       height="520"
      :columns="columns"
      :data="tableData"
      :loading="loading"
      @on-sort-change="handleSortChange">
      <template slot-scope="{row}"
        slot="addtime">
        {{row.addtime | formatTime('YYYY-MM')}}
      </template>

      <template slot-scope="{row}"
        slot="apply_pay">
        ￥{{row.apply_pay | toRegularNum}}
      </template>

      <template slot-scope="{row}"
        slot="pay">
        ￥{{row.pay?row.pay:0 | toRegularNum}}
      </template>

      <template slot-scope="{row}"
                slot="status">
        {{status[row.status]}}
      </template>
    </Table>

    <Table v-if="isMobile"
      class="table-xs"
      :columns="columnsMobile"
      :data="tableData"
      :loading="loading"
      @on-sort-change="handleSortChange">
      <template slot-scope="{row}"
        slot="addtime">
        {{row.addtime | formatTime('YYYY-MM')}}
      </template>

      <template slot-scope="{row}"
        slot="apply_pay">
        ￥{{row.apply_pay | toRegularNum}}
      </template>

      <template slot-scope="{row}"
        slot="pay">
        ￥{{row.pay?row.pay:0 | toRegularNum}}
      </template>

      <template slot-scope="{row}"
        slot="status">
        {{status[row.status]}}
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
import { SnPage, TableExpand } from '_c'
import { Table } from 'iview'
import { mapState } from 'vuex'
import { formatTime, toRegularNum } from '@/mixins/globalMixin'
let filterObj = {
    "@order":"",
}
const columns = [{
  title: '申请时间',
  key: 'addtime',
  slot: 'addtime',
  sortable:'custom',
  sortKey:'addtime',
}, {
  title: '申请体现金额',
  key: 'apply_pay',
  slot: 'apply_pay',
  align:'right',
    sortable:'custom',
    sortKey:'apply_pay',
}, {
  title: '实际支付',
  key: 'pay',
  slot: 'pay',
  align:'right',
  sortable:'custom',
  sortKey:'pay',
}, {
  title: '状态',
  slot: 'status',
}, {
  title: '备注',
  key: 'memo'
}]

const columnsMobile = [{
  type: 'expand',
  width: 50,
  render: (h, params) => h(TableExpand, {
    props: {
      row: params.row,
      fields: [{
        key: 'memo',
        label: '备注'
      }]
    }
  })
}, {
  title: '申请时间',
  key: 'addtime',
  slot: 'addtime'
}, {
  title: '申请体现金额',
  key: 'apply_pay',
  slot: 'apply_pay'
}, {
  title: '实际支付',
  key: 'pay',
  slot: 'pay'
}, {
  title: '状态',
  key: 'status'
}]

let tableReq = {
  tableName: 'FinancialPay',
  column: ['addtime', 'apply_pay', 'pay', 'status'],
}

export default {
  mixins: [tableMixin],
  data() {
    return {
      tableReq,
      columns,
      columnsMobile,
      tableData: [],
    }
  },
  computed: {
    ...mapState('basic', [
      'isMobile'
    ]),
    ...mapState('app/financial', [
        'status',
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
  }
}
</script>

