<template>
  <div :class="[`${type}-wrap`]" @click.stop="selectItemClick">
    <template v-if="type==='default'">
        <div class="default-item item ">
            <span v-html="searchHtml(currentLabel)"></span>
        </div>
    </template>

    <template v-if="type==='level'">
      <div class="level-item item">
        <slot>
          <span>{{currentLabel}}</span>
        </slot>
        <div class="icon-box">
            <Icon type="arrow-left"
                  color="#7f8fa4"
                  :size="14"
                  class="arrow-left"
            />
        </div>

      </div>
    </template>
    <template v-if="type==='title'">
      <div class="title-item item">
        <slot>
          <span>{{currentLabel}}</span>
        </slot>
      </div>
    </template>

  </div>
</template>

<script type="text/babel">
  import Icon from "_c/icon";
  import Emitter from '@/mixins/emitter';

  export default {
    mixins: [Emitter],
    components:{
        Icon,
    },
    name: 'ElItem',
    componentName: 'ElItem',
    inject: ['select'],
    props: {
      value:[String,Number],
      label: [String, Number],
      children: Boolean,
      disabled: {
        type: Boolean,
        default: false
      },
      type:{
          type:String,
          default: 'default'
      },
      title:String
    },
    data() {
      return {
             id:''
      };
    },

    computed: {
        //判断value的值是不是object
        isObject() {
            return Object.prototype.toString.call(this.value).toLowerCase() === '[object object]';
        },
        //显示的label值
        currentLabel() {
            let labelSlot=this.$slots.default?this.$slots.default[0].text:'';
            return (this.label?this.label:labelSlot) || (this.isObject ? '' : this.value);
        },
    },

    watch: {
    },
    methods: {
        selectItemClick(val) {
            if (this.disabled !== true) {
                this.dispatch('ElSearch', 'handleItemClick', [this]);
            }
        },
        searchHtml(val){
            (this.select.keyWords && this.select.keyWords.length > 0)&&(val=this.colorFont(this.select.keyWords,val));
            return val;
        },
        /*==============================高亮选项===========================================*/
        colorFont(keyWords,val){
            // 匹配关键字正则
            let replaceReg = new RegExp(keyWords, 'g');
            // 高亮替换v-html值
            let replaceString =`<span style="color: #2a9ff6" class="keyWords">${keyWords}</span>`;
            val = val.replace(replaceReg, replaceString);
            return val;
        }
    },

    created() {
        this.id=this._uid;
    },
    mounted(){
    },

    beforeDestroy() {

    }
  };
</script>

<style scoped lang="less">

  @v:100vw/750;
  .item{
    padding: 0 0 0 40*@v;
    display: flex;
    background-color: #fff;
  }
  .item span{
      white-space:nowrap;
      text-overflow:ellipsis;
      -o-text-overflow:ellipsis;
      overflow: hidden;
  }
  .item-text{
    flex: 1;
    white-space:nowrap;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    overflow: hidden;
  }


  .default-wrap{
      .default-item{
        height: 110*@v;
        line-height: 110*@v;
        border-bottom: 1px solid #dfe2e6;
        color: #354052;
      }
  }
  .level-wrap{
      .level-item{
        height: 96*@v;
        line-height: 1;
        font-size: 16px;
        color: #7f8fa4;
        position: relative;
        display: flex;
        align-items: center;
        span{
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
        }
      }
      .arrow-left{
        transform: rotate(180deg);
      }
      .icon-box{
        width: 53*@v;
        height: 100%;
        display: flex;
        align-items: center;
      }
  }

  .title-wrap{
    .title-item{
      height: 67*@v;
      line-height: 67*@v;
      font-weight: bold;
      border-bottom: 1px solid #dfe2e6;
    }
  }

</style>
