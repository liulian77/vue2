<template>
    <Layout class="layout">
        <Content>
            <div class="header">
                <div class="header_left">
                    总记录数：{{toRegularNum(tableMixin_total,0)}}
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
                <template slot-scope="{row}" slot="expands">
                    <TableExpand :row="row"></TableExpand>
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
import TableExpand from './table-expand';
import tableMixin from '@/mixins/TableAndForm/tableMixin';
import { formatTime, toRegularNum } from "@/mixins/globalMixin";
import { getMessage } from '@/api/global';
import fetch from '@/common/fetch'
import moment from 'moment';

const columns = [
    {
        type: 'expand',
        width:60,
        render: (h, {row}) => h(TableExpand, {props: {
            row: row
        }})
    },
    {
        title: 'UDID',
        key: 'udid'
    },
    {
        title: '设备型号',
        key: 'phone_product'
    },
    {
        title: 'IP',
        key: 'ip'
    },
    {
        title: '地区',
        key: 'area'
    },
    {
        title: '启动时间',
        key: 'download_num',
        render: (h, {row}) => h('span', {domProps: {innerHTML: formatTime(row.time*1000)}})
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
    TableExpand,
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
            infoModal: false,
            tableHeight: 600,
            // 表格的查询条件
            tableMixin_query: {
                date: moment().format('YYYY-MM-DD') + ' - ' +moment().format('YYYY-MM-DD'),
                sort_field: 'time',
                sort_dir: 'desc'
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
            dateTable: [moment().toDate(),moment().toDate()]
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
    methods: {
        toRegularNum,
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
                sort_field: this.tableMixin_query.sort_field,
                sort_dir: this.tableMixin_query.sort_dir,
                page: this.tableMixin_query.page
            };
            return getMessage({
                url: '/launch.json',
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
    /deep/ .ivu-table-expanded-cell {
        padding: 10px 80px;
    }
</style>
