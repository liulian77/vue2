import fp from 'lodash/fp';
import { Message } from 'iview';
import { Dialog } from '_c/dialog';

export default {
  data() {
    return {
      // 查询条件
      tableMixin_query: {
        // 当前第几页
        page: 1,
        // 每页好多条,
        row: 10,
        // 后端排序的字段
        sort_field: '',
        // 后端字段升序还是降序
        sort_dir: '',
        // 模糊查询字段
        fuzzy: ''
      },
      // 表格列的配置
      tableMixin_columns: [],
      // 表格展示的数据
      tableMixin_tableData: [],
      // 表格的分页列表数据
      tableMixin_pageSizes: [10, 20, 30, 40],
      // 列表总共有好多数据
      tableMixin_total: 0,
      // 是否是初次请求数据,初次请求不用去抖搜索等
      tableMixin_isFirstGetting: true,
      // 是否正在请求表格数据
      tableMixin_isLoading: false,
      // 增删查改loading的text
      tableMixin_loadingText: {
        // 刷新中的提示
        get: '正在加载表格数据',
        // 删除中的提示
        del: '正在删除',
        // 删除前的确认提示
        delConfirmText: '确认删除吗？'
      },
      // 主表单是否显示
      tableMixin_isShowForm: false,
      // 主表单的类型,add:新增,edit:编辑,details:详情
      tableMixin__formStatus: 'add',
      // 主表单的记录_id,编辑和查看详情的时候会用到
      tableMixin__formId: '',
      // 主表单的title,请在组件里重写
      tableMixin__formTitle: '',
      // data和count在res中的路径
      tableMixin_resPath: {
        // 表格数据的路径
        data: 'data',
        // 总条数的路径
        count: 'count'
      }
    };
  },
  computed: {
    // 根据表单状态显示的表单标题
    tableMixin__cFormTitle() {
      let title = '';
      if (this.tableMixin__formStatus === 'add') {
        title = `新增${this.tableMixin__formTitle}`;
      } else if (this.tableMixin__formStatus === 'edit') {
        title = `编辑${this.tableMixin__formTitle}`;
      } else if (this.tableMixin__formStatus === 'details') {
        title = `查看${this.tableMixin__formTitle}`;
      }
      return title;
    }
  },
  watch: {
    // 监听查询条件改变,改变时刷新表格数据
    tableMixin_query: {
      handler(val) {
        console.log(val)
        if (this.tableMixin_isFirstGetting) {
          this.tableMixin_isFirstGetting = false;
          this.tableMixin_getTableData();
        } else {
          this.tableMixin_debounceGetTableData();
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /**
     * 新增表格数据的接口
     * @returns {Promise}
     */
    tableMixin_api_addTableItem() {
      throw new Error('必须在组件中实现 tableMixin_api_addTableItem');
    },
    /**
     * 请求表格数据的接口方法
     * @returns {Promise}
     */
    tableMixin_api_getTableData() {
      throw new Error('必须在组件中实现 tableMixin_api_getTableData');
    },
    /**
     * 删除表格数据的接口方法
     * @returns {Promise}
     */
    tableMixin_api_delTableItem() {
      throw new Error('必须在组件中实现 tableMixin_api_getTableData');
    },
    // 去抖的请求表格数据的方法
    tableMixin_debounceGetTableData: fp.debounce(400, function() {
      this.tableMixin_getTableData();
    }),
    tableMixin_getTableData_success() {
      throw new Error('必须在组件中实现 formMixin_api_up');
    },
    // 请求表格数据的方法
    async tableMixin_getTableData() {
      // 正在请求数据就不再请求
      if (this.tableMixin_isLoading) return;
      this.tableMixin_isLoading = true;
      try {
        const res = await this.tableMixin_api_getTableData(
          this.tableMixin_query
        );
        // 返回结果校验
        if (!fp.isNumber(res.count)) {
          throw new Error(
            'tableMixin_api_getTableData返回结果中res.count必须为number类型'
          );
        }
        if (!fp.isArray(res.aaData)) {
          throw new Error(
            'tableMixin_api_getTableData返回结果的res.aaData必须为array类型'
          );
        }
        this.tableMixin_tableData = res[this.tableMixin_resPath.data] || [];
        this.tableMixin_total = res[this.tableMixin_resPath.count] || 0;
        // 请求成功需要执行的事件(一般用不着)
        this.tableMixin_getTableData_success(res);
      } catch (error) {
        // this.$utils.fetchCatch(error);
      } finally {
        this.tableMixin_isLoading = false;
      }
    },
    // 删除表格数据的方法
    tableMixin_delTableItem({ _id }) {
      const self = this;
      Dialog({
        type: 'warning',
        text: self.tableMixin_loadingText.delConfirmText,
        async onConfirm() {
          try {
            // await this.$confirm(this.tableMixin_loadingText.delConfirmText);
            self.tableMixin_isLoading = true;
            await self.tableMixin_api_delTableItem({ _id });
            // 删除的是当前条件的最后一条数据且不在第一页,那么页码减1
            if (
              self.tableMixin_tableData.length === 1 &&
              self.tableMixin_query.page > 1
            ) {
              self.tableMixin_query.page -= 1;
            }
            await self.tableMixin_getTableData();
            Message.success('删除成功!');
            self.tableMixin_debounceGetTableData();
          } catch (error) {
            Message.warning('删除失败,请稍候再试!');
            // self.$utils.fetchCatch(error);
          } finally {
            // 关闭loading
            self.tableMixin_isLoading = false;
          }
        },
        onCancel() {
        }
      });
    },
    // 表格切换每页条数时的回调
    handlePageSizeChange(pageSize) {
      this.tableMixin_query.row = pageSize;
    },
    // 表格自定义排序事件
    tableMixin__sortChange({ prop, order }) {
      this.tableMixin_query.sort_field = prop;
      if (order === 'ascending') {
        this.tableMixin_query.sort_dir = 'asc';
      } else if (order === 'descending') {
        this.tableMixin_query.sort_dir = 'desc';
      } else {
        this.tableMixin_query.sort_dir = '';
      }
    },
    // 新增信息,打开主表单的方法
    tableMixin_openAddForm() {
      this.tableMixin__formStatus = 'add';
      this.tableMixin_isShowForm = true;
    },
    // 修改信息,打开主表单的方法
    tableMixin_openEditForm({ _id }) {
      this.tableMixin__formStatus = 'edit';
      this.tableMixin__formId = _id;
      this.tableMixin_isShowForm = true;
    },
    // 查看信息,打开主表单的方法
    tableMixin_openDetailsForm({ _id }) {
      this.tableMixin__formStatus = 'details';
      this.tableMixin__formId = _id;
      this.tableMixin_isShowForm = true;
    },
    // 主表单保存成功事件
    tableMixin_onFormSubmitSuccess() {
      this.tableMixin_isShowForm = false;
      this.tableMixin_getTableData();
    }
  }
};
