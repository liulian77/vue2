<template>
  <li
      :class="{
        'selected':select.selectedId===id,
        'select-item':type==='default',
        'title-item':type==='title',
      }"
      @click.stop="selectOptionClick($event)"
      :title="currentLabel"
  >
    <template v-if="type==='default'">
        <slot v-if="!isSearch">
          <span>{{currentLabel}}</span>
        </slot>
        <span v-else v-html="searchHtml(currentLabel)"></span>
    </template>
    <template v-if="type==='title'">
        <slot>
          <span>{{currentLabel}}</span>
        </slot>
    </template>

  </li>
</template>

<script type="text/babel">
  import Emitter from '@/mixins/emitter';

  export default {
    mixins: [Emitter],

    name: 'ElOption',

    componentName: 'ElOption',

      //select的插件
    inject: ['select'],

    props: {
      value: {
        required: true
      },
      label:{},
      created: Boolean,
      disabled: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'default'
      }
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
        isSearch(){
            return this.select.search;
        }
    },

    watch: {
    },

    methods: {
        selectOptionClick(event) {
            if (this.disabled !== true &&  this.type!=='title') {
                this.dispatch('ElSelect', 'handleOptionClick', [this,true,event]);
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
        },
        resetSelect(){
            if(this.select.value&&this.value==this.select.value){
                this.select.selectedId=this._uid;
                this.select.selectedLabel=this.currentLabel?this.currentLabel:this.value;
            }
        }
    },
    created() {
        this.id=this._uid;
        if(this.select.value&&this.value==this.select.value){
             this.select.selectedId=this._uid;
             this.select.selectedLabel=this.currentLabel?this.currentLabel:this.value;
        }
        this.$on('resetSelect', this.resetSelect);
    },
  };
</script>

<style scoped>
  .title-item {
    line-height: normal;
    padding: 8px 16px;
    clear: both;
    color: #354052;
    font-weight: bold;
    font-size: 12px;
    list-style: none;
    cursor: default;
    white-space:nowrap;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    overflow: hidden;
  }
  .select-item {
    line-height: normal;
    padding: 8px 16px;
    clear: both;
    color: #354052;
    font-size: 14px;
    list-style: none;
    cursor: pointer;
    white-space:nowrap;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
    overflow: hidden;
  }
  .select-item:hover{
    background: #2198f0;
    color:#fff;
  }
  .select-item:hover >>>  .keyWords{
    color: #fff!important;
  }
  .selected{
    color:#2198f0;
  }

</style>
