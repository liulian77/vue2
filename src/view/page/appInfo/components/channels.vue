<template>
    <Layout class="layout">
        <Content>
            <div class="header">
                <div class="header_left">
                    <Button type="primary" @click.native="tableMixin_openAddForm">新建渠道</Button>
                    <Button type="default" class="ml10" @click.native="infoVisibleChange(true)">自定义渠道</Button>
                </div>
                <div class="header_right">
                    <DatePicker
                        type="daterange"
                        :options="options1"
                        :confirm="false"
                        :clearable="false"
                        placement="bottom-end"
                        placeholder="选择日期"
                        style="width: 274px"
                        class="fll"
                        @on-change="getDownTime"
                        v-model="dateTable"
                    ></DatePicker>
                </div>
            </div>
            <Table 
                :columns="columns"
                :data="tableMixin_tableData"
                :height="tableHeight"
                :loading="tableMixin_isLoading">
                <template slot-scope="{row}" slot="status">
                    <i-switch
                        v-if="[0,1].indexOf(row.status) !== -1"
                        :true-value="1"
                        :false-value="0"
                        v-model="row.status"
                        :beforeChange="value=>handleBeforeStatusChange({value,row})"
                    >
                        <span slot="open">开</span>
                        <span slot="close">关</span>
                    </i-switch>
                </template>
            </Table>
            <!-- 分页 -->
            <Page
                class="page"
                :total="tableMixin_total"
                :current.sync="tableMixin_query.page"
                :page-size.sync="tableMixin_query.row"
                :page-size-opts="tableMixin_pageSizes"
                show-sizer
                show-elevator
                show-total
                placement="bottom"
                @on-page-size-change="handlePageSizeChange"
            ></Page>
            <!-- 主表单 -->
            <Modal
                v-model="tableMixin_isShowForm"
                :footer-hide="true"
                class-name="vertical-center-modal"
                width="750"
                :title="tableMixin__cFormTitle"
            >
                <tableForm
                v-if="tableMixin_isShowForm"
                :form-minxin-id="tableMixin__formId"
                :form-mixin-status="tableMixin__formStatus"
                :form-mixin-title="tableMixin__formTitle"
                @on-form-mixin-cancel="tableMixin_isShowForm=false"
                @on-form-mixin-confirm="tableMixin_isShowForm=false"
                @on-form-mixin-table-fefresh="tableMixin_getTableData"
                ></tableForm>
            </Modal>
            <Modal
                v-model="infoModal"
                :footer-hide="true"
                width="750"
                :styles="{top: '20px'}"
                @on-visible-change="infoVisibleChange">
                <div class="info-item">
                    <h3>自定义渠道</h3>
                    <p style="text-align:center;">为了打通开发者系统后台,精准的统计每个渠道的数据,本系统支持将APP的启动数据上报给开发者</p>
                    <div class="info-item-scroll">
                    <h4><div class="num">1</div>APP下载页面渠道参数和自定义参数说明</h4>
                    <Table :columns="table1.columns" :data="table1.data"></Table>
                    <h4><div class="num">2</div>开发者可在开发者后台APP渠道管理页面新建渠道，如图所示：</h4>
                    <div class="img-wrap">
                        <img src="/image/help1.png" alt="">
                    </div>
                    <h4 class="mb0"><div class="num">3</div>如果开发者配置渠道后，渠道推广地址如下：</h4>
                    <div class="href"><div class="w19"></div>https://app{{domain.domain}}/?cn_id=2awzj55t4bq6</div>
                    <h4 class="mb0"><div class="w19"></div>如果开发者需要自定义参数，落地页如下：</h4>
                    <div class="href mb20"><div class="w19"></div>https://app{{domain.domain}}/?cn_id=2awzj55t4bq6&ud_id1=u1&ud_id2=u2</div>
                    <div class="img-wrap">
                        <img src="/image/help3.png" alt="">
                    </div>
                    <h4><div class="num">4</div>用户可以在开发者后台APP设置界面配置启动上报地址，如图所示：</h4>
                    <div class="img-wrap">
                        <img src="/image/help2.png" alt="">
                    </div>
                    <h4><div class="num">5</div>如果开发者已配置启动上报地址，当用户下载APP后，应用每次启动都会上传以下信息到开发者提供的接口，具体参数如下所示：</h4>
                    <Table :columns="table2.columns" :data="table2.data"></Table>
                    <h4><div class="num">6</div>其他参数说明</h4>
                    <div class="href"><div class="w19"></div>method: POST</div>
                    <div class="href"><div class="w19"></div>Content-Type:application/x-www-form-urlencoded</div>
                    <div class="href"><div class="w19"></div>str={</div>
                    <div class="href"><div class="w35"></div>"name": "xxx",</div>
                    <div class="href"><div class="w35"></div>"bid": "xxx",</div>
                    <div class="href"><div class="w35"></div>"version": "xxx",</div>
                    <div class="href"><div class="w35"></div>"udid": "xxx",</div>
                    <div class="href"><div class="w35"></div>"cn_id": "xxx",</div>
                    <div class="href"><div class="w35"></div>"ud_id1": "xxx",</div>
                    <div class="href"><div class="w35"></div>"ud_id2": "xxx"</div>
                    <div class="href"><div class="w19"></div>}</div>
                    </div>
                </div>
            </Modal>
        </Content>
    </Layout>
</template>

<script>
import { Icon, Button, Switch } from '_c';
import { Dialog } from '_c/dialog'
import {
    Table,
    Layout,
    Content,
    DatePicker,
    Modal,
    Page
} from 'iview';
import tableForm from './tableForm';
import tableMixin from '@/mixins/TableAndForm/tableMixin';
import { formatTime, toRegularNum } from "@/mixins/globalMixin";
import { getMessage } from '@/api/global';
import fetch from '@/common/fetch'
import moment from 'moment';
import { mapState} from "vuex";

const table1 = {
  columns: [
    {
      title: '参数',
      key: 'param1'
    },
    {
      title: '是否必须',
      key: 'param2'
    },
    {
      title: '含义',
      key: 'param3'
    },
    {
      title: '说明',
      width: 350,
      key: 'param4'
    }
  ],
  data: [
    {param1: 'cn_id', param2: '否', param3: '渠道id', param4: '由开发者后台渠道管理生成'},
    {param1: 'ud_id1', param2: '否', param3: '自定义参数1', param4: '用于数据上报传递自定义参数，长度不超过100位，超长会被置空。该值中如果包含特殊号或中文则需进行urlencode编码,否则会影响参数传递'},
    {param1: 'ud_id2', param2: '否', param3: '自定义参数1', param4: '同上'},
  ]
};
const table2 = {
  columns: [
    {
      title: '参数',
      key: 'param1'
    },
    {
      title: '是否必须',
      key: 'param2'
    },
    {
      title: '含义',
      key: 'param3'
    },
    {
      title: '说明',
      width: 300,
      key: 'param4'
    }
  ],
  data: [
    {param1: 'name', param2: '是', param3: 'app名称', param4: '-'},
    {param1: 'bid', param2: '是', param3: 'app bundleid', param4: '-'},
    {param1: 'version', param2: '是', param3: 'app版本', param4: '-'},
    {param1: 'udid', param2: '否', param3: '设备udid', param4: '-'},
    {param1: 'cn_id', param2: '否', param3: '渠道id', param4: '由开发者后台渠道管理生成'},
    {param1: 'ud_id1', param2: '否', param3: '自定义参数1', param4: '用于数据上报传递自定义参数长度不超过100位'},
    {param1: 'ud_id2', param2: '否', param3: '自定义参数2', param4: '用于数据上报传递自定义参数长度不超过100位'},
  ]
};

const columns = [
    {
        title: '渠道名称',
        key: 'name'
    },
    {
        title: '下载地址',
        key: 'url',
        width: 400,
        render: (h, {row}) => h('a', {domProps: {
            innerHTML: row.url,
            href: row.url,
            target: 'blank'
        }})
    },
    {
        title: '创建时间',
        render: (h, {row}) => h('span', {domProps: {innerHTML: formatTime(row.itime*1000)}})
    },
    {
        title: '状态',
        slot: 'status'
    },
    {
        title: '下载数',
        key: 'download_num',
        render: (h, {row}) => h('span', {domProps: {innerHTML: toRegularNum(row.download_num, 0)}})
    },
    {
        title: '启动次数',
        key: 'launch_num',
        render: (h, {row}) => h('span', {domProps: {innerHTML: toRegularNum(row.launch_num, 0)}})
    }
];
const components = {
    Table,
    Layout,
    Content,
    Icon,
    Button,
    DatePicker,
    tableForm,
    Modal,
    'i-switch': Switch,
    Page
};
export default {
    name: 'channels',
    components,
    mixins: [tableMixin],
    data() {
        return {
            columns,
            table1,
            table2,
            infoModal: false,
            tableHeight: 600,
            // 表格的查询条件
            tableMixin_query: {
                date: moment(new Date()).subtract(1,'months').format('YYYY-MM-DD') + ' - ' +moment().format('YYYY-MM-DD')
            },
            // 表格res数据的路径
            tableMixin_resPath: {
                data: 'aaData'
            },
            tableMixin_loadingText: {
                delConfirmText: '确定删除此开发者？删除后该开发者的所有应用也被删除。'
            },
            options1: {
                shortcuts: [
                    {
                        text: "今天",
                        value() {
                            const start = new Date();
                            const end = new Date();
                            return [start, end];
                        },
                        onClick: picker => {
                            this.isMobile && picker.handlePickSuccess();
                        }
                    },
                    {
                        text: "昨天",
                        value() {
                            const start = new Date();
                            const end = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24);
                            end.setTime(end.getTime() - 3600 * 1000 * 24);
                            return [start, end];
                        },
                        onClick: picker => {
                            this.isMobile && picker.handlePickSuccess();
                        }
                    },
                    {
                        text: "最近7天",
                        value() {
                            const start = new Date();
                            const end = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            return [start, end];
                        },
                        onClick: picker => {
                            this.isMobile && picker.handlePickSuccess();
                        }
                    },
                    {
                        text: "最近30天",
                        value() {
                            const start = new Date();
                            const end = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            return [start, end];
                        },
                        onClick: picker => {
                            this.isMobile && picker.handlePickSuccess();
                        }
                    },
                    {
                        text: "本月",
                        value() {
                            const start = new Date();
                            const end = new Date();
                            start.setTime(start.setDate(1));
                            return [start, end];
                        },
                        onClick: picker => {
                            this.isMobile && picker.handlePickSuccess();
                        }
                    },
                    {
                        text: "上月",
                        value() {
                            var start = new Date();
                            const end = new Date();
                            var now = new Date();
                            now.setDate(1);
                            now.setHours(0, 0, 0, 0);
                            var time = now.getTime() - 1;
                            end.setTime(now.setTime(time));
                            start.setTime(now.setDate(1));
                            return [start, end];
                        },
                        onClick: picker => {
                            this.isMobile && picker.handlePickSuccess();
                        }
                    }
                ],
                disabledDate (date) {
                    let start=new Date();
                    let startTime= start.setTime(new Date().setHours(0,0,0,0));
                    return date.getTime() >startTime;
                }
            },
            dateTable: [moment(new Date()).subtract(1,'months').toDate(),moment().toDate()]
        };
    },
    watch: {
        '$route': {
            handler: function(val) {
                this.tableMixin_debounceGetTableData();
            },
            deep: true
        },
        dateTable(val) {
            if (val[0] !== '' && val[1] !== '') {
                this.tableMixin_query.date = moment(val[0]).format('YYYY-MM-DD') + ' - ' + moment(val[1]).format('YYYY-MM-DD');
            }
        }
    },
    computed: {
      ...mapState('basic',['domain']),
    },
    methods: {
        infoVisibleChange(val) {
            this.infoModal = val;
        },
        // 获取表格数据的接口
        tableMixin_api_getTableData(data = {}) {
            console.log('tableMixin_api_getTableData')
            data = {
                app_id: this.$route.query.id,
                date: this.tableMixin_query.date,
                row: this.tableMixin_query.row,
                page: this.tableMixin_query.page
            };
            return getMessage({
                url: '/channel.json',
                data
            })
        },
        // 获取表格数据成功后执行的方法
        tableMixin_getTableData_success(res = {}) {
        },
        // 删除表格数据的接口
        tableMixin_api_delTableItem({ _id }) {
        /*     return fetch({
                method: 'DELETE',
                url: '/staff.json' + `?id=${_id}`
            }) */
        },
        // 日期选择器
        getDownTime(e) {

        },
        async handleBeforeStatusChange({value,row}) {
            const self = this
            let msg
            if (value === 1) {
                msg =
                '关闭渠道后，视为您不再与该渠道合作，将不再统计该渠道的UV等数据，但用户仍可通过该渠道地址下载您的应用，确认关闭？'
            }
            // 关闭时需要提示
            if (msg) {
                Dialog({
                type: 'warning',
                text: msg,
                textLeft: true,
                async onConfirm() {
                    try {
                    // 表格忙碌
                    self.tableMixin_isLoading = true
                    // 请求关闭
                    await fetch({
                        method: 'POST',
                        url: '/channel/changeStatus.json',
                        data: {
                            status: 0,
                            id: row._id
                        }
                    })
                    // 表格不忙碌,很重要,否则self.tableMixin_getTableData不执行
                    self.tableMixin_isLoading = false
                    await self.tableMixin_getTableData()
                    } catch (error) {
                    console.log(error)
                    } finally {
                    self.tableMixin_isLoading = false
                    }
                },
                onCancel() {}
                })
            } else {
                // 打开时不需要提示
                try {
                // 表格忙碌
                self.tableMixin_isLoading = true
                // 请求打开
                await fetch({
                    method: 'POST',
                    url: '/channel/changeStatus.json',
                    data: {
                        status: 1,
                        id: row._id
                    }
                })
                // 表格不忙碌,很重要
                self.tableMixin_isLoading = false
                await self.tableMixin_getTableData()
                } catch (error) {
                console.log(error)
                } finally {
                self.tableMixin_isLoading = false
                }
            }
            // 这里永远返回false
            return false
        }
    }
}
</script>

<style lang="less" scoped>
    .layout {
        background: none;
    }
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 0 20px 0;
        margin: 0 1px;
    }
    .ml10 {
        margin-left: 10px;
    }
.info-item {
  h3 {
    text-align: center;
    font-size: 16px;
    margin: 10px;
  }
  li {
    p {
      text-indent: 2em;
    }
  }
  p {
    color: #7b7f83;
    line-height: 30px;
  }
}
.info-item-scroll {
  max-height: 700px;
  overflow: auto;
  margin-bottom: 20px;
  h4 {
    color: #7B7F83;
    font-weight: bold;
    font-size: 14px;
    margin-top: 20px;
    margin-bottom: 20px;
    .num {
      display:inline-block;
      width: 14px;
      height: 14px;
      color: #fff;
      font-size: 12px;
      background: #067AFE;
      border-radius: 50%;
      text-align: center;
      line-height: 14px;
      margin-right: 5px;
    }
  }
  .href {
    color: #067AFE;
  }
  .w19 {
    width: 19px;
    display: inline-block;
  }
  .mb0 {
    margin-bottom: 0;
  }
  .mb20 {
    margin-bottom: 20px;
  }
  .w35 {
    width: 35px;
    display: inline-block;
  }
}
.img-wrap {
  text-align: center;
}
</style>
