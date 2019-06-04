<template>
    <div class="container">
        <div class="slot"><slot></slot></div>
        <div class="box" v-show="isShow">
            <sn-tabs type="card" class="t5" @on-click="handleChange">
                <sn-tab-pane name="1" label="验证方式一：文件验证">
                    <p><span class="step">1</span><sn-button @click.native="handleDownload">下载验证文件</sn-button></p>
                    <p><span class="step">2</span><span>将验证文件sndo_site_code.txt放置于您所配置域名的根目录下</span></p>
                    <p><span class="step">3</span><span>点击“完成验证”按钮，（请于30分钟内完成）</span></p>
                    <div class="btn-box">
                        <sn-button class="cancel" @click.native="cancel">取消</sn-button>
                        <sn-button type="primary" @click.native="complete">完成验证</sn-button>
                    </div>
                </sn-tab-pane>
                <sn-tab-pane name='2' label="验证方式二：HTML标签验证">
                    <p v-text="htmlText" class="mb24"></p>
                    <p class="mb24">将以上代码添加到您网站首页HTML代码的<span v-text="'<HEAD>标签与</HEAD>'"></span>标签之间，并点击“完成验证”按钮。</p>
                    <div class="btn-box">
                        <sn-button class="cancel" @click.native="cancel">取消</sn-button>
                        <sn-button type="primary"  @click.native="complete">完成验证</sn-button>
                    </div>
                </sn-tab-pane>
            </sn-tabs>
        </div>
    </div>
</template>

<script>
    import {Button} from '_c'
    import {Tabs,TabPane} from 'iview';
    const components={
        'sn-tabs':Tabs,
        'sn-tab-pane':TabPane,
        'sn-button':Button,
    };
    export default {
        name: "verifyWebsite",
        components,
        data(){
            return {
                htmlText:'<meta name="sndo_union_verify" content="240cti8icovx">',
                isShow:false
            }
        },
        props:{
            visible: {
                type:Boolean,
                default:true
            }
        },
        watch:{
            visible(){
                this.isShow=!this.isShow;
            }
        },
        methods:{
            cancel(){
                this.isShow=false;
            },
            complete(){
                this.$emit('complete');
            },
            handleChange(name){
                this.$emit('change',name);
            },
            handleDownload(){
                this.$emit('download');
            }
        }
    }
</script>

<style scoped>
.t5{

    color: #7f8fa4;
    font-size: 14px;
}
.box{
    width: 480px;
    padding: 20px;
    background-color: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 2px;
    -webkit-box-shadow: 0px 6px 18px 0px rgba(37, 46, 61, 0.08);
    box-shadow: 0px 6px 18px 0px rgba(37, 46, 61, 0.08);
    border: solid 1px #dfe2e6;
    position: absolute;
    bottom: -30px;
    left: 0;
    transform: translate(-80%,100%);
}
.box p{
    text-align: left;
}
.step{
    display: inline-block;
    font-size: 12px;
    width: 18px;
    height: 18px;
    background-color: #354052;
    border-radius: 50%;
    text-align: center;
    line-height: 18px;
    color: #fff;
    margin-right: 12px;
    margin-bottom: 24px;
}
.mb24{
    margin-bottom: 24px;
}
.cancel{
    margin-right: 40px;
}
.container{
    position: relative;
}
</style>
