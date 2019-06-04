<template>
    <div :class="cls"
        class="scard">
        <div class="scard-head"
            v-if="showHead">
            <div class="scard-main-title">
                <slot name="title">
                    {{title}}
                </slot>
            </div>
            <div class="scard-sub-title"
                v-if="showHead">
                <slot name="subTitle">
                    {{subtitle}}
                </slot>
            </div>
        </div>
        <div class="scard-main">
            <slot></slot>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    name: "SCard",
    data() {
        return {
            title: null,
            subtitle: null,
            showHead: true,
            showSubTitle: true
        };
    },
    props: {
        classes: String
    },
    mounted() {
        this.showHead = this.title || this.$slots.title !== undefined;
        this.showSubTitle = this.subTitle || this.$slots.showSubHead !== undefined;
    },
    computed: {
        ...mapState('basic',[
            'isMobile'
        ]),
        cls() {
            let t = [];
            if (typeof this.classes === 'string') {
                t.push(this.classes);
            }
            if (this.isMobile) {
                t.push('scard-xs');
            }
            return t;
        }
    },
}
</script>

<style lang="less" scoped>
.displayflex {
  display: flex;
  display: -webkit-flex;
}
.scard {
  .displayflex;
  flex-direction: column;
  border: 1px solid #dfe2e5;
  border-radius: 4px;
  background: #fff;
  width: 100%;
  height: 100%;
  flex-grow: 1;
  .scard-head {
    padding: 20px;
    padding-bottom: 0;
    .scard-main-title {
      float: left;
      font-size: 16px;
      color: #354052;
      font-weight: bold;
      line-height: 20px;
    }
    .scard-sub-title {
      float: left;
      line-height: 20px;
      margin-left: 10px;
      color: #7f8fa4;
    }
  }
  .scard-main {
    .displayflex;
    flex-direction: column;
    flex-grow: 1;
    padding: 30px;
    height: 100%;
  }
}
.scard-xs {
  .scard-head {
    padding: 0.3rem;
    padding-bottom: 0;
  }
  .scard-main {
    padding: 0.3rem;
  }
}

.s-home-xs .s-home-left-card4{
    @v:100vw/750;
    .scard .scard-main {
        display: block;
        height: 1324*@v;
        padding: 65*@v 30*@v 40*@v  30*@v ;
    }
    .scard .s-report-main{
        display: block;
    }
    .scard-head {
        height: 60*@v;
        padding: 30*@v;
    }
}
</style>


