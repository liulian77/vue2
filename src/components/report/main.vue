<template>
  <div class="s-report-main"
    :class="{'s-report-main-mobile': isMobile }">
    <div class="h33"></div>
    <div class="s-report-main-legend">
      <div class="s-report-main-legend-checked"
           v-if="isMobile"
           v-on:click="toggleLegent">
        {{ legends }}
        <sm-icon type="arrow-down"
                 color="#bbbbbb"
                 :size="10"
                 class="icon"
                 :class="{'up':!collapsed}" />
      </div>
      <div class="s-report-main-legend-list mt20"
           v-show="showLegend">
        <sm-checkbox-group v-model="checked"
                           size="large">
          <sm-checkbox v-for="(item,field,i) in fields"
                       :label="field"
                       :key="'a' + i"
                       :color="item.color">
                       {{item.text}}
                       <sn-poptip placement="bottom-start" trigger="hover">
                         <sm-icon type="explain" color="#ddd" :size="16" class="tips"></sm-icon>
                        <div class="tips-table" slot="content">
                          {{tips[item.text]}}
                        </div>
                       </sn-poptip>
          </sm-checkbox>
        </sm-checkbox-group>
      </div>
    </div>
    <div class="s-report-main-chart" >
      <sm-echarts-line :option="lineData" class="ec"></sm-echarts-line>
    </div>
  </div>
</template>
<script>
import Icon from "_c/icon";
import Poptip from "_c/poptip";
import { mapState } from 'vuex'
import { ReportRow, ReportCol } from '_c/report/components';
import Checkbox from '_c/report/components/checkbox';
import CheckboxGroup from '_c/report/components/checkbox-group';
import { EChartsLine } from '_c/echarts'
import { formatTime,toRegularNum } from '@/mixins/globalMixin'
import { deepCopy } from '@/utils/assist'
import moment from 'moment'


const fields={
    pv: { color: '#ffbb44', text: 'pv'},
    uv: { color: '#eb4d44', text: 'uv'},
    ip: { color: '#4ad8ae', text: 'ip'},
    down: { color: '#2a9ff6', text: '下载量'},
    launch: {color: '#d25ee6', text: '启动次数'},
    active_user: {color: '#8a5bf6', text: '活跃用户'},
    new_user: {color: '#00c8dc', text: '新增用户'},
};
const tips = {
  'pv': 'PV值：每打开一次下载页，记录1个PV，一天内同一访客多次打开同一页面PV计算多次。',
  'uv': 'UV值：1天（00:00-24:00）之内，访问下载页的不重复用户数（以浏览器cookie为依据），一天内同一访客多次访问下载页只被计算1次。',
  'ip': 'IP值：1天（00:00-24:00）之内，访问下载页的不重复IP数。一天内相同IP地址多次访问下载页只被计算1次。',
  '下载量': '下载量：1天（00:00-24:00）之内，每下载一次应用，记录1个下载，一天内同一访客多次下载同一应用，下载数只被记录1次。',
  '启动次数': '启动次数：打开应用视为启动。完全退出或后台运行超过30s后再次进入应用，视为一次新启动。',
  '新增用户':'新增用户：第一次启动应用的用户（以设备为判断标准）',
  '活跃用户':'活跃用户：启动过应用的用户（去重），启动过一次的用户即视为活跃用户，包括新用户与老用户。这里展示的是截止到各个整点时刻的当活跃用户跃用户'
};
export default {
  name: "ReportMain",
  components: {
    'sm-icon': Icon,
    'sm-checkbox': Checkbox,
    'sm-checkbox-group': CheckboxGroup,
    'sm-report-row': ReportRow,
    'sm-report-col': ReportCol,
    'sm-echarts-line': EChartsLine,
    'sn-poptip': Poptip
  },
  props:{
    items:{
        type:Object,
        default(){
            return {}
        }
    },
    lineSeries:{
        type:Object,
        default(){
            return {}
        }
    }
  },
  data() {
    let self=this;
    return {
      tips,
      checked: ['pv','uv'],//选中的图例
      legends: "",//选中的图例名称
      collapsed: true,//是否收缩图例,
      lineData: {
        xAxis: {
          data: [],
        },
        axisPointer: {
          label: {
            formatter: function (data) {
              return data.value;
            },
          }
        },
        series:[],
        tooltip: {
          formatter: function (params) {
              try {
                  let index=params[0].dataIndex;
                  let date;
                  if ((self.lineSeries.xAxis.data[index] + '').length === 10) {
                    date=moment(self.lineSeries.xAxis.data[index], "YYYYMMDDHH").format('HH');
                    date = date + '~' +  ('0' + (date*1 + 1) ).slice(-2) + '点';
                  } else {
                    date=moment(self.lineSeries.xAxis.data[index], "YYYYMMDD").format('YYYY-MM-DD');
                  }
                  let uv=self.lineSeries.series.uv[index];
                  let pv=self.lineSeries.series.pv[index];
                  let down=self.lineSeries.series.down[index];
                  let ip=self.lineSeries.series.ip[index];
                  let launch=self.lineSeries.series.launch[index];
                  let active_user=self.lineSeries.series.active_user[index];
                  let new_user=self.lineSeries.series.new_user[index];
                  return `
                <span style="color: #354052;font-size: 16px;font-weight: bolder;margin-bottom: 10px;display: block">${date}</span>
                <span style="color: #7f8fa4;font-size: 12px;margin-bottom: 7px;display: block">pv： ${pv?self.toRegularNum(pv,0):0}</span>
                <span style="color: #7f8fa4;font-size: 12px;margin-bottom: 7px;display: block">uv： ${uv?self.toRegularNum(uv,0):0}</span>
                <span style="color: #7f8fa4;font-size: 12px;margin-bottom: 7px;display: block">ip： ${uv?self.toRegularNum(ip,0):0}</span>
                <span style="color: #7f8fa4;font-size: 12px;margin-bottom: 7px;display: block">下载量： ${down?self.toRegularNum(down,0):0}</span>
                <span style="color: #7f8fa4;font-size: 12px;margin-bottom: 7px;display: block">启动次数： ${launch?self.toRegularNum(launch,0):0}</span>
                <span style="color: #7f8fa4;font-size: 12px;margin-bottom: 7px;display: block">活跃用户： ${active_user?self.toRegularNum(active_user,0):0}</span>
                <span style="color: #7f8fa4;font-size: 12px;margin-bottom: 7px;display: block">新增用户： ${new_user?self.toRegularNum(new_user,0):0}</span>`;
              }catch (e) {

              }
          },
        }
      },
      selectItem: {},    //点击选中的对象
      limit: 2,      //能选中的多选个数
      fields
    }
  },
  watch: {
    'checked': {
          handler: function (checked) {
              let c = [];
              for (let i in checked) {
                  c.push(this.fields[checked[i]].text);
              }
              this.$emit('legendChange', checked);
              this.legends = c.join('、');
              this.lineDataChange();
          },
          immediate: true
      },
    lineSeries(val){
        this.showData=deepCopy(val);
        this.lineDataChange();
    }
  },
  methods: {
    toggleLegent() {
      this.collapsed = !this.collapsed;
    },
    toRegularNum,
    lineDataChange(){
        let series=[];
        let time=deepCopy(this.lineSeries.xAxis.data);
        time = time.map(item => {
          if ((item+'').length === 10) {
            return (item + '').slice(-2);
          } else {
            return moment(item, "YYYYMMDD").format('MM-DD')
          }
        });
        let checked=this.checked;
        checked.forEach(item=>{
            let data={};
            data.type='line';
            data.lineStyle={color: fields[item].color};
            data.itemStyle={color: fields[item].color};
            data.emphasis={itemStyle: {color: fields[item].color,}};
            data.item={};
            data.data=deepCopy(this.lineSeries.series[item]);
            series.push(data);
        });
        this.$set(this.lineData,'series',series);
        this.$set(this.lineData.xAxis,'data',time);
    }
  },
  computed: {
    ...mapState('basic', [
      'isMobile'
    ]),
    showLegend() {
      return !this.isMobile || !this.collapsed;
    },
  },
  mounted() {
    this.lineDataChange();
  }
}
</script>
<style lang="less" scoped>
.ec {
  height: 450px;
}
.displayflex {
  display: flex;
  display: -webkit-flex;
}
.s-report-main {
  .displayflex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  .s-report-main-legend {
    position: relative;
    .s-report-main-legend-checked {
      text-align: right;
    }
    .s-report-main-legend-list {
      .displayflex;
      .ivu-checkbox-wrapper {
        height: 0.7rem;
        line-height: 0.7rem;
        .ivu-checkbox {
          margin-right: 10px;
        }
      }
    }
  }
  .s-report-main-chart {
    flex-grow: 1;
    .displayflex;
    flex-direction: column;
  }
}
.s-report-main-mobile {
  .s-report-main-chart {
    min-height: 6rem;
  }
  .s-report-main-legend-list {
    width: 2.78rem;
    flex-direction: column;
    height: auto;
    position: absolute;
    right: 0;
    top: 1rem;
    z-index: 100;
    border: 1px solid #dfe2e5;
    border-radius: 4px;
    padding: 0.17rem 0.3rem;
    background: #fff;
    .ivu-checkbox-wrapper {
      height: 0.7rem;
      line-height: 0.7rem;
      .ivu-checkbox {
        margin-right: 0.2rem;
      }
    }
  }
}
</style>
<style scoped lang="less">
/deep/ .s-report-col p:first-child {
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #7f8fa4;
  line-height: 1;
  padding: 0 5px 0 0;
}
/deep/ .s-report-col p:last-child {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bolder;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #354052;
  line-height: 1;
  padding: 0 5px 0 0;
}

.icon {
  transform: scale(0.6);
  transition: transform 0.3s;
}
.up {
  transform: scale(0.6) rotate(180deg);
}
.s-report-main
  .s-report-main-legend
  .s-report-main-legend-list
  .ivu-checkbox-wrapper {
  height: 16px;
  line-height: 16px;
  margin-bottom: 10px;
}

@v: 100vw/750;
.s-home-xs {
  .s-report-main-legend {
    margin-top: 57 * @v;
    margin-bottom: 50 * @v;
  }
  .s-report-col {
    margin-bottom: 32 * @v;
    p:last-child {
      margin-top: 20 * @v;
      font-size: 15px;
    }
    p:first-child {
      font-size: 12px;
    }
    p {
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
  .s-report-main-mobile .s-report-main-legend-list {
    top: 50 * @v;
  }
  .RMB {
    font-size: 8px;
  }
  .s-report-main-legend-checked {
    font-size: 12px;
  }
}
.s-home-web {
  .h33 {
    height: 33px;
  }
  .s-report-main-header {
    flex: 0 1 124px;
  }
}
  /deep/ .tips-table{
      padding: 20px;
      background-color: #fff;
      color: #354052;
      width: 210px;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
  }
  .mt20{
    margin-bottom: 20px;
  }
</style>

