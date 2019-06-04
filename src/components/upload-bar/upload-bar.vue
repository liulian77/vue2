<template>
    <div class="container">
        <p><span class="text-overflow">{{name}}</span> <span>（{{size}}k）</span></p>
        <sn-progress :percent="per" :stroke-width="4"  stroke-color="#2A9FF6" class="w140" :hide-info="true"/>
    </div>
</template>

<script>
    import { Progress } from 'iview'
    const components={
        'sn-progress':Progress
    };
    export default {
        props:{
            name:{
                type:String,
                default:'证件照文件名'
            },
            size:{
                type:String,
                default:'69.09'
            },
            per:{
                type:Number,
                default:25
            },
        },
        name: "upload-bar",
        components
    }
</script>

<style scoped lang="less">
    .container{
        width:400px;
        height:130px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(223, 226, 230, 1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        p{
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .w140{
        width: 140px;
    }
    .text-overflow{   //文字溢出   宽度自己定义
        width: 82px;
        white-space:nowrap;   //不换行     都支持
        text-overflow:ellipsis;
        -o-text-overflow:ellipsis;   //省略号显示   都支持
        overflow: hidden;
        display: inline-block;
    }
</style>
