<template>
  <div class="s-talbe-expand-xs">
    <Row v-for="field in fields"
      :key="field.key">
      <Col span="24">
      <span class="field">{{field.label}}</span>
      <span v-if="!field.render">{{row[field.key]}}</span>
      <span v-else>{{field.render({value: row[field.key],row})}}</span>
      </Col>
    </Row>

  </div>
</template>


<script>

/**
 * @props 
 * fields ==> [{key: 'terminal', label: '使用终端'},{key: 'platform', label: '平台'}]
 */
import { Row, Col } from 'iview'
import Icon from '../icon'

const components = { Row, Col, Icon }
export default {
  props: {
    row: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    }
  },
  components,
}
</script>

<style lang="less">
td.ivu-table-expanded-cell {
  padding: 0.15rem 0.6rem 0.15rem 0.75rem;
  background: #ffffff;
}
.s-talbe-expand-xs {
  .ivu-row {
    margin: 0.15rem auto;
  }
  & .ivu-col > span {
    display: inline-block;
    font-size: 0.22rem;
    vertical-align: center;
  }
  .field {
    width: 1.54rem;
    color: #7f8fa4;
  }
  .value {
    color: #354052;
  }
}

.ivu-table-cell-expand {
  // &.ivu-table-cell-expand-expanded {
  //   transform: none;
  //   .ivu-icon-ios-arrow-forward:before {
  //     content: "\E62B"; // EXPAND
  //   }
  // }
  // .ivu-icon-ios-arrow-forward:before {
  //   content: "\E62C"; // OPEN
  //   color: #7f8fa4;
  // }
}
</style>




