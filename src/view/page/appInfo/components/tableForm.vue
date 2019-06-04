<template>
    <div>
        <Form
                :model="formMixin_form"
                ref="formMixin_refForm"
                :rules="cRules"
                :label-width="100"
                @submit.native.prevent>
            <!--渠道名称 -->
            <FormItem label="渠道名称" prop="name">
                <Input
                    v-model="formMixin_form.name"
                    :maxlength="30"
                />
            </FormItem>
            <!-- 渠道地址 -->
            <FormItem label="渠道地址" prop="username" v-if="false">
                <span>123.app12.com/1234567</span>
            </FormItem>
            <!-- 操作 -->
            <FormItem>
                <sn-button
                type="primary"
                style="margin-right: 8px;"
                @click.native="formMixin_handleSubmitBtnClick"
                >创建渠道</sn-button>
                <sn-button type="default" @click.native="formMixin_handleCancelBtnClick">取消</sn-button>
            </FormItem>
        </Form>
        <Spin size="large" fix v-if="formMixin_isLoading"></Spin>
    </div>
</template>

<script>
import fp from 'lodash/fp';
import { mapState } from 'vuex';
import { Button } from '_c'
import { Form, FormItem, Input, InputNumber, Spin } from 'iview'
import { getMessage, postMessage } from '@/api/global'
import fetch from '@/common/fetch'
import formMixin from '@/mixins/TableAndForm/formMixin'

export default {
    mixins: [formMixin],
    components: {
        Form,
        FormItem,
        Input,
        InputNumber,
        Spin,
        'sn-button': Button
    },
    data() {
        return {
            formMixin_form: {
                _id: '',
                // 渠道名称
                username: ''
            }
        }
    },
    computed: {
        cRules() {
            return {
                name: [
                    {
                        required: ['add'].indexOf(this.formMixinStatus) !== -1,
                        message: '必填'
                    },
                    {
                        pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,30}$/,
                        message: '1-30个字符，中英文数字'
                    }
                ],
            };
        }
    },
    methods: {
        formMixin_api_add({name}) {
            let data = {
                name,
                app_id: this.$route.query.id
            };
            return fetch({
                method: 'POST',
                url: `/channel.json`,
                data
            });
        }
    }
}
</script>

<style lang="less" scoped>

</style>
