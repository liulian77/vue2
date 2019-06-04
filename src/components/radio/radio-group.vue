<template>
  <div class="el-radio-group" role="group" aria-label="checkbox-group">
    <div class='group-box' :class="groupClass">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import Emitter from '@/mixins/emitter';

  export default {
    name: 'ElRadioGroup',
    componentName: 'ElRadioGroup',
    mixins: [Emitter],
    provide(){
        return {
            Group: this
        }
    },
    props: {
      value:[String,Number],
      vertical:{
          type:Boolean,
          default:false
      }
    },
    computed: {
      groupClass(){
          return {
              'vertical-box':this.vertical
          }
      }
    },
    data(){
      return {
          selected:this.value,
      }
    },
    model: {
        event: 'modelUpdate',
    },
    methods:{
        radioChange(val){
            this.selected=val;
            this.$emit('modelUpdate', val);
            this.$emit('change', val);
        },
    },
    created() {
        this.$on('radioChange', this.radioChange);
    },
    watch:{
        value(val){
            this.radioChange(val);
        }
    },
  };
</script>
<style scoped>
  .el-radio-group{
    display: inline-block;
    position: relative;
  }
  .group-box{
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .el-radio-group .vertical-box{
    flex-direction: column;
    align-items: flex-start;
  }

</style>


