<template>
  <sn-layout class="content">
    <sn-row class="header mtb0">
      <h1>账户资料
        <div class="error-info" v-if="panelInfo ? panelInfo.balance < 100 : false">余额不足，请尽快充值</div>
      </h1>
    </sn-row>
    <sn-row class="header">
      <sn-col span="16">
        <div class="main-card">
          <div slot="title" class="info-head">
            <div class="user-info">
              <div>
                <img src="/image/avatar.png" alt>
              </div>
              <div class="user-warpper">
                <h3 class>{{panelInfo ?panelInfo.username : ''}}</h3>
                <div>
                  <span>个人版</span>
                </div>
              </div>
            </div>
            <div class="balance-info">
              <div>
                <p class="balance-title">账户余额</p>
                <p class="balance">
                  {{panelInfo ? toRegularNum(panelInfo.balance) : 0}}
                  <span>元</span>
                </p>
              </div>
              <sn-button type="primary" class='z-charge' size="stretch" @click.native="withdraw">充值</sn-button>
            </div>
          </div>
          <sn-row class="footer">
            <div @click="todayInfo" class="today-info-wrap">
              <sn-col span="6">
                <div class="foot-content">
                  <p class="title">今日PV
                    <Poptip placement="bottom-start" trigger="hover">
                      <sn-icon type="explain" color="#ccc" :size="16" class="tips"></sn-icon>
                      <div class="tips-table" slot="content">
                       今日PV：1天（00:00-24:00）之内，每打开一次下载页，记录1个PV，一天内同一用户多次打开同一页面PV计算多次。
                      </div>
                    </Poptip>
                  </p>
                  <p class="result">{{panelInfo ? (panelInfo.report.now.pv?panelInfo.report.now.pv:0) : 0}}</p>
                  <p class="small">
                    昨日：{{panelInfo ? (panelInfo.report.pre.pv?panelInfo.report.pre.pv:0) : 0}}
                    <span
                      :class="pvRateShowClass"
                    >{{pvRateShow}}</span>
                  </p>
                </div>
              </sn-col>
              <sn-col span="6">
                <div class="foot-content">
                  <p class="title">今日UV
                    <Poptip placement="bottom-start" trigger="hover">
                      <sn-icon type="explain" color="#ccc" :size="16" class="tips"></sn-icon>
                      <div class="tips-table" slot="content">
                        UV值：1天（00:00-24:00）之内，访问下载页的不重复用户数（以浏览器cookie为依据），一天内同一访客多次访问下载页只被计算1次。
                      </div>
                    </Poptip>
                  </p>
                  <p class="result">{{panelInfo ? (panelInfo.report.now.uv?panelInfo.report.now.uv:0) : 0}}</p>
                  <p class="small">
                    昨日：{{panelInfo ? (panelInfo.report.pre.uv?panelInfo.report.pre.uv:0) : 0}}
                    <span
                      :class="uvRateShowClass"
                    >{{uvRateShow}}</span>
                  </p>
                </div>
              </sn-col>
              <sn-col span="6">
                <div class="foot-content">
                  <p class="title">今日IP
                    <Poptip placement="bottom-start" trigger="hover">
                      <sn-icon type="explain" color="#ccc" :size="16" class="tips"></sn-icon>
                      <div class="tips-table" slot="content">
                        IP值：1天（00:00-24:00）之内，访问下载页的不重复IP数。一天内相同IP地址多次访问下载页只被计算1次。
                      </div>
                    </Poptip>
                  </p>
                  <p class="result">{{panelInfo ? (panelInfo.report.now.ip?panelInfo.report.now.ip:0) : 0}}</p>
                  <p class="small">
                    昨日：{{panelInfo ? (panelInfo.report.pre.ip?panelInfo.report.pre.ip:0): 0}}
                    <span
                      :class="ipRateShowClass"
                    >{{ipRateShow}}</span>
                  </p>
                </div>
              </sn-col>
              <sn-col span="6">
                <div class="foot-content no-border">
                  <p class="title">今日下载
                    <Poptip placement="bottom-start" trigger="hover">
                      <sn-icon type="explain" color="#ccc" :size="16" class="tips"></sn-icon>
                      <div class="tips-table" slot="content">
                        今日下载：1天（00:00-24:00）之内，每下载一次应用，记录1个下载，一天内同一用户多次下载同一应用，下载数只被记录1次。
                      </div>
                    </Poptip>
                  </p>
                  <p class="result">{{panelInfo ?( panelInfo.report.now.count ?  panelInfo.report.now.count : 0) :0}}</p>
                  <p class="small">
                    昨日：{{panelInfo?(panelInfo.report.pre.count ? panelInfo.report.pre.count:0 ):0}}
                    <span
                      :class="countRateShowClass"
                    >{{countRateShow}}</span>
                  </p>
                </div>
              </sn-col>
            </div>
            
          </sn-row>
        </div>
      </sn-col>
      <sn-col span="8">
        <div class="container">
          <sn-row>
            <sn-col span="24">
              <sn-row class="mini-card" @click.native="goto_userinfo">
                <sn-col class="card-icon" span="6">
                  <img src="/image/notes.png" alt>
                </sn-col>
                <sn-col span="18" class="card-content">
                  <p class="title">基本信息</p>
                  <p class="content">查看和修改账户的基本资料</p>
                </sn-col>
              </sn-row>
            </sn-col>
          </sn-row>
          <sn-row>
            <sn-col span="24">
              <sn-row class="mini-card" @click.native="goto_financial">
                <sn-col class="card-icon" span="6">
                  <img src="/image/banknote.png" alt>
                </sn-col>
                <sn-col span="18" class="card-content">
                  <p class="title">财务信息</p>
                  <p class="content">查看消费记录和充值记录</p>
                </sn-col>
              </sn-row>
            </sn-col>
          </sn-row>
        </div>
      </sn-col>
    </sn-row>
    <sn-row class="header mt10">
      <h1>常用应用</h1>
    </sn-row>
    <sn-content ref="tableContent" class="header mt20 mb40 tab-content">
      <sn-table
        v-if="!isMobile"
        :height="tableHeight"
        :columns="columns"
        :data="tableData"
        :loading="loading"
        @on-sort-change="handleSortChange"
        ref="table"
        class="index-table"
      >
        <!--optype before after-->
        <template slot-scope="{row}" slot="optype">
          <div class="plr5">
            <p v-for="(item,key) in row.optype" :key="key">{{item}}</p>
          </div>
        </template>
        <template slot-scope="{row}" slot="before">
          <div class="plr5">
            <p v-for="(item,key) in row.before" :key="key">{{item.name}} : {{item.value}}</p>
          </div>
        </template>
        <template slot-scope="{row}" slot="after">
          <div class="plr5">
            <p v-for="(item,key) in row.after" :key="key">{{item.name}} : {{item.value}}</p>
          </div>
        </template>
        <template slot-scope="{row}" slot="action">
          <sn-button type="primary" size="stretch" @click.native="modifyRow(row)">修改</sn-button>
          <sn-button size="stretch" class="del" @click.native="delRow(row)" v-if="row.status === 0">删除</sn-button>
        </template>
        <template slot-scope="{row}" slot="status">
          <i-switch
            class="s-table-switch-disabled"
            :row-data="row"
            :true-value="1"
            :false-value="0"
            :beforeChange="switchBeforeChange"
            @on-change="changeStatus({val:$event,data:row})"
            v-model="row.status"
            :loading="switchLoadingArr.indexOf(row._id) !== -1"
          ></i-switch>
        </template>
        <template slot-scope="{row}" slot="name">
          <div class="hand" @click="toApp(row)">
            <div>
              <img :src="`${domain.static}${row.icon}`" alt>
            </div>
            <div class="sec">
              <p>{{row.name}}</p>
              <p>
                <span>iOS</span>
              </p>
            </div>
          </div>
        </template>
        <template slot-scope="{row}" slot="version">
          <div class="hand" @click="toApp(row)">{{row.version}}</div>
        </template>
        <template slot-scope="{row}" slot="utime">
          <div class="hand" @click="toApp(row)">{{formatTime(row.utime * 1000)}}</div>
        </template>
      </sn-table>
      <sn-page
        :total="totalCount"
        :current="filterObj.page"
        :page-size="filterObj.row"
        show-sizer
        show-elevator
        show-total
        placement="bottom"
        @on-change="handleChangePage"
        class="page"
        @on-page-size-change="handleChangeSizePage"
      ></sn-page>
    </sn-content>
    <sn-recharge :visible="modal" @visibleChange="visibleChange"></sn-recharge>
    <sn-modal
      :footer-hide="true"
      v-model="isShow"
      class-name="vertical-center-modal"
      width="750"
      title="修改信息"
      :styles="{top: '20px'}"
      @on-visible-change="qualificationVisibleChange"
    >
      <div class="scroll-layer">
        <div class="loading-wrap" v-if="loading">
          <Loading :visible="loading" class="loading"></Loading>
        </div>
        <template v-if="detailInfo && !loading">
          <div class="icon-wrapper">
            <div class="add-zimg">
              <img :src="`${domain.static}${detailInfo.icon}`" alt>
            </div>
            <div>
              <p class="first">{{detailInfo.name}}</p>
              <p>
                <span>版本： {{detailInfo.version}}</span>
              </p>
              <p>
                <span>大小： {{sizeShow}}</span>
              </p>
            </div>
          </div>
          <sn-form
            ref="formValidate"
            :model="detailInfo"
            :rules="ruleValidate"
            :label-width="150"
            @submit.native.prevent
          >
            <sn-form-item label="下载单价" prop="price" key="price">
              <sn-input size="large" v-model="detailInfo.price" placeholder="请输入下载单价" disabled class="w400"/>
            </sn-form-item>
            <sn-form-item label="主页地址" prop="host" key="host">
              <sn-input size="large" v-model="detailInfo.host" placeholder="自定义主页地址" class="w200"/>
              <span>{{domain.domain}}</span>
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
              <!-- <i-switch
              v-model="detailInfo.has_push"
              :true-value="1"
              :false-value="0"></i-switch>
              <span style="margin-left: 10px;">消息推送可提高用户活跃度及应用留存率</span> -->
              <sn-select
                class="mr10"
                placeholder="请选择"
                v-model="detailInfo.has_push"
              >
                <sn-option value="1">推送</sn-option>
                <sn-option value="0">不推送</sn-option>
              </sn-select>
            </sn-form-item>
            <sn-form-item prop="app_class" key="app_class">
              <!-- <sn-input size="large" v-model="detailInfo.app_class" placeholder="请输入类别，如：直播，视频，游戏（棋牌、战争策略、仙侠等）" class="w400"/> -->
              <div slot="label" class="slot-label">应用类别
                <Poptip placement="bottom-start" trigger="hover">
                  <sn-icon type="explain" color="#ccc" :size="16" class="tips"></sn-icon>
                  <div class="tips-table" slot="content">
                    您想要展示给用户的应用类别
                  </div>
                </Poptip>
              </div>
              <sn-select
                class="mr10"
                placeholder="选择类别"
                v-model="detailInfo.app_class"
              >
                <sn-option v-for="(item,idx) in appClasslist" :label="item.txt" :value="item.value" :key="idx"></sn-option>
              </sn-select>
              <!-- <scroll-select class="mr10 flr"  v-model="detailInfo.app_class" :list="appClasslist"  name="value" label="txt" :image="false" :showAll="false" placeholder="选择类别"></scroll-select> -->
            </sn-form-item>
            <sn-form-item label="应用简介" prop="desc" v-if="false" key="desc">
              <sn-input size="large" v-model="detailInfo.desc" :maxlength="15" placeholder="15字以内" class="w400"/>
            </sn-form-item>
            <sn-form-item prop="basedown" key="basedown">
              <div slot="label" class="slot-label">评分数显示
                <Poptip placement="bottom-start" trigger="hover">
                  <sn-icon type="explain" color="#ccc" :size="16" class="tips"></sn-icon>
                  <div class="tips-table" slot="content">
                    您想要展示给用户的评分数量，没有具体评价内容且分数固定为4.9分，您只需填写一个看似真实的评价数展示给用户，表现您的应用已有如此多的下载量。
                  </div>
                </Poptip>
              </div>
              <sn-input
                size="large"
                v-model="detailInfo.basedown"
                placeholder="请输入评分数显示"
                type="number"
              />
            </sn-form-item>
            <sn-form-item prop="info" key="info">
              <div slot="label" class="slot-label">应用介绍
                <Poptip placement="bottom-start" trigger="hover">
                  <sn-icon type="explain" color="#ccc" :size="16" class="tips"></sn-icon>
                  <div class="tips-table" slot="content">
                    您想要展示给用户对此应用的详细介绍
                  </div>
                </Poptip>
              </div>
              <sn-input type="textarea" class="w360 z-text"  :maxlength="5000" placeholder="应用详细介绍，5000字以内" v-model="detailInfo.info"></sn-input>
            </sn-form-item>
            <sn-form-item label="详情图" prop="detail_img">
              <div class="upload-img" v-if="detailInfo.detail_img.length" :style="imgStyle">
                <div :style="imgCss">
                  <div class="img-wrap" v-for="(item,index) in detailInfo.detail_img" :style="imgStyle" :key="index" >
                    <img :src="domain.static+ item" :style="imgStyle"  alt>
                    <sn-icon type="close" :size="20" class="remove-img" @click="removeImg(index)"></sn-icon>
                  </div>
                </div>
              </div>
              <sn-upload
                :action="uploadUrlGet"
                :show-upload-list="false"
                :before-upload="handleUpload"
                :on-success="addImgUploadSuccess"
                ref="addImageUpload"
                :multiple="true"
                :format="['jpg','jpeg','png']"
                name="file"
              >
                <sn-button type="primary" :disabled="detailInfo.detail_img.length === 5" size="stretch" class="w100">上传{{detailInfo.detail_img.length}}/5</sn-button>
              </sn-upload>
              <p>{{descInfo}}</p>
              <sn-upload-bar
                v-if="uploadList.length && uploadList[0].status !== 'finished'"
                :class="false?'visible':''"
                :per="uploadList.length ? uploadList[0].percentage : 0"
                :name="uploadList[0].name"
              ></sn-upload-bar>
            </sn-form-item>
            <sn-form-item class="submit-box mb0">
              <sn-button
                type="primary"
                class="primary"
                @click.native="handleNextSubmit('formValidate')"
              >保存</sn-button>
            </sn-form-item>
          </sn-form>
        </template>
      </div>
    </sn-modal>
  </sn-layout>
</template>

<script>
import {
  Button,
  Icon,
  Switch,
  scrollSelect,
  SnPage,
  Input,
  TableExpand,
  Recharge,
  FormItem,
  Form,
  Select,
  Option,
  uploadBar,
  Search
} from "_c";
import { mapState, mapActions } from "vuex";
import {
  Layout,
  Content,
  Header,
  Modal,
  Table,
  Row,
  Col,
  Card,
  LoadingBar,
  Upload,
  Avatar,
  Message
} from "iview";
import Poptip from "_c/poptip";
import { Dialog } from "_c/dialog";
import { tableMixin } from "@/mixins";
import { deepCopy } from "@/utils/assist";
import { formatTime, toRegularNum } from "@/mixins/globalMixin";
import { api_global } from "@/api";
import { async } from "q";
import { baseUrl } from "@/common/config";
import fetch from '@/common/fetch'

const components = {
  "sn-table": Table,
  "sn-icon": Icon,
  "sn-button": Button,
  "sn-layout": Layout,
  "sn-content": Content,
  "sn-header": Header,
  "sn-select": Select,
  "sn-option": Option,
  "sn-modal": Modal,
  "i-switch": Switch,
  'scroll-select':scrollSelect,
  "sn-page": SnPage,
  "sn-search": Search,
  "sn-input": Input,
  "sn-row": Row,
  "sn-col": Col,
  "sn-form": Form,
  "sn-form-item": FormItem,
  "sn-card": Card,
  "sn-upload": Upload,
  "sn-upload-bar": uploadBar,
  "sn-recharge": Recharge,
  Avatar,
  Poptip,
  TableExpand,
};
let filterObj = {
  operator: "",
  beeditor: "",
  limit: "",
  sort_field: 'utime',
  sort_dir: 'desc',
  row: 10,
  page: 1
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
  {"value":"儿童游戏","txt":"儿童游戏"},
  {"value":"角色扮演","txt":"角色扮演"},
  {"value":"竞速游戏","txt":"竞速游戏"},
  {"value":"聚会游戏","txt":"聚会游戏"},
  {"value":"卡牌游戏","txt":"卡牌游戏"},
  {"value":"冒险游戏","txt":"冒险游戏"},
  {"value":"模拟游戏","txt":"模拟游戏"},
  {"value":"日月游戏","txt":"日月游戏"},
  {"value":"文字游戏","txt":"文字游戏"},
  {"value":"问答游戏","txt":"问答游戏"},
  {"value":"休闲游戏","txt":"休闲游戏"},
  {"value":"益智解谜","txt":"益智解谜"},
  {"value":"音乐游戏","txt":"音乐游戏"},
  {"value":"桌面游戏","txt":"桌面游戏"}
];
export default {
  name: "Index",
  components,
  mixins: [tableMixin],
  data() {
    let self=this;
    return {
      modal: false,
      changeStatusUrl: "/apps/changestatus.json",
      filterObj: deepCopy(filterObj),
      appClasslist,
      columns: [
          {
              title: "应用名称",
              slot: "name"
          },
          {
              title: "版本",
              key: "version",
              slot: 'version'
          },
          {
              title: "下载地址",
              key: "urlschemes",
              render: (h, { row }) => {
                  let self=this;
                  return h("a", {
                      domProps: {
                          href: "https://" + row.host + self.domain.domain,
                          innerHTML:'https://' +  row.host + self.domain.domain,
                          target: 'blank'
                      }
                  });
              }
          },
          {
              title: "创建时间",
              key: "utime",
              slot: 'utime'
          },
          {
              title: "上架状态",
              slot: "status"
          },
          {
              title: "操作",
              slot: "action"
          }
      ],
      imgWidth: 0,
      imgHeight: 0,
      tableData: [],
      isShow: false,
      addShowUrl: [],
      detailInfo: null,
      uploadUrlGet: baseUrl + "/file/banner.json",
      loading: false,
      appDetailUrl: "/apps.json",
      tableHeight: 0,
      getUrl: "/apps.json",
      panelUrl: "/home.json",
      panelInfo: null,
      uploadList: [],
      isFuzzy: true,
      fuzzyDel: ["page", "row", 'status'],
      ruleValidate: {
        host: [
          {
            required: true,
            pattern: /^[0-9a-zA-z]{2,10}$/,
            message: "请输入主页主页地址只能由2-10位字母或数字组成地址",
            trigger: "blur"
          }
        ],
        desc: [
          {
            required: true,
            message: "请输入应用简介",
            trigger: "blur"
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
        detail_img: [
          {
            message: '请上传2-5张图片',
            validator: (rul, value, callback) => {
              if (value.length && (value.length < 2 ||  value.length > 5)) {
                callback(new Error(`请上传2-5张图片`));
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ],
        info: [
          {
            required: true,
            message: "请输应用介绍",
          },
          {
            max: 5000,
            message: '最大输入长度为5000'
          }
        ],
        basedown: [
          {
            required: true,
            message: "评分数显示范围0-100,000",
            pattern: /^(?!00)(?:[0-9]{1,5}|100000)$/,
            trigger: "blur"
          }
        ]
      },
      // 正在操作的状态开关
      switchLoadingArr: []
    };
  },
  computed: {
    ...mapState('basic',['domain']),
    imgCss() {
      if(this.detailInfo && this.detailInfo.detail_img.length) {
        return {
          width: this.detailInfo.detail_img.length * 165 + 'px'
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
    sizeShow() {
      if (this.detailInfo) {
        if (this.detailInfo.size) {
          return (this.detailInfo.size / 1024 / 1024).toFixed(1) + "M";
        } else {
          return "0M";
        }
      } else {
        return "0M";
      }
    },
    pvRateShow() {
      if (this.panelInfo) {
        if (this.panelInfo.report.now.pv_rate) {
          return `${this.panelInfo.report.now.pv_rate > 0 ? '+' : ''}${toRegularNum(this.panelInfo.report.now.pv_rate * 100,2)}%`;
        } else {
          return "-";
        }
      } else {
        return "-";
      }
    },
    pvRateShowClass() {
      if (this.panelInfo) {
        if (this.panelInfo.report.now.pv_rate) {
          if (this.panelInfo.report.now.pv_rate > 0) {
            return "green";
          } else {
            return "red";
          }
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    uvRateShow() {
      if (this.panelInfo) {
        if (this.panelInfo.report.now.uv_rate) {
          return `${this.panelInfo.report.now.uv_rate > 0 ? '+' : ''}${toRegularNum(this.panelInfo.report.now.uv_rate * 100,2)}%`;
        } else {
          return "-";
        }
      } else {
        return "-";
      }
    },
    uvRateShowClass() {
      if (this.panelInfo) {
        if (this.panelInfo.report.now.uv_rate) {
          if (this.panelInfo.report.now.uv_rate > 0) {
            return "green";
          } else {
            return "red";
          }
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    ipRateShow() {
      if (this.panelInfo) {
        if (this.panelInfo.report.now.ip_rate) {
          return `${this.panelInfo.report.now.ip_rate > 0 ? '+' : ''}${toRegularNum(this.panelInfo.report.now.ip_rate * 100,2)}%`;
        } else {
          return "-";
        }
      } else {
        return "-";
      }
    },
    ipRateShowClass() {
      if (this.panelInfo) {
        if (this.panelInfo.report.now.ip_rate) {
          if (this.panelInfo.report.now.ip_rate > 0) {
            return "green";
          } else {
            return "red";
          }
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    countRateShow() {
      if (this.panelInfo) {
        if (this.panelInfo.report.now.count_rate) {
          return `${this.panelInfo.report.now.count_rate > 0 ? '+' : ''}${toRegularNum(this.panelInfo.report.now.count_rate * 100, 2)}%`;
        } else {
          return "-";
        }
      } else {
        return "-";
      }
    },
    countRateShowClass() {
      if (this.panelInfo) {
        if (this.panelInfo.report.now.count_rate) {
          if (this.panelInfo.report.now.count_rate > 0) {
            return "green";
          } else {
            return "red";
          }
        } else {
          return "";
        }
      } else {
        return "";
      }
    }
  },
  methods: {
    ...mapActions("basic", ["AutoLogin", 'iniAppList']),
    toRegularNum,
    formatTime,
    dealBefore(val, row) {
      let self = this;
      return new Promise((resolve,reject) => {
        let str = '账户余额不足，请确保充足余额后再上架';
        if (!val) {
          str = '下架后用户将无法打开您的应用下载页，确认下架吗？';
          Dialog({
            type: "default",
            text: str,
            confirmTxt: '确认下架',
            onConfirm() {
              resolve(true);
            },
            onCancel() {
              resolve(false);
            }
          });
        } else {
          if (self.panelInfo.balance < row.price) {
            Dialog({
              type: "default",
              text: str,
              confirmTxt: '充值',
              onConfirm() {
                resolve(false);
                self.withdraw();
              },
              onCancel() {
                resolve(false);
              }
            });
          } else {
            resolve(true);
          }
        }
      })
    },
    switchBeforeChange(val, row) {
      return new Promise((resolve, reject) => {
        this.dealBefore(val, row)
          .then(res => resolve(res))
          .catch(err => reject(false))
      }) 
    },
    qualificationVisibleChange(val) {
      this.isShow = val;
      if (!val) {
        this.detailInfo = null;
      }
    },
    async changeStatus({val,data}) {
      this.switchLoadingArr.push(data._id);
      console.log('change',{val,data})
      LoadingBar.start();
      try {
          await api_global.postMessage({
            url: this.changeStatusUrl,
            noDialog: true,
            data: {
              _id: data._id,
              status: val
            }
          })
          let self = this;
          data.status = val;
          Message.success('操作成功');
      } catch(e){
        Message.warning(e.data.msg);
        this.getTableData();
      } finally {
        LoadingBar.finish();
        this.switchLoadingArr = this.switchLoadingArr.filter(item=>{item._id !== data._id});
      }
    },
    visibleChange(val) {
      this.modal = val;
      if (!val) {
        this.getPanelInfo();
      }
    },
    withdraw() {
      this.modal = true;
    },
    goto_financial() {
      this.$router.push({ name: "financialInfo" });
    },
    goto_userinfo() {
      this.$router.push({ name: "baseInfo" });
    },
    async getPanelInfo() {
      let options = {
        url: this.panelUrl
      };
      let res = await api_global.getMessage(options);
      this.panelInfo = deepCopy(res);
    },
    async modifyRow(row) {
      let options = {
        url: this.appDetailUrl,
        data: {
          _id: row._id
        }
      };
      let self = this;
      this.isShow = true;
      this.loading = true;
      let res = await api_global.getMessage(options);
      try {
        res.info = res.info.replace(/&amp;/g, '&').replace(/&amp;/g, '&')
                          .replace(/&quot;/g, '\"')
                          .replace(/&lt;/g, "<")
                          .replace(/&gt;/g, ">")
                          .replace(/&hellip;/g, '…')
                          .replace(/&mdash;/g, '—')
                          .replace(/&ldquo;/g, '“')
                          .replace(/&rdquo;/g, '”')
                          .replace(/&rsquo;/g, '’')
                          .replace(/&lsquo;/g, '‘')
                          .replace(/&middot;/g, '·');
        res.desc = res.desc.replace(/&amp;/g, '&').replace(/&amp;/g, '&')
                          .replace(/&quot;/g, '\"')
                          .replace(/&lt;/g, "<")
                          .replace(/&gt;/g, ">")
                          .replace(/&hellip;/g, '…')
                          .replace(/&mdash;/g, '—')
                          .replace(/&ldquo;/g, '“')
                          .replace(/&rdquo;/g, '”')
                          .replace(/&rsquo;/g, '’')
                          .replace(/&lsquo;/g, '‘')
                          .replace(/&middot;/g, '·');
      } catch (error) {
      }
      
      this.detailInfo = deepCopy(res);
      if (this.detailInfo.has_push !== undefined) {
        this.detailInfo.has_push += '';
      }
      if (!res.detail_img) {
        this.$set(this.detailInfo, 'detail_img', []);
        this.imgWidth = 0;
        this.imgHeight = 0;
      }
      if (this.detailInfo.detail_img.length) {
        let img = new Image();
        img.src = this.domain.static + this.detailInfo.detail_img[0];
        img.onload = function() {
          if (this.width === 1920) {
            self.imgWidth = 1920;
            self.imgHeight = 1080;
          } else if(this.width === 1080){
            self.imgWidth = 1080;
            self.imgHeight = 1920;
          } else if (this.width === 2208) {
            self.imgWidth = 2208;
            self.imgHeight = 1242;
          } else {
            self.imgWidth = 1242;
            self.imgHeight = 2208;
          }
        }
      } else {
        this.imgWidth = 0;
        this.imgHeight = 0;
      }
      this.loading = false;
      this.$nextTick(() => {
        self.uploadList = self.$refs["addImageUpload"].fileList;
      });
    },
    delRow(row) {
      let self = this;
      Dialog({
        type: "error",
        text: "是否删除这个应用？",
        async onConfirm() {
          let res = await fetch({
            method: 'PUT',
            url: '/apps/changestatus.json' + `?id=${row._id}`,
            data: {id: row._id, status: -1}
          });
          Message.success('操作成功');
          self.qualificationVisibleChange(false);
          self.getTableData();
          self.iniAppList();
        },
        onCancel() {
          self.qualificationVisibleChange(false);
        }
      });


    },
    addImgUploadSuccess(res, file) {
      if (res.status === 200) {
        if (this.detailInfo.detail_img.length < 5) {
          this.detailInfo.detail_img.push(res.url);
          this.detailInfo.banner = res.url;
        }
        // this.$refs["addImageUpload"].clearFiles();
        // this.uploadList = this.$refs["addImageUpload"].fileList;
      }
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
    handleNextSubmit() {
      let self = this;
      this.$refs["formValidate"].validate(async valid => {
        if (valid) {
          let obj = {
            host: self.detailInfo.host,
            // banner: self.detailInfo.banner,
            // desc: self.detailInfo.desc,
            basedown: self.detailInfo.basedown,
            info: self.detailInfo.info
                          .replace(/</g, "&lt;")
                          .replace(/>/g, "&gt;")
                          .replace(/…/g, '&hellip;')
                          .replace(/—/g, '&mdash;')
                          .replace(/“/g, '&ldquo;')
                          .replace(/”/g, '&rdquo;')
                          .replace(/’/g, '&rsquo;')
                          .replace(/‘/g, '&lsquo;')
                          .replace(/·/g, '&middot;'),
            _id: self.detailInfo._id,
            has_push: self.detailInfo.has_push,
            app_class: self.detailInfo.app_class,
            detail_img: this.detailInfo.detail_img
          };
          let options = {
            url: this.appDetailUrl,
            data: obj
          };
          // await api_global.postMessage(options);
          // await put(obj);
          let res = await fetch({
            method: 'PUT',
            url: this.appDetailUrl,
            data: obj
          });
          Message.success('操作成功');
           self.qualificationVisibleChange(false);
              self.getTableData();
          // Dialog({
          //   type: "default",
          //   text: "操作成功",
          //   cancel: false,
          //   onConfirm() {
          //     self.qualificationVisibleChange(false);
          //     self.getTableData();
          //   },
          //   onCancel() {
          //     self.qualificationVisibleChange(false);
          //     self.getTableData();
          //   }
          // });
        }
      });
    },
    toApp(row) {
      this.$router.push({path: '/appInfo', query: {id: row._id}});
    },
    removeImg(index) {
      let arr = deepCopy(this.detailInfo.detail_img);
      arr.splice(index, 1);
      if (!arr.length) {
        this.imgWidth = 0;
        this.imgHeight = 0;
      }
      this.$set(this.detailInfo, 'detail_img', arr);
    },
    todayInfo() {
      this.$router.push({name: 'statistics'})
    }
  },
  created() {
    this.getPanelInfo();
  },
  activated() {
    console.log(111);
    this.getPanelInfo();
    this.AutoLogin();
  }
};
</script>

<style lang="less" scoped>

.content {
  padding: 15px 15px 0;
  .mt20 {
    margin-top: 20px;
  }
  .mtb0 {
    margin-top: 0;
    margin-bottom: 5px;
  }
  .mt10 {
    margin-top: 10px;
  }
  .mb40 {
    margin-bottom: 40px;
  }
  .header {
    padding: 0 15px;
    .card {
      display: flex;
      font-size: 0;
      i {
        width: 40px;
        line-height: 70px;
        margin: 0 10px;
      }
      .info {
        font-size: 14px;
        display: flex;
        flex-direction: column;
        p {
          color: #9e9e9e;
          margin-top: 5px;
        }
        .main {
          color: #333;
          font-size: 16px;
          margin-top: 10px;
        }
      }
      &:hover {
        background: #fff;
        box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      }
    }
    h1 {
      color: #5a5959;
      margin-bottom: 5px;
      font-size: 16px;
      text-transform: none;
      font-weight: 400;
      padding: 0;
      .error-info {
        position: relative;
        font-size: 14px;
        margin-left: 7px;
        display: inline-block;
        color: #fff;
        padding: 0 5px;
        background: #D73E36;
        &:before {
          content: '';
          border: 5px solid transparent;
          border-width: 5px;
          border-right: 8px solid #D73E36;
          width: 0;
          height: 0;
          position: absolute;
          left: -13px;
          top: 5px;
        }
      }
    }
    .main-card {
      background: #fff;
      box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
      border-radius: 5px;
      height: 319px;
      .info-head {
        background: #f5f6f8;
        padding: 68px 15px 0;
        height: 57.3%;
        display: flex;
        justify-content: space-between;
        .user-info {
          display: flex;
          img {
            margin: 0 15px;
            margin-left: 36px;
          }
          .user-warpper {
            width: 190px;
            h3 {
              font-size: 18px;
              margin-top: 15px;
              color: #5a5959;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-weight: 400;
            }
          }
        }
        .balance-info {
          display: flex;
          margin-right: 15px;
          button {
            margin-top: 29px;
            margin-left: 20px;
            margin-right: 10px;
          }
          .balance-title {
            color: #9e9e9e;
            font-size: 13px;
          }
          .balance {
            font-size: 30px;
            span {
              font-size: 13px;
            }
          }
        }
      }
      .footer {
        height: 42.7%;
        .ivu-col {
          height: 100%;
          .foot-content {
            margin: 13px 40px;
            padding: 5%;
            p {
              color: #5a5959;
            }
            .result {
              font-size: 26px;
              color: #45474a;
            }
            .small {
              color: #9e9e9e;
              font-size: 12px;
              margin-bottom: 2px;
              span {
                font-size: 10px;
                margin-left: 3px;
              }
              .red {
                color: #f72c2c;
              }
              .green {
                color: #38ba14;
              }
            }
            .title {
              color: #9e9e9e;
              margin-bottom: 4px;
            }
          }
          .no-border {
            border: none;
          }
        }
      }
    }
    .container {
      padding-left: 15px;
      .mini-card {
        margin-bottom: 15px;
        margin-left: 15px;
        height: 152px;
        border: 1px solid #e8e8e8;
        background: #fff;
        box-shadow: 0 1px 3px rgba(33, 33, 33, 0.2);
        border-radius: 5px;
        cursor: pointer;
        .card-icon {
          background: #f5f6f8;
          height: 100%;
          text-align: center;
          margin: auto;
          line-height: 152px;
        }
        .card-content {
          color: #9e9e9e;
          p {
            margin: 0 0 10px;
          }
          .title {
            font-size: 16px;
            margin-top: 30px;
            padding: 0px 15px 0;
            color: #5a5959;
          }
          .content {
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .tab-content {
    /deep/ .ivu-table {
      th {
        background-color: #F4F5F7 !important;
        height: 60px !important;
        span {
          color: #ADB1B6;
          font-weight: normal;
        }
      }
      td {
        border-bottom: 1px solid #f2f3f5;
      }
    }
  }
}
/deep/ .s-btn-primary {
  background: linear-gradient(90deg, #348ef1, #49afff);
  min-width: 70px;
  border-radius: 5px;
  &[disabled] {
    color: #c5c8ce;
    background-color: #f7f7f7 !important; 
    border-color: #dcdee2;
    cursor: not-allowed;
  }
}
/deep/ .s-btn-default {
  border-radius: 5px;
  min-width: 70px;
}
.icon-wrapper {
  display: flex;
  margin-left: 212px;
  margin-bottom: 20px;
  img {
    width: 90px;
    margin-right: 10px;
  }
  .first {
    margin-bottom: 13px;
  }
  p {
    font-size: 16px;
    span {
      color: #adb1b6;
      font-size: 14px;
    }
  }
}
.upload-img {
  border-radius: 2px;
  height: 130px;
  overflow-x: auto;
  overflow-y: hidden;
  div {
    img {
      width: 155px;
      height: 130px;
      margin-left: 10px;
    }
  }
  .img-wrap {
    display: inline-block;
    position: relative;
  }
  .remove-img {
    position: absolute;
    top: 0px;
    right: 0px;
    cursor: pointer;
    background-color: rgba(255,255,255,.4);
  }
}

.index-table .ivu-table-overflowY {
  overflow: visible;
}
.loading-wrap {
  text-align: center;
  margin: 40px;
}
.hand {
  cursor: pointer;
  display: flex;
  img {
    width: 34px;
    margin-top: 4px;
    margin-right: 10px;
    border-radius: 50%;
  }
  .sec {
    margin-top: 3px;
  }

  p {
    color: #6f7378;
    font-size: 16px;
    line-height: 18px;
    span {
      font-size: 14px;
      color: #999a9e;
    }
  }
}
.w200 {
  width: 200px;
}
.del {
  margin-left: 5px;
}

.z-charge {
  height: 32px;
  line-height: 32px;
}
.add-zimg img {
  width: 92px;
  height: 92px;
  border-radius: 15px;
}
.ivu-form-item {
  margin-bottom: 20px !important;
}
.ivu-form-label-right {
  position: relative;
  left: -50px;
}
.today-info-wrap {
  cursor: pointer;
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
}
.scroll-layer {
  max-height: 750px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
