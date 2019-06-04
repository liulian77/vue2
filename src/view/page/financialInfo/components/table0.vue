<template>
  <div>
    <sn-table v-if="!isMobile"
              :height="tableHeight"
              :columns="columns"
              :data="tableData"
              :loading="loading"
              @on-sort-change="handleSortChange"
    >
      <template slot-scope="{row}"
                slot="action">
        <div class="s-table-btn-group">
          <sn-button type="primary"
                     size="stretch"
                     ghost
                     class="mr10"
                     @click.native='transfer(row)'
          >转账</sn-button>
          <sn-button type="success"
                     size="stretch"
                     ghost
                     @click.native='withDraw(row)'
          >退回</sn-button>
        </div>
      </template>
    </sn-table>
<!--    <Table v-if="isMobile"
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
        &lt;!&ndash;￥{{row.pretax_income | toRegularNum}}&ndash;&gt;
        <tablePoptip  :data="row.agents" :columns="row | popColumns" :income="row.pretax_income | toRegularNum"></tablePoptip>
      </template>
    </Table>-->
  </div>
</template>

<script>
import { Button, TableExpand,TablePoptip } from '_c'
import { Table } from 'iview'
import { mapState } from 'vuex'
import { formatTime, toRegularNum } from '@/mixins/globalMixin'
import { log } from 'util';
import moment from 'moment';
const columns = [
    {
        title: '日期',
        key: 'day',
        render: (h, {row}) => {
          return h('span', {domProps: {
            innerHTML: `${moment(''+row.date, 'YYYYMMDD').format('YYYY-MM-DD')}`
          }})
        }
    }, {
        title: '应用名称',
        key: 'appname',
        render: (h, {row}) => h('span', {domProps: {innerHTML: row.appname ? (row.app_status!==undefined ? (row.app_status === -1 ? row.appname + '(已删除)' : row.appname) : row.appname) : '-', style: (row.app_status !== undefined ? (row.app_status === -1 ? 'color: red;' : '') : '')}})
    },{
        title: '下载量',
        key: 'count'
},{
        title: '消费金额',
        key: 'price',
        render: (h, params) =>h('span',{domProps: {innerHTML: `￥${toRegularNum(params.row.price?params.row.price:'0')}`}}),
        align:'left'
}];

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




export default {
  props:{
      tableHeight:{
          type:Number,
          default:400
      },
      tableData:{type:Array},
      loading:{type:Boolean},
  },
  data() {
    return {
      columns,
      columnsMobile,
    }
  },
  computed: {
    ...mapState('basic', [
      'isMobile'
    ])
  },
  methods: {
      handleSortChange(){

      },
      transfer(row) {
        this.$emit('transferToAder', row);
      },
      withDraw(row) {
        this.$emit('withdrawToPlatform', row);
      }
  },
  components: {
    'sn-table':Table,
    'sn-button':Button,
    TableExpand,
    TablePoptip,
  }
}
</script>
<style scoped>
  /deep/ .flex-right{
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .mr10{
    margin-right: 10px;
  }
</style>
