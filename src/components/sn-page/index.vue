<template>
  <div>
    <Page v-if="!isMobile"
      :total="total"
      :current="current"
      :page-size="pageSize"
      show-sizer
      show-elevator
      show-total
      placement="bottom"
      @on-change="handleChangePage"
      @on-page-size-change="handleChangeSizePage">
      <template>
        共<em class="total-count">{{total}}</em>条数据
      </template>
    </Page>

    <Page v-else
      class="s-page-xs"
      :total="total"
      :current="current"
      :page-size="pageSize"
      @on-change="handleChangePage">
    </Page>
  </div>
</template>

<script>
import { Page } from 'iview'
import { mapState } from 'vuex'

export default {
  props: {
    total: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true
    },
    pageSize: {
      type: Number,
      required: true
    },
  },
  computed: mapState('basic', [
    'isMobile'
  ]),
  methods: {
    handleChangePage(curPage) {
      this.$emit('on-change', curPage)
    },
    handleChangeSizePage(count) {
      this.$emit('on-page-size-change', count)
    }
  },
  components: { Page },
}
</script>

<style lang="less" scoped>
.total-count {
  color: #2a9ff6;
}
</style>


