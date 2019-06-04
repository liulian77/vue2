<!--

    Author:hezhongyi
    Date:2018-11-19
    Description:select主件

    使用案例：
    Select Attributes
    参数	        说明	        类型	                可选值	        默认值
    height         下拉框的高度      Number/String              -              36
    width          下拉框的宽度      Number/String              -              270
    placeholder     没选中前的文本   String                     -              -
    scrollLoad     是否可以下拉加载  Boolean                    true/false     false

    事件：
    事件名称	        说明	                            回调参数
    change	            选中值发生变化时触发	            目前的选中值
    search	            搜索模式下的值	                    搜索模式下的值
    handlerFocus	    搜索聚焦事件	                    -
    clear               复原select下来框                    -
    downLoad            滚动条到最底部20px处触发            -
-->


<template>
  <div class="el-select"
       :style="wrapStyles"
       @click.stop="toggleMenu($event)"
       v-clickoutside="handleClose"
       :class="{
          'has-border':border,
          'el-select-xs':isMobile,
          'el-level':level,
       }"
  >
      <Input
            :width="'100%'"
            :height="'100%'"
            :readonly="true"
            :placeholder="placeholder"
            v-model="selectedLabel"
            :border="false"
            class="readonly-input"
            @focus="focus"
      ></Input>
      <transition>
        <ul class="el-select-menu"
            v-show="visible"
            :style="widthStyles"
            @scroll="menuScroll($event)"
        >
            <li v-if="search" class="search-li">
                <Input placeholder="请输入搜索关键字" autofocus v-model="keyWords"  :border="false" class="search-input">
                    <Icon type="search"
                          color="#ebedf2"
                          :size="15"
                          class="icon"
                          slot="prefix"
                    />
                </Input>
            </li>
          <slot></slot>
        </ul>
      </transition>
      <div class="arrow-down"></div>
  </div>
</template>

<script type="text/babel">
  import Input from '_c/input'
  import Icon from "_c/icon";
  import {style,Emitter,domScroll} from "@/mixins";
  import Clickoutside from '@/mixins/clickoutside';
  import { mapState } from 'vuex'
  import { throttle } from 'lodash'
  export default {
    name: 'ElSelect',
    componentName: 'ElSelect',
    mixins: [style,Emitter,domScroll],
    props: {
        value:[String, Number,Array,Object],
        placeholder:[String, Number],
        search:Boolean,
        level:Boolean,
        border:{
            type: Boolean,
            default:true
        },
        /*
        *  多层级功能开启以后配置选项
        * */
        defaultProps:{
            type:Object,
            default() {
                return {
                    children: 'children',  //指定子树为节点对象的某个属性值
                    label: 'label'      //指定节点标签为节点对象的某个属性值
                };
            }
        }
    },
    directives: { Clickoutside },
    data() {
          return {
              visible: false,
              selectedLabel: '',
              selectedId: '',
              keyWords:'',
          };
      },
    provide() {
      return {
        'select': this
      };
    },
    components: {
       Input,
       Icon
    },
    methods: {
        toggleMenu(event) {
            if(
                //点击搜索框不关闭
                (this.search && (this.$el.querySelector('.search-li').contains(event.target)))
                ||
                //点击一级菜单不关闭
                (this.level && (this.$el.querySelector('.title-item').contains(event.target)))
            ){
                return
            }else {
                !this.visible&&this.broadcast('ElInput', 'autofocus');
            }
            //判断有没有disabled的属性
            if (!this.disabled) {
                this.visible = !this.visible;
            }
        },
        handleClose() {
            this.visible = false;
        },
        handleOptionSelect(option, byClick,event) {
            this.toggleMenu(event);
            this.$emit('change', option.value);
            this.$emit('modelUpdate', option.value);
            this.selectedId=option._uid;
            let curValue = option.currentLabel?option.currentLabel:option.value;
            curValue = curValue.trim();
            this.selectedLabel=curValue;
        },
        clear(){
            this.selectedLabel='';
            this.selectedId='';
            this.visible=false;
        },
        focus(){
          this.$emit('handlerFocus');
      }
    },
    model: {
      event: 'modelUpdate',//自定义事件名,触发事件更新model值
    },
    created() {
        this.$on('handleOptionClick', this.handleOptionSelect);
    },
    computed: {
      ...mapState('basic',[
          'isMobile'
      ])
    },
    watch:{
        value(val){
            if(!val){
                this.selectedLabel='';
                this.selectedId='';
            }else {
                this.broadcast('ElOption', 'resetSelect');
            }
        },
        selectedLabel(val) {
            if (val.indexOf(' ') !== -1) {
                this.selectedLabel = val.trim();
            }
        },
        keyWords:throttle(function (val) {
            if(!this.search){
                return false
            }
            this.$emit('search',val.trim());
        },500),
        visible(val){
            if(this.search&&val){
                setTimeout(()=>{
                    this.$el.querySelector('.search-input').focus();
                },20)
            }
        }
      }
  };
</script>

<style scoped lang="less">
  .el-select{
    padding: 0 15px  0 0;
    background-color: #fff;
    position: relative;
    display: flex;
    border-radius: 2px;
    align-items: center;
  }
  .has-border{
      border: 1px solid #dfe2e6;
  }
  .arrow-down{
    content: '';
    width: 5px;
    height: 5px;
    border-right: 1px solid #7f8fa4;
    border-bottom: 1px solid #7f8fa4;
    display: block;
    position: absolute;
    top: 50%;
    right: 15px;
    -webkit-transform: rotate(45deg) translateY(-50%);
    transform: rotate(45deg) translateY(-50%);
  }
  .el-select-menu{
      padding: 7px 0;
    max-height:280px;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 2px;
    box-shadow: 0px 6px 18px 0px rgba(37, 46, 61, 0.08);
    position: absolute;
    z-index: 900;
    left: -1px;
    bottom: -11px;
    transform: translateY(100%);
      border: solid 1px #dfe2e6;
  }
  .search-li{
      position: relative;
      height: 40px;
      line-height: 40px;
      margin:0 16px 10px 16px ;
      padding: 0;
      border-bottom: 1px solid #dfe2e6;
  }
.search-li:after{
    content: '';
    display: block;
 /*   width: 240px;*/
    height: 1px;
    background-color: #dfe2e6;
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
}


  @v:100vw/750;
.el-select-xs{
   /deep/ .input-readonly input[type='text']{
        padding: 4px 0;
    }
    /deep/ .select-item{
        padding: 8px 16*@v;
    }
}
.search-li /deep/ .icon{
        left: 0;
    }
  /deep/ ::-webkit-input-placeholder {
      color: #354052;
  }
  /deep/ ::-moz-placeholder {
      color: #354052;
  }
  /deep/ :-ms-input-placeholder {
      color: #354052;
  }


  .el-level /deep/ .select-item{
      color:  #7f8fa4;
  }
  .el-level /deep/ .select-item:hover{
      color:  #fff;
  }




</style>
