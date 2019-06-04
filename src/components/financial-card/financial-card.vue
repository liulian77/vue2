<template>
    <div  class="container">
        <div class="fcard"
             :class="{'fcard-blank':type=='blank'}"
             v-if="type!='dsp'"
        >
            <div class="fcard-left">
                <div class="fcard-main" :style="mainStyles" >
                    <template v-if="type!='blank'">
                        <p class="main-title">账户余额</p>
                        <p class="main-content">￥{{toRegularNum(Balance)}}</p>
                        <p class="main-footer">
                            冻结金额：￥{{toRegularNum(freeze)}}
                            <sm-poptip placement="bottom-start" trigger="hover">
                                <sm-icon type="explain"
                                         color="rgba(255,255,255,.5)"
                                         :size="16"
                                         class="icon"
                                />
                                <div slot="content" class="tips-table">
                                    冻结金额：指您应收，但还未到账的金额。
                                </div>
                            </sm-poptip>

                        </p>
                    </template>
                    <template v-else>
                        <div class="blank-name">{{blank.name}}</div>
                        <p class="blank-type">{{blank.type}}</p>
                        <p class="blank-number">{{blank.number}}</p>
                    </template>
                </div>
            </div>
            <div class="fcard-content" v-if="content&&!isMobile">
                <div>
                    <slot></slot>
                </div>
            </div>
            <div class="fcard-right">
                <sm-button type="primary"
                           size="small"
                           shape="circle"
                           @click.native="handleClick"
                           v-if="type!='blank'"
                >提现</sm-button>
                <sm-button
                        size="small"
                        shape="circle"
                        @click.native="handleClick"
                        v-else
                >修改</sm-button>
                <div class="fcard-content" v-if="content&&isMobile">
                    <div>
                        <slot></slot>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="type=='dsp'"  class="dsp-card">
            <p class="main-title">可用余额</p>
            <div class="main-content flex">
                <p class="card-left text-overflow" :title="toRegularNum(Balance)">￥{{toRegularNum(Balance)}}</p>
                <div class="card-right" v-if='withdrawVisible'>
                    <sm-button
                            size="small"
                            shape="circle"
                            class="card-btn"
                            @click.native="handleClick"
                    >充值</sm-button>
                </div>
            </div>
            <p class="main-footer text-overflow" :title="toRegularNum(freeze)">
                冻结金额：￥{{toRegularNum(freeze)}}
                <sm-poptip placement="bottom-start" trigger="hover">
                    <sm-icon type="explain"
                             color="rgba(255,255,255,.5)"
                             :size="16"
                             class="icon"
                    />
                    <div slot="content" class="tips-table">
                        冻结金额：指您应收，但还未到账的金额。
                    </div>
                </sm-poptip>
            </p>
        </div>
    </div>






</template>
<script>
import Button from "_c/button";
import Icon from "_c/icon";
import Poptip from "_c/poptip";
import isMobile from "@/mixins/isMobile";
import { toRegularNum } from '@/mixins/globalMixin'
export default {
    name: "FinancialCard",
    mixins: [isMobile],
    props:{
        Balance:{
            type:[String,Number],
            default:0
        },
        freeze:{
            type:[String,Number],
            default:0
        },
        content:[Boolean],
        type:[String],
        blank:{
            type:Object,
            default(){
                return {
                    name:'',
                    number:'',
                    type:'',
                    img:''
                }
            }
        },
        withdrawVisible: {
            type: Boolean,
            default: true
        }
    },
    components:{
        'sm-button':Button,
        'sm-icon':Icon,
        'sm-poptip':Poptip
    },
    methods:{
        handleClick(){
            this.$emit('withdraw')
        },
        toRegularNum
    },
    computed:{
        mainStyles(){
            if (this.type=='blank'){
                let style={
                    'background-image':'url("/image/'+this.blank.img+'.png")'
                };
                return style;
            }
        }

    }
}
</script>

<style lang="less" scoped>
@v:100vw/750;
@W:100vw/1920;
.displayflex {
  display: flex;
  display: -webkit-flex;
}
.fcard {
  .displayflex;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  border: 1px solid #dfe2e5;
  border-radius: 4px;
  background: #fff;
  .fcard-left {
    position: relative;
    .fcard-main {
      width: 250px;
      height: 140px;
      background: url("/image/fcard1.png") no-repeat;
      position: absolute;
      top: -11px;
      left: 19px;
      padding: 18px 20px;
        .main-title{
            font-size: 16px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #ffffff;
            line-height: 1;
        }
        .main-content{
            margin-top: 20px;
            font-size: 16px;
            font-weight: normal;
            letter-spacing: 0px;
            color: #ffffff;
            line-height: 1;
        }
        .main-footer{
            margin-top: 23px;
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 1;
            letter-spacing: 0px;
            color: #ffffff;
            opacity: 0.8;
        }
    }
  }
}
.icon{
        position: relative;
        top: -2px;
    }
.s-home-web .fcard{
   height: 150px;
    .fcard-content{
        padding: 0 2px;
        margin-left: 30px;
        display: flex;
        align-items:center;
    }
    .fcard-left {
        flex: 0 1 269px;
    }
    .fcard-right{
        flex: auto;
        display: flex;
        align-items: center;
        text-align: right;
        height: 100%;
        flex-direction: row-reverse;
        padding-right: 3%;
    }
    /deep/ .tips-table{
        padding: 20px;
        background-color: #fff;
        color: #354052;
    }
}
html .s-home-web .fcard-blank{
    .fcard-main{
        padding: 20px 0 0 72px;
        .blank-name{
            font-size: 16px;
            color: #fff;
            font-weight: bold;
            line-height: 1;
        }
        .blank-type{
            margin-top: 10px;
            color: #fff;
            opacity: 0.6;
            line-height: 1;
        }
        .blank-number{
            margin-top: 30px;
            color: #fff;
            line-height: 1;
        }
    }
}
html .s-home-xs .fcard-blank{
    .fcard-left .fcard-main{
        padding: 26*@v 0 0 145*@v;
        .blank-name{
            font-size: 12px;
            color: #fff;
            font-weight: bold;
            line-height: 1;
        }
        .blank-type{
            margin-top: 15*@v ;
            color: #fff;
            opacity: 0.5;
            line-height: 1;
            font-size: 10px;
        }
        .blank-number{
            margin-top: 70*@v ;
            color: #fff;
            line-height: 1;
            font-size: 13px;
        }
    }
}
.s-home-xs .fcard{
    flex-wrap: nowrap;
    width: 100%;
    height: 236*@v;
    .fcard-left .fcard-main{
        width: 440*@v;
        height: 210*@v;
        padding: 30*@v 0 0 40*@v;
        top: -11*@v;
        left: 17*@v;
        border-radius: 2px;
        .main-content{
            margin-top: 42*@v;
            font-size: 21px;
        }
        .main-footer{
            margin-top: 20*@v;
            font-size: 10px;
        }
        .main-title{
            font-size: 12px;
        }
    }
    .fcard-left{
        width: 460*@v;
    }
    .fcard-right{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .slot-title:first-child{
            margin-top: 36*@v;
        }
    }
    .slot-title,.slot-content{
        font-size: 10px;
        text-align: left;
    }
    .fcard-right{
        height: 100%;
        flex: auto;
        display: flex;
        align-items: center;
        text-align: right;
        flex-direction: column;
    }
    /deep/ .tips-table{
        padding: 20*@v;
        background-color: #fff;
        color: #354052;
    }
}
/deep/ .slot-title{
    color: #7f8fa4;
}
/deep/ .slot-content{
    font-weight: bold;
    color: #354052;
}
/deep/ .ivu-poptip-inner{
        z-index: 3000;
    }



/*dsp部分*/
.s-home-web .dsp-card{
    width:100%;
    height:170px;
    background:linear-gradient(-48deg,rgba(42,159,246,1),rgba(99,185,249,1));
    border-radius:4px;
    .flex{
        display: flex;
    }
    .main-title{
        font-size:16px;
        font-weight:bold;
        color:rgba(255,255,255,1);
        line-height:1;
        padding-top: 18px;
        margin-left: 30px;
    }
    .main-content{
        font-size:30px;;
        font-weight:400;
        line-height: 1;
        color:rgba(255,255,255,1);
        padding-top: 37px;
        margin-left: 30px;
    }
    .card-left{
        flex:1
    }
    .card-right{
        width: 110px;
        box-sizing: border-box;
        padding-right: 30px;
        display: flex;
        align-items: center;
        line-height: 1;
    }



    .main-footer{
        font-size:14px;
        font-weight:400;
        color:rgba(255,255,255,.8);
        padding-top: 10px;
        margin-left: 30px;
        line-height: 1;
    }
    .card-btn{
        font-size:14px;
        font-weight:bold;
        color:rgba(31,150,238,1);
    }
    /deep/ .tips-table{
        padding: 20px;
        background-color: #fff;
        color: #354052;
    }
}
/*dsp部分*/
</style>


