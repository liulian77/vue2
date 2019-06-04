<template>
  <sn-modal
    v-model="modalShow"
    :footer-hide="true"
    width="840"
    class="z-modal"
    :class="{'minh700': false}"
    @on-visible-change="modalVisibleChange"
    :title="title"
    :styles="{top: '20px'}"
    :mask-closable="false">
    <div class="scroll-layer">
      <div class="add-app">
        <sn-steps :current="cProgressStep" :class="{ml120: false}">
          <sn-step title="上传应用" style="color:red"></sn-step>
          <sn-step title="解析"></sn-step>
          <sn-step title="填写信息"></sn-step>
        </sn-steps>
      </div>
      <!-- 选择文件(立即上传) -->
      <div v-if="[0].indexOf(uploadStep) !== -1">
        <div class="add-app-item add-btn">
          <div :id="uploadBtnId" class="btn-upload-picker">立即上传</div>
        </div>
        <div class="add-app-item add-p">
          <p>点击按钮选择应用的安装包</p>
          <p>(支持IPA文件，单个文件最大支持2GB，支持中断后续传)</p>
        </div>
      </div>
      <!-- 选择文件(重新上传) -->
      <div v-else-if="[5].indexOf(uploadStep) !== -1">
        <div class="add-app-item upload-container">
          <p style="color:#F13A30">{{uploadErrMsg}}</p>
        </div>
        <div class="add-app-item">
          <div :id="uploadBtnId" class="btn-upload-picker">重新上传</div>
        </div>
        <div class="add-app-item add-p">
          <p>点击按钮选择应用的安装包</p>
          <p>(支持IPA文件，单个文件最大支持2GB，支持中断后续传)</p>
        </div>
      </div>
      <!-- 上传中 -->
      <template v-else-if="uploadStep === 1">
        <div class="add-app-item app-size">
          <p>应用正在上传中，请不要关闭页面</p>
        </div>
        <div class="add-app-item add-loading">
          <Progress class="progress-bar" :percent="uploadProgress.percent" status="active" hide-info></Progress>
        </div>
        <div class="add-app-item app-size">
          <p>{{uploadProgress.percent.toFixed(0)}}% {{+((uploadProgress.size*uploadProgress.percent/100).toFixed(1))}}M/{{+(uploadProgress.size.toFixed(1))}}M</p>
        </div>
        <div class="add-app-item app-pause">
          <sn-button
            v-if="!uploadPause"
            type="primary"
            ghost
            @click.native="handleBtnSuspendUploadClick"
          >暂停上传</sn-button>
          <sn-button v-else type="primary" ghost @click.native="handleBtnContinueUploadClick">继续上传</sn-button>
          <sn-button
            style="margin-left: 16px;"
            type="primary"
            ghost
            @click.native="handleBtnCancelUploadClick"
          >取消上传</sn-button>
        </div>
      </template>
      <!-- 解析中 -->
      <template v-else-if="uploadStep === 2">
        <div class="add-app-item app-onload">
          <p>应用解析中，请不要关闭页面！</p>
        </div>
        <div class="add-app-item" style="position:relative;padding-bottom:32px;">
          <Loading class="loading" :visible="true"></Loading>
        </div>
      </template>
      <!-- 填写信息表单 -->
      <template v-if="uploadStep === 3">
        <div class="app-info" style="margin-top:10px; margin-left:272px;">
          <div class="app-info__left">
            <img :src="`${domain.static}${appForm.icon}`" alt class="app-info__img">
          </div>
          <div class="app-info__right">
            <p class="app-info__title">{{appForm.name}}</p>
            <p class="app-info__text">版本：{{appForm.version}}</p>
            <p class="app-info__text">大小：{{(appForm.size/1024/1024).toFixed(1)}}M</p>
          </div>
        </div>
        <sn-form
          ref="appForm"
          class=''
          :model="appForm"
          :rules="ruleValidate"
          :label-width="115"
          @submit.native.prevent>
          <sn-form-item label="应用模板" v-if="false">
            <RadioGroup v-model="appForm.template_type" @on-change="templageChange">
              <Radio :label="0" :value="0">原生版</Radio>
              <Radio :label="1" :value="1">测试版</Radio>
              <Radio :label="2" :value="2">推广版</Radio>
            </RadioGroup>
          </sn-form-item>
          <sn-form-item label="主页地址" prop="host">
            <Input style="width: 50%;" v-model="appForm.host" placeholder="自定义主页地址"/>
            {{domain.domain}}
          </sn-form-item>
          <sn-form-item prop="has_push">
            <div slot="label" class="slot-label">消息推送
              <Poptip placement="bottom-start" trigger="hover">
                <sn-icon type="explain" color="#ccc" :size="16" class="tips"></sn-icon>
                <div class="tips-table" slot="content">
                  消息推送可提高用户活跃度及应用留存率，但会影响第三方(微信、QQ等)登录。
                </div>
              </Poptip>
            </div>
            <scroll-select class="mr10 flr"  v-model="appForm.has_push" :list="hasPushList"  name="value" label="txt" :image="false" :showAll="false" placeholder="请选择"></scroll-select>
          </sn-form-item>
          <template v-if="true">
            <sn-form-item prop="app_class" key="app_class">
              <div slot="label" class="slot-label">应用类别
                <Poptip placement="bottom-start" trigger="hover">
                  <sn-icon type="explain" color="#ccc" :size="16" class="tips"></sn-icon>
                  <div class="tips-table" slot="content">
                    您想要展示给用户的应用类别
                  </div>
                </Poptip>
              </div>
              <scroll-select class="mr10 flr"  v-model="appForm.app_class" :list="appClasslist"  name="value" label="txt" :image="false" :showAll="false" placeholder="选择类别"></scroll-select>
            </sn-form-item>
            <sn-form-item label="应用简介" prop="desc" v-if="false">
              <Input v-model="appForm.desc" placeholder="15字以内" :maxlength="15"/>
            </sn-form-item>
            <sn-form-item prop="basedown">
              <div slot="label" class="slot-label">评分数显示
                  <Poptip placement="bottom-start" trigger="hover">
                    <sn-icon type="explain" color="#ccc" :size="16" class="tips"></sn-icon>
                    <div class="tips-table" slot="content">
                      您想要展示给用户的评分数量，没有具体评价内容且分数固定为4.9分，您只需填写一个看似真实的评价数展示给用户，表现您的应用已有如此多的下载量。
                    </div>
                  </Poptip>
                </div>
              <InputNumber v-model="appForm.basedown" :min="0" :precision="0"/>
            </sn-form-item>
            <sn-form-item prop="info">
              <div slot="label" class="slot-label">应用介绍
                <Poptip placement="bottom-start" trigger="hover">
                  <sn-icon type="explain" color="#ccc" :size="16" class="tips"></sn-icon>
                  <div class="tips-table" slot="content">
                    您想要展示给用户对此应用的详细介绍
                  </div>
                </Poptip>
              </div>
              <Input
                v-model="appForm.info"
                placeholder="应用详细介绍，500字以内"
                type="textarea"
                :rows="6"
                :maxlength="500"
              />
            </sn-form-item>
          </template>
          <template v-if="appForm.template_type === 2">
            <sn-form-item label="按钮方案">
              <div class="btn-style-img" v-if="appForm.btn_style.length">
                <div>
                  <img :src="domain.static+ appForm.btn_style" alt>
                </div>
              </div>
              <sn-upload
                :action="uploadUrlGet"
                :show-upload-list="false"
                :on-success="addBtnStyleUploadSuccess"
                ref="btnAddImageUpload"
                :format="['jpg','jpeg','png']"
                name="file"
              >
                <sn-button type="primary" :disabled="appForm.btn_style.length > 0" size="stretch" class="w100">点击上传</sn-button>
              </sn-upload>
              <p>建议321*36px</p>
              <sn-upload-bar
                v-if="btnUploadList.length && btnUploadList[0].status !== 'finished'"
                :class="false?'visible':''"
                :per="btnUploadList.length ? btnUploadList[0].percentage : 0"
                :name="btnUploadList[0].name"
              ></sn-upload-bar>
            </sn-form-item>
          </template>
          <sn-form-item label="详情图" prop="detail_img">
            <div class="upload-img" v-if="appForm.detail_img && appForm.detail_img.length" :style="imgStyle">
              <div :style="imgCss">
                <div class="img-wrap" v-for="(item,index) in appForm.detail_img" :style="imgStyle" :key="index" >
                  <img :src="domain.static+ item" :style="imgStyle"  alt>
                  <sn-icon type="close" :size="20" class="remove-img" @click="removeImg(index)"></sn-icon>
                </div>
              </div>
            </div>
            <sn-upload
              :action="uploadUrlGet"
              :show-upload-list="false"
              :on-success="addImgUploadSuccess"
              :before-upload="handleUpload"
              :format="['jpg','jpeg','png']"
              :multiple="true"
              ref="addImageUpload"
              name="file"
            >
              <sn-button type="primary" :disabled="imgUploadStatus" size="stretch" class="w100">上传{{appForm.detail_img.length}}/{{appForm.template_type === 0 ? 5 : 10}}</sn-button>
            </sn-upload>
            <p>{{descInfo}},不同尺寸的图片无法同时上传</p>
            <sn-upload-bar
              v-if="uploadList.length && uploadList[uploadList.length - 1].status !== 'finished'"
              :class="false?'visible':''"
              :per="uploadList.length ? uploadList[uploadList.length - 1].percentage : 0"
              :name="uploadList[uploadList.length - 1].name"
            ></sn-upload-bar>
          </sn-form-item>
          <sn-form-item label="下载单价">
            <Input v-model="appForm.price" v-if="appForm.template_type === 1"/>
            <span v-if="appForm.template_type !== 1">{{appForm.price}}</span>
          </sn-form-item>
          <sn-form-item>
            <Button type="primary" ghost @click.native="handleBtnReleaseClick">{{appInfo ? '更新应用' : '发布应用'}}</Button>
          </sn-form-item>
        </sn-form>
      </template>
      <!-- 信息预览 -->
      <section class="app-preview-wrap" v-if="false">
        <h3>预览</h3>
        <aside class='app-preview'>
          <header>
          </header>
          <section>
            <div class="icon-wrapper">
              <div class="add-zimg">
                <img :src="`${domain.static}${appForm.icon}`" alt>
              </div>
              <div class="icon-content">
                <p class="first">{{appForm.name}}</p>
                <p>
                  <span>{{appForm.version}}</span>
                </p>
                <p>
                  <span>{{sizeShow}}</span>
                </p>
                <div class="last"><button>安装</button> <div>?</div></div>
              </div>
            </div>
            <div class="preview-img-wrap">
              <div class="scroll"></div>
            </div>
            <div class="upload-img" v-if="appForm.detail_img.length && appForm.template_type !== 1" :style="previewImgStyle">
              <div :style="previewImgCss">
                <img :src="domain.static+ item" :style="previewImgStyle" v-for="(item,index) in appForm.detail_img" :key="index" alt>
              </div>
            </div>
            <div class="qrcode-wrap" :style="qrcodeStyle">
              <img src="/image/qrcode.png" alt="">
              <p>扫描二维码安装</p>
            </div>
          </section>
          <footer v-if="appForm.template_type === 2" :style="perviewFooter">{{ appForm.temtemplate_type === 2?'':'安装'}}</footer>
        </aside>
      </section>
      <!-- 应用相同报错 -->
      <template  v-if="uploadStep === 10">
        <div class="add-app-item app-onload">
          <p>该APP已存在，Bundle ID: {{bundle_id}},请上传另一个APP，或修改您的Bundle ID</p>
          <!-- <p>请上传另一个APP，或修改您的Bundle ID</p> -->
        </div>
        <div class="btn-layer">
          <Button type="primary" ghost @click.native="modalVisibleChange(false)">取消</Button>
        </div>
      </template>
      <!-- 修改应用bundle不同 -->
      <template  v-if="uploadStep === 11">
        <div class="add-app-item app-onload">
          <p>该APP的Bundle ID与原APP不一致，更新失败</p>
        </div>
        <div class="btn-layer">
          <!-- <Button type="primary" ghost @click.native="confirmUp(false)">确认更新</Button> -->
          <Button type="default" ghost @click.native="modalVisibleChange(false)">取消</Button>
        </div>
      </template>
    </div>
  </sn-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Dialog } from '_c/dialog'
import { baseUrl } from '@/common/config'
import Poptip from "_c/poptip";
import { getMessage, postMessage } from '@/api/global'
import { debounce } from 'lodash'
import { Icon, Search, Button,scrollSelect, uploadBar } from '_c'
import fetch from "@/common/fetch";
import { deepCopy } from "@/utils/assist";

import {
  MenuItem,
  Menu,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  MenuGroup,
  Modal,
  Step,
  Progress,
  Upload,
  Steps,
  Spin,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  RadioGroup,
  Radio,
  Col,
  Row,
  InputNumber,
  Message
} from 'iview'
const components = {
  "sn-modal": Modal,
  'sn-form': Form,
  'sn-form-item': FormItem,
  Select,
  'sn-icon': Icon,
  'sn-step': Step,
  'sn-steps': Steps,
  'sn-button': Button,
  'scroll-select':scrollSelect,
  Progress,
  Form,
  FormItem,
  Option,
  Button,
  Input,
  InputNumber,
  RadioGroup,
  Radio,
  Poptip,
  "sn-upload": Upload,
  "sn-upload-bar": uploadBar,
  Upload
};
const appClasslist = [
  {"value":"报刊杂志","txt":"报刊杂志"},
  {"value":"财务","txt":"财务"},
  {"value":"参考","txt":"参考"},
  {"value":"导航","txt":"导航"},
  {"value":"儿童","txt":"儿童"},
  {"value":"工具","txt":"工具"},
  {"value":"购物","txt":"购物"},
  {"value":"健康健美","txt":"健康健美"},
  {"value":"教育","txt":"教育"},
  {"value":"旅游","txt":"旅游"},
  {"value":"美食佳饮","txt":"美食佳饮"},
  {"value":"商务","txt":"商务"},
  {"value":"社交","txt":"社交"},
  {"value":"摄影与录像","txt":"摄影与录像"},
  {"value":"生活","txt":"生活"},
  {"value":"体育","txt":"体育"},
  {"value":"天气","txt":"天气"},
  {"value":"图书","txt":"图书"},
  {"value":"效率","txt":"效率"},
  {"value":"新闻","txt":"新闻"},
  {"value":"医疗","txt":"医疗"},
  {"value":"音乐","txt":"音乐"},
  {"value":"娱乐","txt":"娱乐"},
  {"value":"策略游戏","txt":"策略游戏"},
  {"value":"动作游戏","txt":"动作游戏"},
  {"value":"儿童","txt":"儿童"},
  {"value":"角色扮演","txt":"角色扮演"},
  {"value":"竞速游戏","txt":"竞速游戏"},
  {"value":"聚会游戏","txt":"聚会游戏"},
  {"value":"卡牌游戏","txt":"卡牌游戏"},
  {"value":"冒险游戏","txt":"冒险游戏"},
  {"value":"模拟游戏","txt":"模拟游戏"},
  {"value":"日月","txt":"日月"},
  {"value":"文字","txt":"文字"},
  {"value":"问答游戏","txt":"问答游戏"},
  {"value":"休闲","txt":"休闲"},
  {"value":"益智解谜","txt":"益智解谜"},
  {"value":"音乐","txt":"音乐"},
  {"value":"桌面游戏","txt":"桌面游戏"}
];
const hasPushList = [
  {"value":"1","txt":"推送"},
  {"value":"0","txt":"不推送"}
];
export default {
  name: "uploadApp",
  components,
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '新增应用'
    },
    appInfo: {
      type: Object, 
      default: null
    },
    uploadBtnId: {
      type: String,
      default: 'btn-upload-picker'
    },
    appInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // 应用类别
      appClasslist,
      // 消息推送
      hasPushList,
      modalShow: false,
      // 0:等待选择文件,1:正在上传中,2:解析中,3:填写信息,4:上传出错,5:重新上传
      uploadStep: 0,
      // 上传文件的进度信息
      uploadProgress: {
        percent: 0,
        size: 0
      },
      // 当前是否暂停上传
      uploadPause: false,
      // uploadErrMsg
      uploadErrMsg: "",
      // 表单的值
      appForm: {
        icon: "",
        name: "",
        size: 0,
        version: "",
        host: "",
        ipa: "",
        banner: "",
        app_class: '',
        has_push: '1',
        detail_img: [],
        basedown: 0,
        btn_style: '',
        template_type: 0,
        // desc: "",
        info: "",
        price: ""
      },
      // 当前是否正在提交表单
      appFormSubmitting: false,
      // 图片上传的接口
      uploadUrlGet: baseUrl + '/file/banner.json',
      addShowUrl: '',
      uploadList: [],
      btnUploadList: [],
      bundle_id: '',
      imgWidth: 0,
      imgHeight: 0,
      parseInfo: null,
      ruleValidate: {
        host: [
          {
            required: true,
            pattern: /^[0-9a-zA-z]{2,10}$/,
            message: '主页地址只能由2-10位字母或数字组成',
            trigger: 'blur'
          }
        ],
        desc: [
          {
            required: true,
            message: '请输入应用简介',
            trigger: 'blur'
          }
        ],
        app_class: [
          {
            required: true,
            message: "请选应用类别",
          },
          // {
          //   pattern: /^[\u4e00-\u9fa5_a-zA-Z_]{1,10}$/,
          //   message: '10个字符以内仅中英文'
          // }
        ],
        has_push: [
          {
            required: true,
            message: "请选消息推送",
          }
        ],
        info: [
          {
            required: true,
            message: '请输应用介绍',
            trigger: 'blur'
          }
        ],
        detail_img: [
          {
            validator: (rul, value, callback) => {
              if (value.length) {
                if (this.appForm.template_type === 0 && (value.length < 2 ||  value.length > 5)) {
                  callback(new Error(`请上传2-5张图片`));
                } else if (this.appForm.template_type === 2  && (value.length < 2 ||  value.length > 10)) {
                  callback(new Error(`请上传2-10张图片`));
                } else {
                  callback();
                }
              } else {
                  callback();
              }
            },
            trigger: 'change'
          }
        ],
        basedown: [
          {
            required: true,
            pattern: /^(?!00)(?:[0-9]{1,5}|100000)$/,
            message: '评价数显示范围0-100,000',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    addImgUploadSuccess(res, file) {
      if (res.status === 200) {
        // if ((this.appForm.template_type === 0 && this.this.appForm.detail_img.length < 5) || (this.appForm.template_type === 2 && this.appForm.detail_img.length < 10)) {
        if (this.appForm.detail_img.length < 5) {
          this.appForm.detail_img.push(res.url);
        } else {
          this.$refs['addImageUpload'].clearFiles()
          this.uploadList = this.$refs['addImageUpload'].fileList
        }
      }
    },
    addBtnStyleUploadSuccess(res, file) {
      if (res.status === 200) {
        this.appForm.btn_style = res.url;
        this.$refs["btnAddImageUpload"].clearFiles();
        this.btnUploadList = this.$refs["btnAddImageUpload"].fileList;
      }
    },
    templageChange(val) {
      let vm = this;
      vm.$nextTick(() => {
        try {
          if (val !== 1) {
              vm.uploadList = vm.$refs["addImageUpload"].fileList;
          }
          if (val === 2) {
              vm.btnUploadList = vm.$refs["btnAddImageUpload"].fileList;
          }
        } catch (error) {
        }
        
      })
    },
    handleUpload(file) {
      return this.checkImageWH(file, this.imgWidth, this.imgHeight);
    },
    checkImageWH(file, width, height) {
      console.log(width, height);
      let self = this;
      return new Promise(function (resolve, reject) {
          let filereader = new FileReader();
          filereader.onload = e => {
              let src = e.target.result;
              const image = new Image();
              image.onload = function () {
                  console.log(this.width, this.height);
                  if (width === 0 && height === 0) {
                      if ((this.width === 1920 && this.height === 1080) || 
                          (this.width === 1080 && this.height === 1920) ||
                          (this.width === 2208 && this.height === 1242) ||
                          (this.width === 1242 && this.height === 2208)) {
                        console.log(this.width, this.height);
                        self.imgWidth = this.width;
                        self.imgHeight = this.height;
                        width = this.width;
                        height = this.height;
                        resolve();
                      } else {
                        Message.error(self.descInfo);
                        reject();
                        return;
                      }
                  }
                  if (width && this.width != width) {
                      Message.error('请上传宽为' + width + ",高为"+height+"的图片");
                      reject();
                  } else if (height && this.height != height) {
                      Message.error('请上传宽为' + width + ",高为"+height+"的图片");
                      reject();
                  } else {

                    resolve();
                  }
              };
              image.onerror = reject;
              image.src = src;
          };
          filereader.readAsDataURL(file);
      });
    },
    modalVisibleChange(val) {
      if (!val) {
        // 取消文件上传
        this.handleBtnCancelUploadClick();
      } else {
        this.uploadStep = 0;
        this.uploadErrMsg = "";
      }
      this.modalShow = val;
      this.$emit('visibleChange', val);
    },
    // 发布应用按钮点击事件
    async handleBtnReleaseClick() {
      if (this.appFormSubmitting) {
        return;
      }
      try {
        // 表单校验
        const flag = await this.$refs.appForm.validate();
        if (!flag) {
          throw new Error();
        }
        // 显示loading
        this.appFormSubmitting = true;
        // 请求接口
        if (this.appInfo) {
          await fetch({
            method: 'PUT',
            url: '/apps.json',
            data: {...this.appForm, _id: this.appInfo._id, bundle_id: this.parseInfo.bundle_id}
          });
          // 提示更新成功
          Message.success("更新成功");
        } else {
          await postMessage({
            url: "/apps.json",
            data: this.appForm
          });
        // 提示发布成功
          Message.success("发布成功");
        }
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        this.$router.go(0);
      } catch (error) {
        console.log(error);
      } finally {
        this.appFormSubmitting = false;
      }
    },
    // 取消上传按钮点击事件
    handleBtnCancelUploadClick() {
      if (this.parseJsonPost) {
        console.log("取消解析的接口请求");
        // 取消解析的接口请求
        this.parseJsonPost.abort();
      }
      this.uploadStep = 5;
      this.uploadPause = false;
      // this.uploadErrMsg = "取消上传";
      try {
        this.uploader.cancelFile(this.file_);
      } catch (error) {}
    },
    // 继续上传按钮点击事件
    handleBtnContinueUploadClick() {
      this.uploadPause = false;
      this.uploader.upload(this.uploader.getFiles("error"));
    },
    // 暂停上传按钮点击
    handleBtnSuspendUploadClick() {
      this.uploadPause = true;
      this.uploader.stop(this.file_);
      this.file_.setStatus("error");
    },
    // 初始化分片上传
    initWebuploader() {
      var vm = this;
      const uploadswf = baseUrl + "/webupload/Uploader.swf";
      const server_url = baseUrl + "/file/ipa.json";
      let chunkObj = {}; //用来记录文件的状态、上传中断的位置
      let msg = "";
      if (!this.hasRegister) {
        console.log("初始化分片上传");
        this.hasRegister = true;
        WebUploader.Uploader.register(
          {
            "before-send-file": "beforeSendFile",
            "before-send": "beforeSend"
          },
          {
            beforeSendFile: function(file) {
              console.log({ file });
              //上传前校验文件是否已经上传过
              var deferred = WebUploader.Deferred();
              $.ajax({
                type: "POST",
                //上传前校验文件上传到第几片
                url: baseUrl + "/file/check.json",
                data: {
                  fileMd5: $.md5(file.name + file.size + file.ext),
                  fileName: file.name,
                  fileSize: file.size
                },
                dataType: "json",
                success: function(data) {
                  console.log(data);
                  if (data.status != 200) {
                    vm.uploadErrMsg = "请重新上传正确的IPA包";
                    deferred.reject();
                  }
                  chunkObj = data;
                  msg = data.msg;
                  deferred.resolve();
                },
                error: function() {
                  deferred.reject();
                }
              });
              //deferred.resolve();
              return deferred.promise();
            },
            beforeSend: function(block) {
              //每个分片上传之前
              var deferred = WebUploader.Deferred();
              var curChunk = block.chunk;
              if (curChunk < chunkObj.chunk) {
                //跳过已经传过的分片
                deferred.reject();
              } else {
                deferred.resolve();
              }
              return deferred.promise();
            }
          }
        );
      }
      if (this.uploader) {
        this.$nextTick(() => {
          this.uploader.destroy();
          this.uploader = null;
        });
      }
      let self = this;
      this.$nextTick(() => {
        const uploader = WebUploader.create({
          // 选完文件后，是否自动上传。
          auto: false,
          // swf文件路径
          swf: uploadswf,
          // 文件接收服务端。
          server: server_url,
          // 内部根据当前运行是创建，可能是input元素，也可能是flash.
          pick: '#' + self.uploadBtnId,
          chunked: true, //开始分片上传
          chunkSize: 1024 * 1024, //每一片的大小

          threads: 1,
          formData: {},
          // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
          resize: false
        });
        this.uploader = uploader;
        // 卸载的时候销毁
        this.$once("hook:beforeDestroy", () => {
          this.uploader && this.uploader.destroy();
          this.uploader = null;
          this.file_ = null;
        });
        //某个文件开始上传前触发，一个文件只会触发一次。
        uploader.on("uploadStart", function(file) {
          vm.uploadErrMsg = "";
          vm.file_ = file;
        });
        // 当有文件被添加进队列的时候
        uploader.on("fileQueued", function(file) {
          console.log("有文件被添加进队列", file);
          uploader.upload();
        });
        // 文件上传过程中
        uploader.on("uploadProgress", function(file, percentage) {
          vm.uploadStep = 1;
          vm.uploadProgress.size = file.size / 1024 / 1024;
          vm.uploadProgress.percent = percentage * 100;
        });
        uploader.on("uploadBeforeSend", function(obj, data, headers) {
          const chunkfile = obj.cuted.file;
          data.fileMd5 = $.md5(chunkfile.name + chunkfile.size + chunkfile.ext);
        });
        // 文件上传成功
        uploader.on("uploadSuccess", async (file, response) => {
          const vm = this;
          try {
            vm.uploadStep = 2;
            const name = response.name;
            this.parseJsonPost = $.ajax({
              type: "GET",
              url: baseUrl + "/parse.json",
              data: {
                name
              },
              timeout: 999 * 1000,
              dataType: "json",
              success: function(data = {}) {
                vm.parseInfo = deepCopy(data);
                if (vm.appInfo) {
                  if (vm.appInfo.bundle_id !== data.bundle_id) {
                    vm.uploadStep = 11;
                    return;
                  }
                } else {
                 /*  let arr = vm.appList.filter(item => {
                    return item.bundle_id === data.bundle_id;
                  })
                  if (arr.length) {
                    vm.bundle_id = arr[0].bundle_id;
                    vm.uploadStep = 10;
                    return;
                  } */
                }
                vm.uploadStep = 3;
                vm.resetFormData(data);
              },
              error: function() {
                vm.uploadStep = 5;
                vm.uploadErrMsg = "解析失败，请重新上传正确的IPA包";
              }
            });
          } catch (error) {
            this.uploadStep = 5;
            this.uploadErrMsg = "解析失败，请重新上传正确的IPA包";
            console.log("uploadSuccess", error);
          }
        });
        // 文件上传失败，显示上传出错。
        uploader.on("uploadError", function(file, reason) {
          console.log("uploadError", reason);
          vm.uploadErrMsg = "请重新上传正确的IPA包";
          vm.uploadStep = 5;
        });
        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on("uploadComplete", function(file) {
          console.log("uploadComplete");
        });
        //所有文件上传完毕
        uploader.on("uploadFinished", function() {
          console.log("uploadFinished");
        });
      });
    },
    // 设置appfrom
    resetFormData(data) {
      let vm = this;
      if (!data) {
        data = vm.parseInfo;
      }
      vm.imgWidth = 0;
      vm.imgHeight = 0;
      if (vm.appInfo) {
        console.log(data);
        vm.appForm = {
          icon: data.icon,
          name: data.name,
          size: data.size,
          version: data.version,
          host: vm.appInfo.host,
          ipa: data.ipa,
          banner: vm.appInfo.banner,
          basedown: vm.appInfo.basedown,
          // desc: vm.appInfo.desc,
          has_push: vm.appInfo.has_push + '',
          app_class: vm.appInfo.app_class,
          detail_img: vm.appInfo.detail_img ? vm.appInfo.detail_img : [],
          template_type: vm.appInfo.template_type,
          btn_style: vm.appInfo.btn_style,
          info: vm.appInfo.info,
          price: vm.appInfo.price,
        };
        
      } else {
        vm.appForm = {
          ...{
            icon: "",
            name: "",
            size: 0,
            version: "",
            host: "",
            ipa: "",
            banner: "",
            basedown: 0,
            // desc: "",
            app_class: '',
            has_push: '1',
            template_type: 0,
            detail_img: [],
            btn_style: '',
            info: "",
            price: ""
          },
          ...data
        };
      }
      console.log(vm.appForm);
      vm.$nextTick(() => {
        // vm.templageChange(0);
        try {
          vm.uploadList = vm.$refs["addImageUpload"].fileList;
        } catch(e) {}
      });
    },
    // 确认更新
    confirmUp() {
      this.uploadStep = 3;
      this.resetFormData();
    },
    // 删除图片
    removeImg(index) {
      let arr = deepCopy(this.appForm.detail_img);
      arr.splice(index, 1);
      if (!arr.length) {
        this.imgWidth = 0;
        this.imgHeight = 0;
      }
      this.$set(this.appForm, 'detail_img', arr);
    }
  },
  computed: {
    ...mapState('basic', ['userinfo', 'domain', 'appList']),
    // 步骤条当前位置
    cProgressStep() {
      if ([0, 1, 5].indexOf(this.uploadStep) !== -1) {
        return 0
      } else if ([2, 4, 10, 11].indexOf(this.uploadStep) !== -1) {
        return 1
      } else if (this.uploadStep === 3) {
        return 2
      } else {
        return 0
      }
    },
    imgCss() {
      if(this.appForm && this.appForm.detail_img.length) {
        return {
          width: this.appForm.detail_img.length * 165 + 'px'
        }
      }else {
        return {width: '100%'};
      }
    },
    imgStyle() {
      if (this.imgWidth === 1920 || this.imgWidth === 2208) {
        return {height: '86px'};
      } else {
        return {height: '279px'};
      }
    },
    previewImgCss() {
      if(this.appForm && this.appForm.detail_img.length) {
        return {
          width: this.appForm.detail_img.length * 142 + 'px'
        }
      }else {
        return {width: '100%'};
      }
    },
    previewImgStyle() {
      if (this.imgWidth === 1920 || this.imgWidth === 2208) {
        return {height: '86px'};
      } else {
        return {height: '180px'};
      }
    },
    qrcodeStyle() {
      if(this.appForm && this.appForm.template_type !== 1 && this.appForm.detail_img.length ) {
        return {'margin-top': '20px'}
      } else {
        return {'margin-top': '70px'}
      }
    },
    perviewFooter() {
      if(this.appForm && this.appForm.template_type === 2 && this.appForm.btn_style.length ) {
        return {background: `url(${this.domain.static + this.appForm.btn_style}) no-repeat`, 'background-size': '100% 100%'}
      } else {
        return {'background-color': '#067AFE'}
      }
    },
    sizeShow() {
      if (this.appForm) {
        if (this.appForm.size) {
          return (this.appForm.size / 1024 / 1024).toFixed(1) + "M";
        } else {
          return "0M";
        }
      } else {
        return "0M";
      }
    },
    descInfo() {
      if (this.imgWidth === 0 && this.imgHeight === 0) {
        return '请上传尺寸为1920*1080、1080*1920、2208*1242、1242*2208的图片'
      }
      if (this.imgWidth === 1920) {
        return '请上传尺寸为1920*1080的图片';
      }
      if (this.imgWidth === 1080) {
        return '请上传尺寸为1080*1920的图片';
      }
      if (this.imgWidth === 2208) {
        return '请上传尺寸为2208*1242的图片';
      }
      if (this.imgWidth === 1242) {
        return '请上传尺寸为1242*2208的图片';
      }
    },
    imgUploadStatus(){
      if (this.appForm) {
        if (this.appForm.template_type === 0) {
          return this.appForm.detail_img.length >= 5;
        } else if (this.appForm.template_type === 2) {
          return this.appForm.detail_img.length >= 10;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.modalShow = val;
      },
      immediate: true
    },
    modalShow(val) {
      console.log(val);
      if (val && !this.uploader) {
        // 初始化分片上传
        this.hasInitWebuploader = true
        this.initWebuploader()
      }
    },
    uploadStep(val) {
      if (val === 5 || val === 0) {
        try {
          this.$nextTick(() => {
            this.initWebuploader()
          })
        } catch (error) {}
      }
      if (val === 0) {
        this.uploadErrMsg = ''
        this.uploadPause = false
      }
    },
  }
};
</script>

<style lang="less" scoped>
.add-app {
  margin-top: 20px;
  height: 100px;
  .ivu-steps {
    width: 450px;
    margin: 0 auto;

    .ivu-steps-item {
      position: relative;

      .ivu-steps-title {
        position: absolute;
        left: 20px;
        top: 40px;
      }
    }
  }
}
.btn-upload-picker {
  margin-top: 75px;
}

.add-loading {
  padding: 20px 0;
}
.app-pause {
  padding: 30px 0 60px;
}
.add-st {
  color: red;
}
.app-onload {
  padding: 20px 0;
}
.add-app-item {
  text-align: center;
  p {
    color: #a1a2a5;
    font-size: 15px;
  }
  .progress-bar {
    width: 80%;
  }
}
.ivu-form {
  width: 460px;
}
.ivu-form-label-right {
  color: #7f8fa4;
}
.ivu-progress-outer {
  width: 70%;
}
.ivu-form-item {
  margin-bottom: 19px;
}

.add-p {
  margin: 70px 0 60px;
}
.webuploader-pick {
  background-color: #2d8cf0;
  &:hover {
    background-color: #57a3f3;
  }
  & + div {
    left: 50% !important;
    transform: translateX(-50%);
  }
}
.app-info__right {
  margin-left: 24px;
}

.app-info__img {
  width: 92px;
  height: 92px;
  border-radius: 20px;
}

.app-info__text {
  margin-bottom: 3px;
  font-size: 14px;
  color: rgba(173, 177, 182, 1);
}

.app-info__title {
  margin-bottom: 12px;
  font-size: 16px;
  color: rgba(53, 64, 82, 1);
}
.app-info {
  display: flex;
  align-items: center;
  margin: 0 auto;
  margin-top: 49px;
  margin-left: 223px;
  margin-bottom: 14px;
}
.upload-img {
  border-radius: 2px;
  height: 130px;
  overflow-x: auto;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    height: 5px;
    width: 10px;
    background-color: rgba(197,204,212, .5);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(197,204,212, .5);
    border-radius: 5px;
  }
  div {
    img {
      width: 155px;
      height: 130px;
      margin-left: 10px;
      &:nth-child(1) {
        margin-left: 0;
      }
    }
  }
  .img-wrap {
    display: inline-block;
    position: relative;
    margin-left: 10px;
    &:nth-child(1) {
      margin-left: 0;
    }
  }
  .remove-img {
    position: absolute;
    top: 0px;
    right: 0px;
    cursor: pointer;
    background-color: rgba(255,255,255,.4);
  }
}
.app-preview-wrap {
  position: absolute;
  right: 0;
  top: 50%;
  transform:translate(-50%,-50%);
  transform-origin:50% 50%;
  font-family:PingFang-SC-Medium;
  h3 {
    font-size: 22px;
    font-weight: 400px;
    margin-bottom: 25px;
  }
  .app-preview {
    width: 291px;
    min-height: 518px;
    border: 4px solid #DFE1E6;
    border-radius: 20px;
    box-shadow:0px 8px 17px 0px rgba(65,73,79,0.15);
    header {
      height: 35px;
      background: url(/image/preview-head.png) no-repeat;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
    }
    .icon-wrapper {
      display: flex;
      font-family: PingFang-SC-Bold;
      margin-left: 17px;
      margin-top: 19px;
      p {
        font-size: 12px;
        color: #8A8A90;
        font-weight: 500;
        line-height: 15px;
        span {
          font-size: 12px;
          color: #8A8A90;
          font-weight: 500;
          line-height: 15px;
        }
      }
      img {
        width: 92px;
        height: 92px;
        margin-right: 10px;
        border-radius: 20px;
      }
      .icon-content {
        flex: 1;
      }
      .first {
        margin-bottom: 13px;
        font-size: 15px;
        color: #000;
        font-weight: bold;
      }
      
      .last {
        margin-top: 11px;
        display: flex;
        justify-content: space-between;
        button {
          width: 80px;
          height: 24px;
          background: #067AFE;
          border: none;
          border-radius: 12px;
          color: #fff;
          line-height: 24px;
          text-align: center;
        }
        div {
          display: inline-block;
          background: #067AFE;
          width: 24px;
          height: 24px;
          color: #fff;
          border-radius: 50%;
          font-size: 14px;
          font-weight: bold;
          line-height: 24px;
          text-align: center;
          margin-right: 21px;
        }
      }
    }
    .upload-img {
      width: 265px;
      margin: 15px auto 0;
      div {
        img {
          width: 132px;
        }
      }
    }
    .qrcode-wrap {
      margin-top: 70px;
      margin-bottom: 40px;
      text-align: center;
      p {
        margin-top: 17px;
        text-align: center;
        font-size: 13px;
        font-weight: 500;
        color: #000;
      }
    }
    footer {
      position: absolute;
      width: 283px;
      bottom: 0;
      height: 35px;
      background: #067AFE;
      background-size: 100% 100%;
      color: #fff;
      line-height: 35px;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      font-family:PingFang-SC-Medium;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
    }
  }
}
.app-modify-form {
  margin-left: 120px;
}
.btn-style-img {
  height: 80px;
  img {
    width: 100%;
    height: 80px;
  }
}
.ml120 {
  margin-left: 120px !important;
}
.minh700 {
  /deep/ .ivu-modal-body {
    min-height: 700px;
  }
}
.ivu-radio-wrapper {
  margin-left: 40px;
  &:nth-child(1) {
    margin-left: 0px;
  }
}
.btn-layer {
  margin: 20px;
  text-align: center;
  button {
    &:nth-child(2) {
      margin-left: 15px;
    }
  }
}
.tips-table {
  padding: 10px;
  width: 210px;
  word-break: break-all;
  word-wrap: break-word;
  white-space: normal;
  text-align: left;
}
.slot-label {
  display: inline-block;
  line-height: 22px;
  margin-top: -4px;
}
.scroll-layer {
  max-height: 750px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
