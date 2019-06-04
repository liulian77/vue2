<template>
  <div class="el-checkbox-group" role="group" aria-label="checkbox-group">
    <div class='group-box' :class="groupClass">
      <slot></slot>
    </div>
  </div>
</template>
<script>
    import Emitter from '@/mixins/emitter';
    import { findComponentsDownward } from '@/utils/assist';

    export default {
        name: 'ElCheckboxGroup',

        componentName: 'ElCheckboxGroup',

        mixins: [Emitter],

        provide(){
            return {
                Group: this
            }
        },

        props: {
            value:{
                type:Array,
                default(){
                    return []
                }
            },
            vertical:{
                type:Boolean,
                default:false
            }
        },
        computed: {
            _elFormItemSize() {
                return (this.elFormItem || {}).elFormItemSize;
            },
            checkboxGroupSize() {
                return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
            },
            groupClass(){
                return {
                    'vertical-box':this.vertical
                }
            }
        },
        data(){
            return {
                selected:JSON.parse(JSON.stringify(this.value)),
            }
        },
        model: {
            event: 'modelUpdate',
        },
        methods:{
            change(val,flag){
            },
            checkboxBind(){
                if(this.value.length>0){
                    this.value.forEach(item=>{
                        this.broadcast('checkboxBtn', 'init', [item]);
                    });
                }
            },
            modelUpdate(){
                this.$emit('modelUpdate',this.selected);
            }
        },
        created() {
            this.$on('change', this.change);
        },
        watch:{
            value(val){
                this.selected=JSON.parse(JSON.stringify(val));
                this.$emit('change',this.selected)
            }

        }
    };
</script>
<style scoped>
  .el-checkbox-group{
    display: inline-block;
    position: relative;
  }
  .group-box{
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    align-content: space-between;
  }
  .el-checkbox-group .vertical-box{
    flex-direction: column;
    align-items: flex-start;
  }
</style>


