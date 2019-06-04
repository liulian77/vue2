<template>
    <div>
        <Form
                :model="formMixin_form"
                ref="formMixin_refForm"
                :rules="cRules"
                :label-width="100"
                @submit.native.prevent>
            <!--渠道名称 -->
            <FormItem label="推送标题" prop="title">
                <Input
                    v-model="formMixin_form.title"
                    :maxlength="30"
                    :disabled="['details'].indexOf(formMixinStatus) !== -1"
                />
            </FormItem>
            <FormItem label="推送副标题" prop="sub_title">
                <Input
                    v-model="formMixin_form.sub_title"
                    :maxlength="30"
                    :disabled="['details'].indexOf(formMixinStatus) !== -1"
                />
            </FormItem>
            <FormItem label="推送内容" prop="content">
                <Input
                    v-model="formMixin_form.content"
                    :maxlength="50"
                    type="textarea"
                    :disabled="['details'].indexOf(formMixinStatus) !== -1"
                />
            </FormItem>
            <FormItem label="推送人群" prop="push_group" v-if="false">
                <RadioGroup v-model="formMixin_form.push_group">
                    <Radio label="1">全部用户</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="推送时间" prop="push_time" v-if="false">
                <RadioGroup v-model="formMixin_form.push_time">
                    <Radio :label="0">立即推送</Radio>
                </RadioGroup>
            </FormItem>
            <!-- 操作 -->
            <FormItem v-if="['add'].indexOf(formMixinStatus) !== -1">
                <sn-button
                type="primary"
                style="margin-right: 8px;"
                @click.native="formMixin_handleSubmitBtnClick"
                >确定推送</sn-button>
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
import { Form, FormItem, Input, InputNumber, Spin, RadioGroup , Radio  } from 'iview'
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
        RadioGroup , 
        Radio,
        'sn-button': Button
    },
    data() {
        return {
            formMixin_form: {
                _id: '',
                // 渠道名称
                title: '',
                sub_title: '',
                content: '',
                push_group: '1',
                push_time: 0
            }
        }
    },
    computed: {
        cRules() {
            return {
                title: [
                    {
                        max:15,
                        message: '0-15个字符，中英文数字特殊字符'
                    },
                    {
                        validator: this.checkForm
                    }
                ],
                sub_title: [
                    {
                        max:15,
                        message: '0-15个字符，中英文数字特殊字符'
                    },
                    {
                        validator: this.checkForm
                    }
                ],
                content: [
                    {
                        max:50,
                        message: '0-50个字符，中英文数字特殊字符'
                    },
                    {
                        validator: this.checkForm
                    }
                ],
            };
        }
    },
    methods: {
        formMixin_api_getItem(data) {
            return getMessage({
                url: '/push.json',
                data
            })
        },
        formMixin_api_add({title, sub_title, content, push_time}) {
            let data = {
                title,
                sub_title,
                content,
                push_time,
                appid: this.$route.query.id
            };
            return fetch({
                method: 'POST',
                url: `/push.json`,
                data
            });
        },
        checkForm(rule, value, callback) {
            if (this.formMixin_form.sub_title === '' && this.formMixin_form.title === '' && this.formMixin_form.content === '') {
                callback(new Error('推送标题， 推送副标题和推送内容不能同时为空'));
            } else {
                callback();
            }
    }
    }
}
</script>

<style lang="less" scoped>

</style>
