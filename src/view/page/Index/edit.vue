<template>
    <div class="component-container">
        <Loading :visible="loading" class="loading"></Loading>
        <div class="top-box">
            <p><sn-icon type="ad-plan" color="#2198F0" size="24" class="open-icon"/></p>
            <p class="t-box-title">创建DSP平台信息</p>
            <p class="t-box-sub">创建DSP平台账号、基本信息</p>
        </div>
        <sn-form ref="formValidate"
              :model="formValidate"
              :rules="ruleValidate"
              :label-width="140"
              @submit.native.prevent
              v-show="!loading"
        >
            <sn-form-item label="dsp平台用户名"
                      prop="username" key="username">
                <sn-input size="large"
                       v-model="formValidate.username"
                       placeholder="请输入平台用户名"
                       class="w360"
                       :disabled="type!=='add'"
                 />
            </sn-form-item>
            <sn-form-item label="dsp平台用户密码" key="password" prop="password" v-if="type==='add'">
                <sn-input size="large"
                       type="password"
                       v-model="formValidate.password"
                       class="w360"
                       placeholder="请输入密码" 
                       :disabled="type === 'check'"
                       />
            </sn-form-item>
            <sn-form-item label="佣金比例(备注)" key="brokerage_ratio">
                <sn-input size="large"
                       v-model="formValidate.brokerage_ratio"
                       class="w360"
                       :disabled="type === 'check'"
                       placeholder="请输入1-100的数字" />
            </sn-form-item>
            <sn-form-item label="手机号" key="mobile">
                <sn-input size="large"
                       v-model="formValidate.mobile"
                       class="w360"
                       :disabled="type === 'check'"
                       placeholder="11位手机号码" />
            </sn-form-item>
            <sn-form-item label="QQ号"
                     key="qq">
                <sn-input size="large"
                       v-model="formValidate.qq"
                       class="w360"
                       :disabled="type === 'check'"
                       placeholder="QQ号码" />
            </sn-form-item>
            <sn-form-item label="邮箱" key="email">
                <sn-input size="large"
                       v-model="formValidate.email"
                       class="w360"
                       :disabled="type === 'check'"
                       placeholder="电子邮箱地址" />
            </sn-form-item>
            <sn-form-item label="描述"  key="memo">
                <sn-textarea  max="100" v-model="formValidate.memo" placeholder="最多填写100字" :disabled="type === 'check'" class="w360"/>
            </sn-form-item>
            <sn-form-item class="submit-box mb0" v-if="type !== 'check'">
                <sn-button @click.native="handleReset('formValidate')">取消</sn-button>
                <sn-button type="primary" class="primary"
                        @click.native="handleSubmit('formValidate')" :disabled="disabled">确定</sn-button>
            </sn-form-item>
        </sn-form>
    </div>
</template>
<script>
import {FormItem,Form,Button,Textarea,Input,Checkbox,CheckboxGroup,Icon} from "_c"
import { deepCopy } from '@/utils/assist'
import { editComponments } from '@/mixins'
const components={
    'sn-textarea':Textarea,
    'sn-form':Form,
    'sn-form-item':FormItem,
    'sn-input':Input,
    'sn-button':Button,
    'sn-checkbox':Checkbox,
    'sn-checkbox-group':CheckboxGroup,
    'sn-icon':Icon,
};
const formValidate={
    username:'',
    password:'',
    brokerage_ratio:'',
    mobile:'',
    qq:'',
    email:'',
    memo: ""
};
export default {
    name:'EditAgent',
    mixins: [editComponments],
    components,
    data() {
        return {
            formValidate: deepCopy(formValidate), //表单提交的部分，详情见iview的form主件
            ruleValidate: {
                username: [
                    {
                        required: true,
                        message: "请填写信息！",
                        trigger: "blur"
                    }
                ],
                password:[
                    {
                        required: true,
                        pattern: /^[0-9A-Za-z]{6,12}$/,
                        min: 6,
                        max: 12,
                        message: '请填写6-12位字母或数字',
                        trigger: 'blur'
                    }
                ],
                brokerage_ratio:[
                    {
                        pattern: /^\d{1,2}(\.\d{1,2})?$/,
                        required: true,
                        message: '0-99.99，最多两位小数！',
                        trigger: 'blur'
                    }
                ],
            },   //表单验证的部分，详情见iview的form主件
            addUrl:'/user/agentAdd.json', //新建的接口地址
            getUrl:'/user/info.json',   //获取详情的接口地址
            updateUrl:'/user/agentUp.json', //修改的接口地址
            delObj:['username','password'] //修改时，相比新建不需要的参数
        };
    },
    methods:{
        //提交数据的处理
        handleData(res){
            let {data}=res;
            let formValidate=deepCopy(this.formValidate);
            Object.keys(formValidate).map(item=>{
                formValidate[item]=data[item];
            });
            this.formValidate=formValidate;
            setTimeout(()=>{this.loading=false},500);
        },
        //主件清空不了的部分的额外处理
        reset(){
            this.formValidate=deepCopy(formValidate);
        }
    },
};
</script>
<style lang="less" scoped>
.component-container{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
}
.loading{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.ivu-form {
    width: 540px;
    padding-top: 20px;
    padding-left: 30px;
    box-sizing: border-box;
    margin: 0 0 0 73px;
}
/deep/ .ivu-form-item-error-tip{
    right: -20px;
    left: auto;
    transform: translate(100%,-50%);
    top: 50%;
    padding-top: 0;
}
.RadioGroup{
    height: 32px;
}
.submit-box{
    position: relative;
    margin-top: 125px;
    height: 80px;
    border-top: 1px solid #dfe2e6;
    display: flex;
    align-items: center;
    margin-left: -30px;
    box-sizing: border-box;
    padding-left: 30px;
}
.mb0{
    margin-bottom: 0;
}
.primary{
    margin-left: 40px;
}




/*头部部分*/
.top-box{
    height: 140px;
    background-color: #F9FAFB;
    border-bottom: 1px solid #dfe2e6;
    padding-top: 30px;
    box-sizing: border-box;
    p{
        width: 100%;
        text-align: center;
        line-height: 1;
    }
    .t-box-title{
        font-size:14px;
        font-weight:400;
        color:rgba(33,152,240,1);
        margin-top: 17px;
    }
    .t-box-sub{
        font-size:14px;
        font-weight:400;
        color:rgba(197,204,212,1);
        margin-top: 10px;
    }
}
/*头部部分*/

.w360{
    width: 360px;
}

</style>
