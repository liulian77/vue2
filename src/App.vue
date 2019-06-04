<template>
  <div id="app" v-cloak>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import { api_global } from "@/api";
import { mapActions } from "vuex";
export default {
  name: "app",
  data() {
    return {
      appList: []
    };
  },
  provide() {
    return {
      app: this
    };
  },
  methods:{
      ...mapActions("basic", ["fetchDomain"]),
  },
 created() {
    this.$on("getAppList", field => {
      this.appList = field;
      return false;
    });
    this.fetchDomain();
  }
};
</script>

<style lang="less">
[v-cloak] {
  display: none;
}
html {
  font-size: 13.33333333vw;
   overflow: hidden; 
}
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: auto;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}

::-webkit-scrollbar-thumb {
  /* height: 60px; */
  background-color: #c5ccd4;
  -webkit-border-radius: 10px;
  outline: #c6ced7 solid 2px;
  outline-offset: -2px;
  border: 2px solid #c6ced7;
}
::-webkit-scrollbar-track-piece {
  background-color: transparent;
  -webkit-border-radius: 0;
}
::-webkit-scrollbar {
  width: 6px;
  height: 9px;
}

.text-overflow {
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}

input[type="number"] {
  -moz-appearance: textfield;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.add-app {
  .ivu-steps-item {
  }
  .ivu-steps-item:nth-child(1) {
    width: 200px !important;
    .ivu-steps-main {
      position: absolute;
      top: 55px;
      left: -7px;
      font-size: 16px;
    }
  }
  .ivu-steps-item:nth-child(2) {
    width: 200px !important;
    .ivu-steps-main {
      position: absolute;
      top: 55px;
      left: 5px;
      font-size: 16px;
    }
  }
  .ivu-steps-item:nth-child(3) {
    width: 40px !important;
    .ivu-steps-main {
      position: absolute;
      top: 55px;
      left: -7px;
      font-size: 16px;
      .ivu-steps-title {
        width: 70px;
      }
    }
  }
  .ivu-steps-head-inner {
    width: 40px;
    height: 40px;
    line-height: 40px;
    font-size: 20px;
    font-weight: bold;
  }
}
.ivu-modal-header-inner {
  font-size: 16px;
  font-weight: 400;
  color: rgba(123, 127, 131, 1);
}
.ivu-modal-header {
  border-bottom: 0;
}

.ivu-steps-tail {
  top: 20px !important;
}

.z-text {
  textarea.ivu-input {
    min-height: 140px !important;
  }
}

.ivu-modal-close .ivu-icon-ios-close  {
  color: #595c60;
  font-size: 25px;
}
</style>

