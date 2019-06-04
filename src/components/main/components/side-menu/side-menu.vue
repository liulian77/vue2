<template>
  <sn-menu :active-name="activeName" accordion width="siderWidth" ref="sideMenu">
    <sn-menu-item name="index" to="/index">
      <sn-icon type="dailishangshouye" :ex="true"/>概述
    </sn-menu-item>
    <sn-menu-item name="userInfo" to="/userInfo">
      <sn-icon type="media-dealer"/>账户设置
    </sn-menu-item>
    <sn-menu-item name="statistics" to="/statistics">
      <sn-icon type="count"/>统计
    </sn-menu-item>
    <hr class="menu-hr">
    <sn-search
      :width="200"
      showName="label"
      :pretext="'搜索应用'"
      :Level="true"
      :disabled="true"
      v-model="searchText"
      class="menu-search"
    />
    <div class="add-app-layer">
      <sn-button type="primary"  @click.native="uploadAppHandle(true)">
        <sn-icon type="drop-down" color="#fff" :size="15"></sn-icon>
        <span>发布应用</span>
      </sn-button>
    </div>
    
    <div class="app-list" v-if="appList" ref="appListMenu">
      <sn-menu-item
        :name="item._id"
        v-for="(item, index) in appList"
        :key="index"
        :to="{path: '/appInfo', query: {id: item._id}}"
      >
        <div>
          <img :src="`${domain.static}${item.icon}`" alt>
        </div>
        <div class="sec">
          <p>{{item.name}}</p>
          <p>
            <span>iOS</span>
          </p>
        </div>
      </sn-menu-item>
    </div>
	  <uploadApp :visible="updateAppModal" uploadBtnId="sideMenuUploadApp"  @visibleChange='visibleChange'></uploadApp>
    <sn-modal
      v-model="infoModal"
      :footer-hide="true"
      width="750"
      @on-visible-change="infoVisibleChange">
      <div class="info-item">
        <h3>服务使用条款</h3>
        <p>请在使用iOS 超级签名服务前，仔细阅读并充分理解以下内容及条款：</p>
        <ul>
          <li>
            <p>您知晓并同意，您提交给超级签名的App，不包括任何违反中国境内相关法律的内容，也不会用于违反中国境内相关法律的任何用途。否则，由此而出现的任何法律风险和后果，将由您自行全部承担；</p>
          </li>

          <li>
            <p>您知晓并同意，您并不会将超级签名所提供的任何一项服务用于违反中国相关法律的用途，否则，由此而出现的所有法律后果，将由您自行全部承担；</p>
          </li>
          <li>
            <p>您知晓并同意，我们只提供软件签名的技术，您购买此服务将仅用于您的 App 的内部测试之用途，不会用作 App 对外分发，且需符合苹果iOS 超级签名的所有规定，否则，因此而产生的法律后果由您自行全部承担；</p>
          </li>
          <li>
            <p>您知晓并同意，您没有向超级签名提交任何的虚假信息或材料，也没有故意隐瞒您的 App 中可能存在的违法内容。否则，由此出现的所有后果，将由您自行全部承担；</p>
          </li>
          <li>
            <p>您知晓并同意，苹果iOS 超级签名因受到苹果政策影响，在未来可能会存在被苹果撤销从而导致应用出现无法安装、或已经安装的应用无法打开等情况，您同意并愿意独立承担该风险以及该风险导致的的后续一切损失，并接受我们在后续可能为此而做出任何补偿等措施；</p>
          </li>
          <li>
            <p>您知晓并同意，您向我们提供的 App（手机应用程序）保证您拥有完整独立的知识产权，包括但不限于外观设计、著作权、文本，图形，徽标，按钮图标，图像，音频剪辑，且不会被用于未经许可的任何有关产品或服务；</p>
          </li>
          <li>
            <p>您知晓并同意，我们在需要时通过技术手段合法收集和使用有关您及您提供的App（手机应用程序）所使用本服务的技术性或诊断性信息，收集到的这些信息将用于改进我们的服务内容，提升我们的服务品质。我们不会将您的信息和内容分享或出售给其他的组织；</p>
          </li>
          <li>
            <p>我们作为第三方中立平台，不具有对您上传的 App 进行审查的义务，但我们在认为有需要时，我们有权利对您上传的内容进行审查，审查结果及审查后的进一步动作可由我们进行自行裁定。您对此表示理解并同意，并愿意承担因审查出现的全部后果；</p>
          </li>
        </ul>
        <p>您已仔细阅读并同意《超级签名服务协议》中的全部内容。</p>
        <p>点击“我同意”代表您已仔细阅读并同意以上所有内容。</p>
      </div>
      <div class="add-app-item tar">
        <sn-button class="mr10" @click.native="cancelToDeal">不同意</sn-button>
        <sn-button type="primary" @click.native="agreeToDeal">同意</sn-button>
      </div>
    </sn-modal>
  </sn-menu>
</template>
<script>
import { Dialog } from '_c/dialog'
import { baseUrl } from '@/common/config'
import { getMessage, postMessage } from '@/api/global'
import { debounce } from 'lodash'
import { api_global } from '@/api'
import fp from 'lodash/fp'
import { Icon, Search, Button, uploadApp } from '_c'
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
  Col,
  Row,
  InputNumber,
  Message
} from 'iview'
import { mapState, mapActions } from 'vuex'
import Emitter from '@/mixins/emitterOrigin'
import { localRead, localSave } from '@/libs/util'
const components = {
  'sn-icon': Icon,
  'sn-menu-item': MenuItem,
  'sn-search': Search,
  'sn-menu-group': MenuGroup,
  'sn-menu': Menu,
  'sn-step': Step,
  'sn-steps': Steps,
  Icon,
  'sn-modal': Modal,
  'sn-button': Button,
  'sn-upload': Upload,
  'sn-form': Form,
  'sn-form-item': FormItem,
  Dropdown,
  Progress,
  DropdownMenu,
  DropdownItem,
  Spin,
  Icon,
  Form,
  FormItem,
  Input,
  Col,
  Row,
  Button,
  uploadApp,
  InputNumber,
  Upload
}
let filterObj = {
  user_type: 1,
  row: 0,
  page: 1,
  username: '',
  fuzzy: 'name',
  name: ''
}
export default {
  name: 'sideMenu',
  mixins: [Emitter],
  components,
  data() {
    return {
      uploadUrlGet: '',
      updateAppModal: false,
      theme2: 'light',
      infoModal: false,
      type: 1,
      modalShow: false,
      appListUrl: '/apps.json',
      appListInfo: null,
      filterObj,
      searchText: '',
      // 当前是否正在提交表单
      appFormSubmitting: false,
      // 图片上传的接口
      uploadUrlGet: baseUrl + '/file/banner.json',
      addShowUrl: '',
      uploadList: [],
    }
  },
  props: {
    siderWidth: {
      String,
      default: '200px'
    }
  },
  filters: {
    dealPath(val) {
      return '/appInfo'
    }
  },
  methods: {
    ...mapActions('basic', ['iniAppList']),
    uploadAppHandle() {
      let val = localRead('infoModalShow');
      if (!val) {
        this.infoVisibleChange(true);
      } else {
        this.visibleChange(true);
      }
    },
    agreeToDeal() {
      localSave('infoModalShow', 'true');
      this.infoVisibleChange(false);
      this.visibleChange(true);
    },
    cancelToDeal() {
        this.infoVisibleChange(false);
    },
    // 上传应用
    visibleChange(val) {
      this.updateAppModal = val;
    },
    addImgUploadSuccess(res, file) {
      if (res.status === 200) {
        this.addShowUrl = res.url
        this.$refs['addImageUpload'].clearFiles()
        this.uploadList = this.$refs['addImageUpload'].fileList
      }
    },
    dropdownClick(name) {
      let pathname = ''
      if (name === 'wechat' || name === 'gdt') {
        pathname = name === 'wechat' ? 'wechatHome' : 'gdtHome'
        if (this.$router.currentRoute.name.indexOf(name) === -1) {
          this.$router.push({ name: pathname })
        }
      }
    },
    infoVisibleChange(val) {
      this.infoModal = val
    },
    async getAppList() {
      let options = {
        url: this.appListUrl,
        data: {
          page: this.filterObj.page,
          row: this.filterObj.row
        }
      }
      if (this.searchText !== '') {
        options.data.name = this.searchText
        options.data.fuzzy = this.filterObj.fuzzy
      }
      let res = await api_global.getMessage(options)
      this.appListInfo = res.aaData

      this.dispatch('app', 'getAppList', [res.aaData])
    }
  },
  computed: {
    ...mapState('basic', ['userinfo', 'menuType', 'showUploadApp', 'appList', 'domain'])
  },
  watch: {
    '$route.name': {
      handler(val) {
        this.activeName = val
      },
      immediate: true
    },

    searchText(val) {
      let data =  {
          page: this.filterObj.page,
          row: this.filterObj.row,
          sort_field: 'utime',
          sort_dir: 'desc'
        }
      if (this.searchText !== '') {
        data.name = this.searchText
        data.fuzzy = this.filterObj.fuzzy
      }
      this.iniAppList(data)
    }
  },
  created() {
    this.iniAppList()
  },
  activated() {
    this.iniAppList()
  }
}
</script>
<style lang="less" scoped>
.ivu-menu {
  padding-top:8px;
  background-color: transparent;
}
.ivu-menu-vertical {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.ivu-menu-vertical.ivu-menu-light:after {
  background: #fff;
}app-list
.ivu-menu-item > i {
  margin: -4px 18px 0 0;
}
.ivu-menu-vertical .ivu-menu-item,
.ivu-menu-vertical .ivu-menu-submenu-title {
  padding: 19px 30px;
}
.ivu-menu-vertical .ivu-menu-item:hover,
.ivu-menu-vertical .ivu-menu-submenu-title:hover {
  background: none;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: #f1f2f4;
  border: none;
  &:after {
    display: none;
  }
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #2198f0;
  }
}
.ivu-menu {
  color: #7f8fa4;
  .s-icon {
    color: #445363;
  }
  .ivu-menu-item .s-icon {
    transition: all 0.2s ease-in-out;
  }
  .ivu-menu-item:hover .s-icon {
    color: #2d8cf0;
    z-index: 2;
  }
  .menu-group-info {
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    height: 48px;
    line-height: 48px;
    padding-left: 28px;
    span {
      margin-left: 10px;
    }
    .icon-arrowdown {
      float: right;
      margin-right: 15px;
    }
  }
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  .s-icon {
    color: #2d8cf0;
    z-index: 2;
  }
}

/deep/ .ivu-menu-item-group-title {
  font-size: 14px;
  font-weight: 400;
  color: rgba(68, 83, 99, 1);
}
.ivu-dropdown-item {
  span {
    position: relative;
    top: -1px;
    margin-left: 10px;
  }
}
.menu-hr {
  width: 80%;
  height: 1px;
  margin: 0 auto;
  background: #f1f2f4;
  border: none;
}
.menu-search {
  margin-top: 25px;
  margin-left: 28px;
}
.new-app {
  margin-top: 20px;
  color: #298eff;
  font-size: 0;
  line-height: 20px;
  cursor: pointer;
  i {
    margin-left: 28px;
    margin-top: 2px;
    vertical-align: top;
  }
  span {
    font-size: 14px;
    margin-left: 18px;
  }
}

.w100 {
  width: 80px !important;
  border-radius: 5px;
}
.mr10 {
  margin-right: 10px;
}
.tar {
  text-align: right;
  margin-bottom: 10px;
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
.app-list {
  overflow: auto;
  flex: 1;
 
  img {
    width: 34px;
    margin-top: 4px;
    margin-right: 10px;
    border-radius: 50%;
  }
  .ivu-menu-item {
    display: flex;
    padding: 5px 30px;
    margin: 10px 0;
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

</style>

<style lang="less">
.search-box {
  border-radius: 18px !important;
  background-color: #f2f3f5 !important;
  border: none !important;
  i {
    color: #cdcfd4 !important;
    line-height: 18px !important;
  }
  input {
    border: none !important;
    background: none !important;
    color: #c5ccd4 !important;
  }
}
.add-app-layer {
    text-align: center;
    .s-btn-primary {
      width: 214px;
      height: 40px;
      border-radius: 5px;
      margin: 30px 0 40px 0;
      background: linear-gradient(90deg, #348ef1, #49afff);
      i {
        margin-right: 12px;
        line-height: 40px;
      }
    }
}
</style>

