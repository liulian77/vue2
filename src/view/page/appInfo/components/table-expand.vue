<template>
    <div class="wrapper">
        <div class="flex">
            <div class="item">app版本：{{row.version}}</div>
            <div class="item">系统版本：{{row.phone_version ? row.phone_version : '-'}}</div>
            <div class="item"></div>
        </div>
        <div class="flex">
            <div class="item">渠道名：{{row.cn_id?row.cn_id:'-'}}</div>
            <div class="item">自定义参数1：{{row.ud_id1?row.ud_id1:'-'}}</div>
            <div class="item">自定义参数2：{{row.ud_id2?row.ud_id2:'-'}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        row: {
            type: Object,
            default: null
        }
    }
}
</script>

<style lang="less" scoped>
    .wrapper {
        .flex {
            display: flex;
            margin-bottom: 15px;
            .item {
                flex: 1;
            }
        }
    }
</style>
