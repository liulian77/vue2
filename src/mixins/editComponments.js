/*
*  用于新增，修改弹窗的公共部分
*
* */
import { Dialog } from '_c/dialog'
import {api_global} from '@/api'
import { deepCopy } from '@/utils/assist'

const isFunction=(item)=>item&&(typeof item==='function');  //判断是方法


export default {
    props:{
        id:String,
        popType: String
    },
    data() {
        return {
            type:'add',  //编辑还是新增
            req:{},
            loading:false, //数据加载前的loading判断
            disabled:false //提交按钮是否禁用
        }
    },
    watch:{
        //判断编辑还是新增
        id(val){
            if(val){
                if (this.popType) {
                    this.type=this.popType;
                } else {
                    this.type='edit';
                }
                this.loading=true;
                this.getData(this.id);
            }else {
                this.type='add';
                this.handleReset('formValidate');
            }
        }
    },
    methods: {
        //表单提交前的数据处理
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                //提交前用于改变提交的data，操作submitJson
                isFunction(this.formValidateChange)&&(this.formValidateChange());
                if (valid&&this.type==='add') {
                    this.submitData();
                    this.disabled=true;
                }
                if (valid&&this.type==='edit') {
                    this.updateData();
                    this.disabled=true;
                }
            });
        },
        //表单的数据重置
        handleReset(name) {
            this.$refs[name].resetFields();
            //额外的数据的重置
            isFunction(this.reset)&&(this.reset());
        },
        //提交新增信息
        async submitData(){
            let options={
                url:this.addUrl,
                data:this.submitJson?this.submitJson:this.formValidate
            };
            try {
                await api_global.postMessage(options);
                let self=this;
                Dialog({
                    type: 'default',
                    text: '操作成功',
                    onConfirm(){
                        self.$emit('submitSuccess');
                        self.handleReset('formValidate');
                    },
                    onCancel(){
                        self.$emit('submitSuccess');
                        self.handleReset('formValidate');
                    }
                });
            }catch (e) {}
            this.disabled=false;
        },
        //提交修改信息
        async updateData(){

            try {
                let json=deepCopy(this.submitJson?this.submitJson:this.formValidate);
                //对filterObj遍历，没有值的属性删除，有的保留
                if(this.delObj&&this.delObj.length>0)
                    this.delObj.forEach(item=>{
                    delete json[item]
                });
                json._id=this.id;
                let options={
                    url:this.updateUrl,
                    data:json
                };
                await api_global.postMessage(options);
                let self=this;
                Dialog({
                    type: 'default',
                    text: '操作成功',
                    onConfirm(){
                        self.$emit('submitSuccess');
                        self.handleReset('formValidate');
                    },
                    onCancel(){
                        self.$emit('submitSuccess');
                        self.handleReset('formValidate');
                    }
                });
            }catch (e) {}
            this.disabled=false;

        },
        //获取单条信息
        async getData(id,type){
            let options={
              url:this.getUrl,
              data:{_id:id}
            };
            try {
                let res=await api_global.getMessage(options);
                this.handleData(res);
            }catch (e) {}
        },
    },
    created(){

    },
}
