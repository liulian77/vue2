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
                      prop="resource"
                      key="resource"
            >
                <RadioGroup v-model="formValidate.resource" class="Group">
                    <Radio :label="val" v-for="(label,val) in mediaType" @click.native="resourceChange">{{label}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="媒体商"
                      prop="agent_id"
                      v-if="userinfo.distributor"
                      key="agent_id"
            >
                <Select
                        size="large"
                        :width="360"
                        :border="true"
                        v-model="formValidate.agent_id"
                        :placeholder="agentName?agentName:'选择媒体'"
                        :search="true"
                        :scrollLoad="true"
                        @downLoad="downLoad"
                        @search="search"
                >
                    <Option :value="item._id" v-for="item in titleList" :label="item.username"></Option>
                </Select>


            </FormItem>
            <FormItem label="媒体名称"
                      prop="resource_id"
                      key="resource_id"
            >
                <Select
                        size="large"
                        :width="360"
                        :border="true"
                        v-model="formValidate.resource_id"
                        :placeholder="resourceName?resourceName:'选择媒体'"
                        :search="true"
                        :scrollLoad="true"
                        @downLoad="mediaDownLoad"
                        @search="mediaSearch"
                >
                    <Option :value="item._id" v-for="item in mediaList" :label="item.title"></Option>
                </Select>



            </FormItem>
            <FormItem label="广告位名称"
                      prop="title"
                      key="title"
            >
                <Input size="large"
                       v-model="formValidate.title"
                       placeholder="广告位名称"></Input>
            </FormItem>
            <FormItem label="选择平台"
                      prop="platform"
                      key="platform"
                      v-if="formValidate.resource!='app'"
            >
                <RadioGroup v-model="formValidate.platform" class="Group">
                    <Radio :label="val" v-for="(label,val) in platformType">
                        <span>{{label}}</span>
                    </Radio>
                </RadioGroup>
            </FormItem>

            <template v-if="userinfo.distributor">
                <FormItem label="广告展现形式"
                          prop="type"

                          v-if="formValidate.resource!='app'"
                >
                    <Select size="large"
                            ref="type"
                            :width="360"
                            :border="true"
                            v-model="formValidate.type"
                            placeholder="选择广告展现形式">
                        <Option :value="val" v-for="(label,val) in typeData" :label="settingType[val]"></Option>
                    </Select>
                </FormItem>
                <FormItem size="large"
                          label="广告位尺寸"
                          prop="size">
                    <Select v-model="formValidate.size"
                            :width="360"
                            :border="true"
                            :placeholder="formValidate.size?formValidate.size:'选择广告位尺寸'">
                        <Option :value="item" v-for="item in sizeData" v-if="formValidate.type==='in_feed'" :label="sizeType[item]"></Option>
                        <Option :value="typeof item ==='string'?item:item.join(',')" v-for="item in sizeData" v-else :label="typeof item ==='string'?item:item.join(',')" ></Option>
                    </Select>
                </FormItem>
                <FormItem size="large"
                          label="悬浮位置"
                          prop="position"
                          key="position"
                          v-if="Object.keys(positionData).length>0"
                >
                    <Select v-model="formValidate.position"
                            placeholder="选择悬浮位置"
                            :width="360"
                            :border="true"
                    >
                        <Option :value="val" v-for="(label,val) in positionData" :label="label"></Option>
                    </Select>
                </FormItem>
            </template>


            <FormItem label="支持的广告类型"  key="adtype" v-if="formValidate.type!=='in_feed'">
                <CheckboxGroup v-model="adtype" class="Group">
                    <Checkbox   v-for="(label,val) in ADType" :value="val">{{label}}</Checkbox>
                </CheckboxGroup>

            </FormItem>
            <FormItem class="submit-box">
                <Button @click.native="handleReset('formValidate')">取消</Button>
                <Button type="primary" class="primary"
                        @click.native="handleSubmit('formValidate')">确定</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import {FormItem,Form,Button,Input,Select,Option,Radio,RadioGroup,Checkbox,CheckboxGroup} from "_c"
import { selectMixin,editComponments } from '@/mixins'
import { api_common,api_zone} from '@/api'
import { deepCopy } from '@/utils/assist'
import { mapState } from 'vuex'
import { debounce } from 'lodash'
const components={
    Checkbox,
    CheckboxGroup,
    Form,
    FormItem,
    Select,
    Option,
    Input,
    Radio,
    Button,
    RadioGroup
};
let filterObj = {
    username$: '',        // 媒体商筛选
};
let mediaType={
    'site':'网站流量',
    'app':'移动软件',
    'soft':'PC软件',
};
let ADType={
    "img":'图片',
    "text": '文字',
    "text_img": '图文',
    "flash": 'Flash',
};
let platformType={
    'pc':'PC',
    'mobile':'移动',
};
let sizeType={
    "single_big":'大图',
    "single_l":'单图左',
    "single_r":'单图右',
    "triple":'三图',
};
let ruleValidate={
        resource: [
            { required: true, message: "请选择媒体类型", trigger: "change" }
            ],
        agent_id: [
            {
                required: true,
                message: "请选择选择媒体商",
                trigger: "change"
            }
            ],
            resource_id: [
            {
                required: true,
                message: "请选择媒体",
                trigger: "blur"
            }
            ],
            title: [
            {
                required: true,
                message: "请填写广告位名称",
                trigger: "blur"
            }
            ],
        platform: [
            { required: true, message: "请选择平台", trigger: "change" }
            ],
        type: [
            { required: true, message: "请选择广告展现形式", trigger: "change" }
            ],
        size: [
            { required: true, message: "请选择广告位尺寸", trigger: "change" }
            ],
        position: [
            { required: true, message: "请选择悬浮位置", trigger: "change" }
            ],
    };


let formValidate={
        resource: "",
        title: "",
        resource_id: "",
        agent_id: "",
        resource_title: "",
        setting:{

        },
        platform:'pc',
        type:'',
        size:'',
        position:''
};

export default {
    components,
    mixins: [selectMixin,editComponments],
    name:'agent',
    data() {
        return {
            platformType,
            filterObj,
            mediaType,
            sizeType,
            ruleValidate,
            ADType:deepCopy(ADType),
            formValidate:deepCopy(formValidate),
            adtype:[],
            agentName:'',
            resourceName:'',
            adtypeName:'',
            titleList:[],
            initData:{},

            platformData:{},
            positionData:{},
            sizeData:{},
            typeData:{},
            submitJson:{},
            submitType:1,


            mediaFilter:{
                page:1,
                count:10,
                total:0,
                totalPage:0,
                keywords: ''
            },
            mediaList:[],
        };
    },
    methods: {
        handleData(res){
            this.adtypeName=res.resource==='app'?'adtype_mobile':'adtype_pc';
            let adtype=[];
            Object.keys(res.setting).forEach(item=>{
                if(item==='adtype_mobile'||item==='adtype_pc'){
                    adtype=Object.keys(res.setting[item]);
                }
            });
            this.formValidate={
                resource: res.resource ||'site',
                title: res.title||'',
                resource_title: res.resource_title ||'',
                agent_id: res.agent_id ||'',
                resource_id:res.resource_id ||'',
                setting:{

                },
                platform:res.setting.platform||'pc',
                type:res.setting.type ||'float',
                size:res.setting.size ||'',
                position:res.setting.position ||''
            };
            this.getMediaTitle(res.resource_title);
            this.getResourceTitle(res.agent_id);
            this.getMediaInfo();
            setTimeout(()=>{
                this.adtype=adtype;
                this.loading=false;
            },500);
        },
        reset(){
            this.adtype=[];
            this.agentName='';
            this.resourceName='';
            this.formValidate=deepCopy(formValidate);
        },
        typeInit(){
            this.typeData=this.platformData[this.formValidate.platform];
            let defaultType=Object.keys(this.typeData)[0];
            this.$set(this.formValidate,'type',defaultType);
            this.sizeTypeInit(defaultType);
        },
        sizeTypeInit(type){
            type=type?type:'float';  //'float'
            this.positionData=this.typeData[type].position;
            this.sizeData=this.typeData[type].size;
        },
        formValidateChange(){
            let formValidate=deepCopy(this.formValidate);
            formValidate.resource_id=this.userinfo._id;
            formValidate.agent_username=this.userinfo.username;
            ['platform','size','type','position'].forEach(item=>{
                if(formValidate[item]){
                    formValidate.setting[item]=formValidate[item];
                }
                delete formValidate[item]
            });
            let obj={};
            let adtype=this.adtype;
            adtype.forEach(item=>{
                obj[item]=1;
            });
            Object.keys(obj).length>0&&(formValidate.setting[this.adtypeName]=obj);
            if(formValidate.resource==='app'){
                formValidate.style_mobile=1;
                delete  formValidate.setting.platform;
            }
            console.log(formValidate);
            this.submitJson=formValidate;
        },
        mediaDownLoad() {
            if(this.mediaFilter.totalPage<=this.mediaFilter.page){
                return false;
            }
            this.$set(this.mediaFilter, 'page', this.mediaFilter.page + 1);
        },
        mediaSearch(val){
            this.$set(this.mediaFilter, 'keywords',val);
            this.$set(this.mediaFilter, 'page',1);
            let keyworks;
            Object.keys(this.filterObj).forEach(item=>{
                if(item.includes('$')){
                    keyworks=item;
                }
            });
            this.$set(this.filterObj,keyworks,val);
        },
        resourceChange:debounce(function () {
            this.getMediaInfo();
        },200),
        async getInitData(){
            let {config}=await api_common.addList("config()",["index_type"]);
            this.initData=config;
            this.platformData=config;
            this.typeInit();
        },
        async getMediaInfo() {
            let keywords = this.mediaFilter.keywords;
            let page = this.mediaFilter.page;
            let type=this.formValidate.resource;
            let res = await api_common.addList("resource_list()",["resource_list",type,keywords,page,this.mediaFilter.count]);
            let data,total;
            try {
                data= res.resource_list.data;
                total=res.resource_list.total;
            }catch (e) {
                console.log(e);
                data=[];
                total=0;
            }
            if(page==1){
                this.mediaList = data;
            }else{
                this.mediaList = [...this.mediaList, ...data];
            }
            this.$set(this.mediaFilter, 'total', total);
            this.$set(this.mediaFilter, 'totalPage',Math.ceil(total/this.mediaFilter.count));

        },
        async getMediaTitle(id){
            let {data}=await api_zone.getMediaTitle({id});
            try {
                this.resourceName=data['data[]'][0].title;
            }catch (e) {
                console.log(data);
            }
        },
        async getResourceTitle(id){
            let res=await api_zone.getResourceTitle({id});
            this.agentName=res['data[]'][0].username;
        },
    },
    props:{
        item:Object,
    },
    watch:{
        'formValidate.resource'(val){
            switch (val) {
                case 'site':
                    delete this.ADType.flash;
                    this.adtypeName='adtype_pc';
                    break;

                case 'app':
                    this.ADType=deepCopy(ADType);
                    this.adtypeName='adtype_mobile';
                    this.sizeData=this.initData.app;
                    break;

                case 'soft':
                    this.ADType=deepCopy(ADType);
                    this.adtypeName='adtype_pc';
                    break;
            }
            this.adtype=[];
        },
        'formValidate.platform'(){
            this.$set(this.formValidate,'type','float');
            this.typeInit();
        },
        'formValidate.type'(val){
            this.sizeTypeInit(val);
            //this.$set(this.formValidate,'position','');
            //this.$set(this.formValidate,'size','');
            if(val==='in_feed'){
                 this.adtypeName='';
                 this.adtype=[];
            }
        },
        'mediaFilter.page'(val){
            this.getMediaInfo();
        },
        'mediaFilter.keywords'(val){
            this.getMediaInfo();
        },
        'formValidate.resource_id'(val){
            this.mediaList.forEach(item=>{
                (item._id==val)&&(this.formValidate.resource_title=item.title);
            });
        },
        editForm(val){
            console.log(val);
        }
    },
    created(){
        Object.keys(mediaType).forEach(item=>{
            if(!this.userinfo.access[item]){
                delete this.mediaType[item];
            }
        });
        this.formValidate.resource=Object.keys(this.mediaType)[0];
    },
    mounted(){
        this.getInitData();
        this.getMediaInfo();
    },
    computed: {
        ...mapState('basic', [
            'userinfo',
        ]),
        ...mapState('app/zone', [
            'settingType',
        ]),
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
  width: 475px;
  margin: 0 auto;
}

/deep/ .ivu-form-item-error-tip{
    right: -20px;
    left: auto;
    transform: translate(100%,-50%);
    top: 50%;
    padding-top: 0;
}
/deep/ .ivu-input{
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
    margin-left: 40px!important;
}
.Group{
    height: 32px;
}
</style>
