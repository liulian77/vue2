<template>
    <div class="component-container">
        <Loading :visible="loading" class="loading"></Loading>
        <Form ref="formValidate"
              :model="formValidate"
              :rules="ruleValidate"
              :label-width="120"
              @submit.native.prevent
              v-show="!loading"
        >
            <FormItem label="媒体类型"
                      prop="gender">
                <RadioGroup v-model="tableName" class="Group" @change="genderChange">
                    <Radio :label="val" v-for="(label,val) in mediaType" :disabled="!!id">{{label}}</Radio>
                </RadioGroup>
            </FormItem>



            <template v-if="tableName=='ResourceSoft'" >

                <FormItem key="soft1" label="软件名称"
                          prop="title">
                    <Input size="large"
                           v-model="formValidate.title"
                           placeholder="请提供与应用市场中一致的应用名称">
                    </Input>
                </FormItem>
                <FormItem key="soft2" label="描述">
                    <Textarea  max="300" :height="150" v-model="formValidate.description"
                               placeholder="最多300个字符"/>
                </FormItem>
                <FormItem key="soft3" label="软件类型"
                          prop="type">
                    <Select v-model="formValidate.type"
                            :width="360"
                            :border="true"
                            placeholder="选择软件类型"
                    >
                        <Option :value='item._id'  v-for="item in typeData" :label="item.title"></Option>
                    </Select>
                </FormItem>

                <template v-if="userinfo.distributor">
                    <FormItem key="soft4" label="下载地址"
                              prop="download_url">
                        <Input size="large"
                               v-model="formValidate.download_url"
                               placeholder="为了您的APP尽快通过审核，请提供正确的下载地址">
                        </Input>
                    </FormItem>
                    <FormItem key="soft5" label="软件使用人数"
                              prop="use_num">
                        <Select v-model="formValidate.use_num"
                                :width="360"
                                :border="true"
                                placeholder="选择软件使用人数"
                        >
                            <Option :value="val" v-for="(label,val) in visitnum" :label="label"></Option>
                        </Select>
                    </FormItem>
                    <FormItem key="soft6" label="软件下载人数"
                              prop="download_num">
                        <Select v-model="formValidate.download_num"
                                :width="360"
                                :border="true"
                                placeholder="选择软件下载人数"
                        >
                            <Option :value="val" v-for="(label,val) in visitnum" :label="label"></Option>
                        </Select>
                    </FormItem>
                    <FormItem key="soft7" label="排除广告类别"
                              prop="ex_ad_ctg">
                        <LevelCheckbox
                                ref="LevelCheckbox"
                                :width="360"
                                placeholder="无排除"
                                v-model="formValidate.ex_ad_ctg"
                                defaultValue="value"
                                :defaultProps="{label:'name',children: 'children'}"
                        >
                            <LevelCheckboxItem
                                    :items="exclude"
                                    :button="true"
                                    v-model="data1"
                                    @change="change"
                                    :defaultProps="{label:'name',children: 'children'}"
                                    :triangle="true"
                                    defaultValue="value"
                                    key="exclude"
                            ></LevelCheckboxItem>
                            <LevelCheckboxItem
                                    :items="excludeChildren"
                                    v-model="data2"
                                    :styles="{'transform':'translate(100%,100%)','margin-left':'10px'}"
                                    :triangle="false"
                                    :defaultProps="{label:'name',children: 'children'}"
                                    defaultValue="value"
                                    key="excludeChildren"
                            ></LevelCheckboxItem>
                        </LevelCheckbox>
                    </FormItem>
                </template>
            </template>


            <template v-if="tableName=='ResourceSite'"  >
                <FormItem key="websit1" label="网站域名"
                          prop="domain"
                          class="domainName"
                >
                    <Input size="large"
                           v-model="formValidate.domain"
                           placeholder="如：sndo.com">
                        <span slot="prepend">www.</span>
                        <VerifyWebsite :visible="show" @complete="complete" slot="suffix" @change="webTypeChange" @download="download">
                            <span class="validate-btn" @click="handleValidate">验证网站</span>
                        </VerifyWebsite>

                    </Input>
                </FormItem>
                <FormItem key="websit2" label="网站名称"
                          prop="title">
                    <Input size="large"
                           v-model="formValidate.title"
                           placeholder="网站名称"></Input>
                </FormItem>
                <FormItem key="websit3" label="网站备案信息"
                          prop="filing">
                    <Input size="large"
                           v-model="formValidate.filing"
                           placeholder="如：京ICP证000001号"></Input>
                </FormItem>
                <FormItem key="websit4" label="网站类别"
                          prop="type">
                    <Select v-model="formValidate.type"
                            :width="360"
                            :border="true"
                            :level="true"
                            placeholder="选择类别"
                    >
                        <template v-for="item in typeData" :value="item">
                            <Option :value='item.pid' type="title" :disabled="true">{{item.title}}</Option>
                            <Option :value="val._id" v-for="val in item.sub">{{val.title}}</Option>
                        </template>
                    </Select>
                </FormItem>
                <FormItem key="websit5" size="large"
                          label="网站访问量"
                          prop="visitnum">
                    <Select v-model="formValidate.visitnum"
                            :width="360"
                            :border="true"
                            placeholder="选择类别"
                    >
                        <Option :value="val" v-for="(label,val) in visitnum"   :key="val">{{label}}</Option>
                    </Select>
                </FormItem>
                <FormItem key="websit6" size="large"
                          label="排除广告类别">
                    <LevelCheckbox
                            :width="360"
                            ref="LevelCheckbox"
                            placeholder="无排除"
                            v-model="formValidate.ex_ad_ctg"
                            defaultValue="value"
                            :defaultProps="{label:'name',children: 'children'}"
                    >
                        <LevelCheckboxItem
                                :items="exclude"
                                :button="true"
                                v-model="data1"
                                @change="change"
                                :defaultProps="{label:'name',children: 'children'}"
                                :triangle="true"
                                defaultValue="value"
                        ></LevelCheckboxItem>
                        <LevelCheckboxItem
                                :items="excludeChildren"
                                v-model="data2"
                                :styles="{'transform':'translate(100%,100%)','margin-left':'10px'}"
                                :triangle="false"
                                :defaultProps="{label:'name',children: 'children'}"
                                defaultValue="value"
                        ></LevelCheckboxItem>
                    </LevelCheckbox>
                </FormItem>
                <FormItem key="websit7" label="描述">
                    <Textarea  max="300" :height="150" v-model="formValidate.description" placeholder="该描述对提高广告匹配和转化很重要请认真填写，最多填写300字。"/>
                </FormItem>
            </template>


            <template v-if="tableName=='ResourceApp'">
                <FormItem key="app1" label="应用名称"
                          prop="title">
                    <Input size="large"
                           v-model="formValidate.title"
                           placeholder="请提供与应用市场中一致的应用名称">
                    </Input>
                </FormItem>
                <FormItem key="app2" label="描述">
                <Textarea  max="300" :height="150" v-model="formValidate.description"
                           placeholder="最多300个字符"/>
                </FormItem>
                <FormItem key="app3"  label="应用类型"
                          prop="type">
                    <Select v-model="formValidate.type"
                            :width="360"
                            :border="true"
                            :level="true"
                            placeholder="选择应用类型"
                    >
                        <template v-for="item in typeData" :value="item">
                            <Option :value='item.pid' type="title" :disabled="true">{{item.title}}</Option>
                            <Option :value="val._id" v-for="val in item.sub">{{val.title}}</Option>
                        </template>
                    </Select>
                </FormItem>

                <template v-if="userinfo.distributor">
                    <FormItem key="app4" label="关键词"
                              prop="keyword">
                        <Input size="large"
                               v-model="keywordText"
                               placeholder="正确的填写关键词能够提升广告的匹配度，关键词之间用逗号隔开"></Input>
                    </FormItem>
                    <FormItem key="app5" label="平台"
                              prop="platform">
                        <RadioGroup v-model="formValidate.platform" class="Group">
                            <Radio :label="val" v-for="(label,val) in platforms">{{label}}</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem key="app6" label="使用终端"
                              prop="terminal">
                        <Select v-model="formValidate.terminal"
                                :width="360"
                                :border="true"
                        >
                            <Option :value="val"   v-for="(label,val) in terminal" :label="label"></Option>
                        </Select>
                    </FormItem>
                    <FormItem key="app7" label="下载地址"
                              prop="download_url">
                        <Input size="large"
                               v-model="formValidate.download_url"
                               placeholder="为了您的APP尽快通过审核，请提供正确的下载地址">
                        </Input>
                    </FormItem>
                    <FormItem key="app8" label="程序主包名"
                              prop="packge_name">
                        <Input size="large"
                               v-model="formValidate.packge_name"
                               placeholder="同info.plist中的bundle identifier一致">
                        </Input>
                    </FormItem>
                    <FormItem key="app9" label="当前版本号"
                              prop="version">
                        <Input size="large"
                               v-model="formValidate.version"
                               placeholder="同info.plist中的bundle version一致">
                        </Input>
                    </FormItem>
                    <FormItem key="app10" label="排除广告类别">
                        <LevelCheckbox
                                ref="LevelCheckbox"
                                :width="360"
                                placeholder="无排除"
                                v-model="formValidate.ex_ad_ctg"
                                defaultValue="value"
                                :defaultProps="{label:'name',children: 'children'}"
                        >
                            <LevelCheckboxItem
                                    :items="exclude"
                                    :button="true"
                                    v-model="data1"
                                    @change="change"
                                    :defaultProps="{label:'name',children: 'children'}"
                                    :triangle="true"
                                    defaultValue="value"
                            ></LevelCheckboxItem>
                            <LevelCheckboxItem
                                    :items="excludeChildren"
                                    v-model="data2"
                                    :styles="{'transform':'translate(100%,100%)','margin-left':'10px'}"
                                    :triangle="false"
                                    :defaultProps="{label:'name',children: 'children'}"
                                    defaultValue="value"
                            ></LevelCheckboxItem>
                        </LevelCheckbox>
                    </FormItem>
                </template>
            </template>

            <FormItem class="submit-box">
                <Button @click.native="handleReset('formValidate')">取消</Button>
                <Button type="primary" class="primary"
                        @click.native="handleSubmit('formValidate','formValidate')">确定</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import {FormItem,Form,Radio,RadioGroup,Button,Textarea,Input,Select,Option,LevelCheckbox,LevelCheckboxItem,VerifyWebsite} from "_c"
import { Dialog } from '_c/dialog'
import { mapState } from 'vuex'
import { editComponments } from '@/mixins'
import { api_resource } from '@/api'
import {debounce} from 'lodash'
import {deepCopy} from "../../../utils/assist";
import Qs from 'qs'
import { baseUrl } from '@/common/config'
const components={
    VerifyWebsite,
    Textarea,
    LevelCheckbox,
    LevelCheckboxItem,
    Form,
    FormItem,
    Option,
    Select,
    Input,
    Radio,
    Button,
    RadioGroup
};
const requiredRule=[
    {
        required: true,
        message: "请填写信息！",
        trigger: "blur"
    }
];
const websitReq={
    site:'',
    id:'',
    method:'',
    domain:''
};



export default {
    components,
    name:'EditResource',
    mixins: [editComponments],
    data() {
        let self=this;
        return {
            show:false,
            domainValidate:false,
            exclude:[],
            excludeChildren:[],
            excludeChildrenOrigin:[],
            formValidate: {
                "domain":"",
                "agent_id":"",
                "agent_username":"",
                "title":"",
                "filing":"",
                "type":"",
                "visitnum":0,
                "ex_ad_type":0,
                "ex_ad_ctg":[],
                "description":"",
                "download_url":"",
                "use_num":"",
                "download_num":"",
                "keyword":[],
                "terminal":3,
                "packge_name":'',
                "version":'',
                "platform":1,
            },
            ruleValidate: {
                domain:[
                    {
                        required: true,
                        message: "请输入域名",
                        trigger: "change"
                    },
                    {
                        message: "请输入正确的域名,如:sndo.com",
                        trigger: "change",
                        pattern: /^([a-z0-9]+([a-z0-9-]*(?:[a-z0-9]+))?\.)?[a-z0-9]+([a-z0-9-]*(?:[a-z0-9]+))?(\.us|\.tv|\.org\.cn|\.org|\.net\.cn|\.net|\.mobi|\.me|\.la|\.info|\.hk|\.top|\.gov\.cn|\.edu|\.com\.cn|\.com|\.co\.jp|\.co|\.cn|\.cc|\.biz)$/i
                    },
                    debounce((rule,value,callback) => {
                        if(!self.domainValidate) {
                            callback(['请验证域名']);
                        }else {
                            callback();
                        }
                    },300)
                ],
                title:requiredRule,
                filing:requiredRule,
                type: [{
                    required: true,
                    message: "请选择网站类别",
                    trigger: "change"
                }],
                visitnum: [{
                    required: true,
                    message: "请选择网站访问量",
                    trigger: "change",
                    pattern: /^[A-Za-z0-9]+$/
                }],
                use_num: [{
                    required: true,
                    message: "请选择网站访问量",
                    trigger: "change",
                    pattern: /^[A-Za-z0-9]+$/
                }],
                download_num: [{
                    required: true,
                    message: "请选择网站访问量",
                    trigger: "change",
                    pattern: /^[A-Za-z0-9]+$/
                }],
                terminal: [{
                    required: true,
                    message: "请选择使用终端",
                    trigger: "change",
                    pattern: /^[A-Za-z0-9]+$/
                }],
                platform: [{
                    required: true,
                    message: "请选择平台",
                    trigger: "change",
                    pattern: /^[A-Za-z0-9]+$/
                }],
                description: [
                    {
                        required: true,
                        message: "请写描述",
                        trigger: "blur"
                    },
                    {
                        type: "string",
                        max: 300,
                        message: "描述最多300字",
                        trigger: "blur"
                    }
                ],
                keyword:[debounce((rule,value,callback) => {
                    if(self.formValidate.keyword.length===0) {
                        callback(['请输入关键词']);
                    }else {
                        callback();
                    }
                },300)],
                download_url:requiredRule,
                packge_name:requiredRule,
                version:requiredRule,
            },
            data1:'',
            data2:'',
            tableName:this.editReq.tableName,
            typeData:[],
            websitReq,
            submitJson:{},
            keywordText:'',
            submitType:1
        };
    },
    methods: {
        genderChange(val){
            this.tableName=val;
            this.init(val);
            this.handleReset('formValidate');
        },
        change(val){
            if(val){
                this.excludeChildren=val.item.children;
            }else {
                this.excludeChildren=deepCopy(this.excludeChildrenOrigin);
            }
        },
        webTypeChange(method){
            this.$set(this.websitReq,'method',method);
        },
        reset(){
            this.keywordText='';
            this.$set(this.formValidate,'description','');
            if(this.$refs.LevelCheckbox){
                this.$refs.LevelCheckbox.clear();
            }
        },
        init(type){
            this.tableName=type;
            this.getTypeList();
        },
        handleValidate(){
            this.$refs['formValidate'].validateField('domain',valid => {
                if(valid==='请验证域名'){
                    this.getWebId();
                }else {
                    Dialog({ type: 'error', text: '请输入正确的域名' })
                }
            });
        },
        formValidateChange(){
            let formValidate=deepCopy(this.formValidate);
            this.req.tableName=this.tableName;
            switch (this.tableName) {
                case  'ResourceSite':
                    this.submitJson={
                        "domain":formValidate.domain,
                        "agent_id":this.userinfo._id,
                        "agent_username":this.userinfo.username,
                        "title":formValidate.title,
                        "filing":formValidate.filing,
                        "type":formValidate.type,
                        "visitnum":formValidate.visitnum,
                        "ex_ad_type":formValidate.ex_ad_ctg.length>0?1:0,
                        "ex_ad_ctg":formValidate.ex_ad_ctg,
                        "description":formValidate.description
                    };
                    break;
                case  'ResourceSoft':
                    this.submitJson=this.userinfo.distributor?{
                            "agent_id":this.userinfo._id,
                            "agent_username":this.userinfo.username,
                            "title":formValidate.title,
                            "type":formValidate.type, //类型id
                            "download_url":formValidate.download_url,
                            "use_num":formValidate.use_num, //使用人数
                            "download_num":formValidate.download_num, //下载人数
                            "ex_ad_type":formValidate.ex_ad_ctg.length>0?1:0, //0默认 1自定以排除广告
                            "ex_ad_ctg":formValidate.ex_ad_ctg, //自定义排除广告才有 "cate1_4", "cate2_25"
                            "description":formValidate.description
                        }:{
                        "agent_id":this.userinfo._id,
                        "agent_username":this.userinfo.username,
                        "title":formValidate.title,
                        "type":formValidate.type, //类型id
                        "description":formValidate.description
                    };
                    break;
                case  'ResourceApp':
                    this.submitJson=this.userinfo.distributor?{
                        "agent_id":this.userinfo._id,
                        "agent_username":this.userinfo.username,
                        "title":formValidate.title,
                        "type":formValidate.type,
                        "keyword":formValidate.keyword,
                        "platform":formValidate.platform,
                        "terminal":formValidate.terminal,
                        "download_url":formValidate.download_url,
                        "packge_name":formValidate.packge_name,
                        "version":formValidate.version,
                        "ex_ad_type":formValidate.ex_ad_ctg.length>0?1:0,
                        "ex_ad_ctg":formValidate.ex_ad_ctg,
                        "description":formValidate.description
                    }:{
                        "agent_id":this.userinfo._id,
                        "agent_username":this.userinfo.username,
                        "title":formValidate.title,
                        "type":formValidate.type,
                        "description":formValidate.description
                    };
                    break;
            }
        },
        handleData(res){
            try {
                Object.keys(this.formValidate).forEach(item=>{
                    if(res[item]){
                        this.$set(this.formValidate,item,res[item]);
                        (item==='keyword')&&(this.keywordText=res.keyword.join(','));
                    }
                });
            }catch (e) {
                console.log(e);
            }

            setTimeout(()=>{
                this.loading=false;
                if(this.$refs.LevelCheckbox){
                    this.$refs.LevelCheckbox.bindData();
                }
            },500);
        },
        async complete(){
            try{
                await api_resource.VerifyWebsite({type:'checkdomain',code:this.websitReq.id,method:this.websitReq.method,domain:this.formValidate.domain});
                this.domainValidate=true;
            }catch (e) {
                this.domainValidate=true;
                console.log(e);
            }
        },
        async download(){
            let url=baseUrl+`resource/domain.json?${Qs.stringify({type:'download',code:this.websitReq.id,method: '1',domain:this.formValidate.domain})}`;
            window.open(url);
        },
        async getTypeList(){
            let type;
            switch (this.tableName) {
               case  'ResourceSite':
                    type='site';
                    break;
               case  'ResourceApp':
                   type='app';
                    break;
               case  'ResourceSoft':
                   type='soft';
                    break;
            }
            try{
                let {resource_menu}=await api_resource.getTypeList({tableName:'resource_menu',type});
                this.typeData=resource_menu.sub;
            }catch (e) {

            }
        },
        async getWebId(){
            let res=await api_resource.VerifyWebsite({type:'getcode'});
            this.$set(this.websitReq,'id',res.id);
            this.$set(this.websitReq,'method','1');
            this.show=true;
        },
        async getExclude(){
            let {cate}=await  api_resource.getExclude();
            let arr=[];
            Object.keys(cate).forEach(item=>{
                this.exclude.push(cate[item]);
                arr=[...cate[item].children,...arr];
            });
            this.excludeChildren=arr;
            this.excludeChildrenOrigin=deepCopy(arr);
        },
        getDataChange(){
            return this.editReq.tableName
        }
    },
    computed: {
        ...mapState('basic', [
            'userinfo',
        ]),
        ...mapState('app/resource', [
            'mediaType','visitnum','platforms','terminal'
        ],),
    },
    created(){
        this.getExclude();
        this.init('ResourceSoft');
    },
    watch:{
        'keywordText'(val){
            if(!val){
                this.formValidate.keyword=[];
            }else {
                this.formValidate.keyword=val.split(',')
            }
        },
        'editReq.tableName'(val){
            this.tableName=val;
        }
    }
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
  width: 475px;
  margin: 0 auto;
}
/deep/ .ivu-input-group-prepend{
    width: 60px;
    background: #2a9ff6;
    color: #fff;
    border: none!important;
}
.web-btn{
  color: #2a9ff6;
}
.Group{
    height: 32px;
}
/deep/ .ivu-form-item-error-tip{
    right: -20px;
    left: auto;
    transform: translate(100%,-50%);
    top: 50%;
    padding-top: 0;
}
.domainName /deep/ .ivu-input{
    padding-right: 80px;
}

/deep/  .ivu-input-suffix{
    width: 75px;
    border: none;
    background-color: transparent;
    color: #2a9ff6;
    z-index: 10;
    display: flex;
    align-items: center;
    span{
        cursor: pointer;
    }
}
.submit-box{
    margin-top: 60px;
}

.primary{
    margin-left: 40px;
}
</style>
