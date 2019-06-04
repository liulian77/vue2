<template>
  <Card class="data-report" :dis-hover="true" label-position="left">
    <div class="flex">
      <Form
        :label-width="169"
        class="form"
        ref="formValidate"
        :model="info"
        :rules="rules"
        @submit.native.prevent
      >
        <FormItem label="启动上报地址" prop="turl">
          <span>https://</span>
          <Input style="width:260px;top: -2px;" v-model="info.turl" :maxlength="255"/>
        </FormItem>
        <FormItem>
          <div slot="label" class="slot-label">
            下载区域黑名单
            <Poptip placement="bottom-start" trigger="hover">
              <sn-icon type="explain" color="#ccc" :size="16" class="tips"></sn-icon>
              <div class="tips-table" slot="content">所选区域内的应用将显示“下架”，无法被下载</div>
            </Poptip>
          </div>
          <Poptip placement="bottom-start" trigger="hover">
            <div class="area-select"><span v-for="(item, index) in selectV" :key="index">{{item.regionName}},</span></div>
            <div class="tips-table" slot="content"><span v-for="(item, index) in selectV" :key="index">{{item.regionName}},</span></div>
          </Poptip>
        </FormItem>
      </Form>
      <div class="flex-item">
        <div>
          <Button type="primary" @click.native="save">保存</Button>
        </div>
        <div>
          <Button type="primary" @click.native="modifyArea" v-if="!areaShow">修改</Button>
          <Button type="primary" @click.native="saveArea" v-if="areaShow">保存</Button>
        </div>
      </div>
    </div>
    
    <div class="region-select" v-if="areaShow">
      <AreaSelect :selectedData.sync="selectV" :chinaArea="regionMap"></AreaSelect>
    </div>
    <Spin fix v-if="areaSave"></Spin>
  </Card>
</template>

<script>
import { Button, Icon } from "_c";
import Poptip from "_c/poptip";
import AreaSelect from '_c/area-choose';
import { deepCopy } from "@/utils/assist";
import { Card, Form, FormItem, Input, Message, Spin } from "iview";
import fetch from "@/common/fetch";

// const regionMap = ;
const components = {
  Card,
  Form,
  FormItem,
  Input,
  "sn-icon": Icon,
  Poptip,
  Spin,
  AreaSelect,
  Button
};
export default {
  name: "data-report",
  components,
  props: {
    appinfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      info: null,
      selectV: [],
      regionMap: null,
      areaSave: false,
      areaShow: false,
      rules: {
        turl: [
          {
            required: true,
            message: "请输入上报地址"
          },
          {
            max: 255,
            message: "最大输入长度为255"
          },
          {
            pattern: /^[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/,
            message: "请输入正确的url"
          }
        ]
      }
    };
  },
  watch: {
    appinfo: {
      handler: function(val) {
        if (val) {
          this.info = deepCopy(val);
          if (this.info.turl === undefined) {
            this.$set(this.info, "turl", "");
          } else {
            if (this.info.turl.indexOf("https://") !== -1) {
              try {
                this.info.turl = this.info.turl.replace(/&amp;/g, '&').replace(/&amp;/g, '&')
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
              this.info.turl = this.info.turl.split("https://")[1];
            }
          }
        }
      },
      immediate: true
    },
    '$route': {
      handler: function(val) {
        this.initArea();
      },
      deep: true
    }
  },
  created() {
    this.initArea();
  },
  methods: {
    async initArea() {
      let area = localStorage.getItem('chinaArea');
      if (area) {
        this.regionMap = JSON.parse(area);
      } else {
        await this.getArea();
      }
      this.getCurrArea();
    },
    convertTree(tree) {
      const result = [];
      tree.forEach((item) => {
        // 解构赋值
        let {
            _id: regionId,
            name: regionName,
            children: child
        } = item
        // 如果有子节点，递归
        if (child) {
            child = this.convertTree(child)
        } else {
          child = [];
        }
        result.push({
            regionId,
            regionName,
            child
        })
      });
      return result;
    },
    async getArea() {
      let res = await fetch({
        method: "GET",
        url: "/area/tree.json"
      });
      this.regionMap = this.convertTree(res);
      localStorage.setItem('chinaArea', JSON.stringify(this.regionMap));
    },
    save() {
      this.$refs["formValidate"].validate(async valid => {
        if (valid) {
          try {
            await fetch({
              method: "PUT",
              url: "/apps/editurl.json?_id=" + this.info._id,
              data: {
                turl: "https://" + this.info.turl
              }
            });
            Message.success("操作成功");
            this.$emit("updateInfo");
          } catch (e) {
            Message.warning("操作失败");
          }
        }
      });
    },
    async getCurrArea() {
      let res = await fetch({
        method: "GET",
        url: "/config.json?app_id=" + this.$route.query.id
      });
      let arr = [];
      if (!res.code) {
        let _data = this.regionMap;
        for (let i = 0; i < _data.length; i++) {
          let item = _data[i];
          let str = item.regionId+'';
          if (res.indexOf(str) !== -1) {
            arr.push({regionName: item.regionName + '-不限', regionId: item.regionId});
          } else if (item.child.length) {
            for(let j = 0; j < item.child.length; j++) {
              let sub = item.child[j];
              let str = sub.regionId+'';
              if (res.indexOf(str) !== -1) {
                arr.push({regionName: item.regionName + '-' + sub.regionName + '-不限', regionId: sub.regionId});
              } else if (sub.child.length) {
                for (let k = 0; k < sub.child.length; k++) {
                  let third = sub.child[k];
                  let str = third.regionId+'';
                  if (res.indexOf(str) !== -1) {
                    arr.push({regionName: item.regionName + '-' + sub.regionName + '-' + third.regionName, regionId: third.regionId});
                  }
                }
              }
            }
          }
        }
        this.selectV = arr;
      }
      this.selectV = arr;
    },
    async modifyArea() {
      this.areaShow = true;
    },
    async saveArea() {
      let arr = this.selectV.map(item => item.regionId);
      this.areaSave = true;
      try {
        let options;
        if (arr.length) {
          options = {
            method: "POST",
            url: "/config.json",
            data: {
              app_id: this.$route.query.id,
              blacklist_area: arr
            }
          }
        } else {
          options = {
            method: "POST",
            url: "/config.json",
            data: {
              app_id: this.$route.query.id,
              'blacklist_area[]': ''
            }
          }
        }
        let res = await fetch(options);
        this.areaShow = false;
        this.areaSave = false;
        await this.getCurrArea();
        Message.success('操作成功');
      } catch (error) {
        this.areaSave = false;
        Message.warning('操作失败');
      }
      
    }
  }
};
</script>

<style lang="less" scoped>
.data-report {
  min-height: 600px;
  .flex {
    display: flex;
    margin-top: 40px;
    .form {
      margin-left: 0;
      margin-right: 0;
    }
    button {
      height: 32px;
      line-height: 32px;
      margin-left: 40px;
    }
    .flex-item {
      display: flex;
      flex-direction: column;
      div:nth-child(2) {
        margin-top: 25px;
      }
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
}
.area-select {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 305px;
}
</style>
