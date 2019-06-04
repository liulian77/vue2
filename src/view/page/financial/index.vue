
<template>
  <div class="s-financial-content"
    :class="[isMobile?'s-home-xs':'s-home-web']">
    <div class="s-financial-card-box">
      <div class="card-box z-index-2">
        <financial-card :Balance="info.balance | toRegularNum"
          :freeze="info.freeze | toRegularNum"
          @withdraw="withdraw"
          :content="true"
        >
          <p class="slot-title">本月预估计收入</p>
          <p class="slot-content">￥{{info.earning | toRegularNum}}</p>
        </financial-card>
      </div>
      <div class="card-box z-index-1">
        <financial-card :Balance="info.balance | toRegularNum"
          :freeze="info.freeze | toRegularNum"
          @withdraw="modify"
          type="blank"
          :content="true"
          :blank="{img:blankImg(info.bank),number:bankAccount(info.bank_account),type:'个人储蓄卡',name:info.bank}">
          <template v-if="!isMobile">
            <p class="slot-title">收款人</p>
            <p class="slot-content">{{info.person_name}}</p>
            <p class="slot-title">身份证号码</p>
            <p class="slot-content">{{info.person_idcard | idCard}}</p>
          </template>
        </financial-card>
      </div>
    </div>
    <div class="s-financial-Tabs-box">
      <Tabs type="card"
        class="Tabs-box"
        @on-click="tabsClick">
        <TabPane label="月收入报表"></TabPane>
        <TabPane label="提现记录"></TabPane>
      </Tabs>
    </div>
    <div class="s-financial-table-box">
      <transition-group>
        <income-table key="income"
          v-show="tableShow === 'income'"></income-table>
        <withdrawals-table key="withdrawals"
          v-show="tableShow === 'withdrawals'"></withdrawals-table>
      </transition-group>
    </div>
  </div>
</template>
<script>

import { FinancialCard, TablePoptip, EChartsBar, EChartsMap, Report } from "_c"
import { Tabs, TabPane } from 'iview';
import { IncomeTable, WithdrawalsTable } from './components'
import { mapState } from 'vuex'
import { toRegularNum } from '@/mixins/globalMixin'
import { api_general } from '@/api'


export default {
  name:'financial',
  data() {
    return {
      tableShow: 'income',      // income：月收入报表, withdrawals：提现记录
      info: {
        balance: '',              // 账户余额
        bank: '',                 // 银行
        bank_account: '',         // 银行卡号
        person_name: '',          // 姓名
        person_idcard: '',        // ID_CARD
        earning: '',              // 预估收入
        freeze: '',               // 冻结金额
      }
    }
  },
  computed: {
    ...mapState('basic', [
      'isMobile','userinfo',
    ]),
    ...mapState('app/financial', [
        'blanks'
    ]),
  },
  created() {
    this.renderAccountInfo()
  },
  methods: {
    renderAccountInfo() {
        Object.keys(this.info).forEach(item=>{
          this.$set(this.info,item,this.userinfo[item])
      });
    },
    withdraw() {
      console.log('提现')
    },
    modify() {
      console.log('修改')
    },
    tabsClick(a) {
      if (a === 0)
        this.tableShow = 'income'
      else if (a === 1)
        this.tableShow = 'withdrawals'
    },
    bankAccount(val){
        let len=val.length;
        let end=val.slice(-4,len);
        let str='**** **** **** ';
        str+=end;
        return str;
    },
    blankImg(val){
        let res=Object.values(this.blanks).indexOf(val);
        return 'blank' + (res > -1 ? Object.keys(this.blanks)[res] : '08');
    }
  },
  components: {
    Tabs,
    TabPane,
    FinancialCard,
    EChartsBar,
    EChartsMap,
    ReportMain: Report,
    IncomeTable,
    WithdrawalsTable
  },
  filters:{
      idCard(val){
          let len=val.length;
          let start=val.slice(0,4);
          let end=val.slice(-4,len);
          let str='';
          if(len>8){
              for(let i=0;i<(len-8);i++){
                  str+='*';
              }
          }
          str=start+str+end;
          return str;
      },
  }
}

</script>
<style lang="less" scoped>
@pcOffset: 30px;
@mobileOffset: 0.2rem;
.displayflex {
  display: flex;
  display: -webkit-flex;
}
.s-financial-content {
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.s-financial-card-box {
  width: 100%;
  display: flex;
}
.s-financial-Tabs-box {
  width: 241px;
  .Tabs-box {
    background-color: #fff;
  }
}
@v: 100vw/750;
.s-home-xs {
  padding: 40 * @v 24 * @v;
  .s-financial-card-box {
    flex-wrap: wrap;
    .card-box {
      width: 100%;
      padding-bottom: 40 * @v;
    }
  }
  .s-financial-Tabs-box {
    height: 36px;
    margin-bottom: 40 * @v;
    .Tabs-box {
      height: 36px;
    }
  }
  .s-financial-table-box {
    flex: 1;
    margin: 0 -24 * @v -40 * @v -24 * @v;
    overflow: auto;
  }
}
.s-home-web {
  padding: @pcOffset;
  padding-bottom: 0;
  .displayflex;
  .s-financial-card-box {
    flex-wrap: wrap;
    height: 176px;
    .card-box {
      width: 50%;
      min-width: 416px;
    }
    .card-box:first-child {
      padding-right: 15px;
    }
    .card-box:last-child {
      padding-left: 15px;
    }
  }
  .s-financial-Tabs-box {
    height: 66px;
    .Tabs-box {
      height: 36px;
    }
  }
  .s-financial-table-box {
    flex: 1;
    margin: 0 -30px 0 -30px;
    overflow: hidden;
  }
}
  .z-index-1{
    z-index: 1;
  }
  .z-index-2{
    z-index: 2;
  }
</style>
