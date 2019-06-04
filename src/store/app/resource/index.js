/**
 * @desc 媒体管理信息
 */

const status = [{
    label: '全部状态',
    value: null
},  {
    label: '锁定',
    value: 0
}, {
    label: '正常',
    value: 1
}, {
    label: '未审核',
    value: 2
}, {
    label: '未通过',
    value: 3
}]

const visitnum={
    0:'1万以下',
    1:'1-10万',
    2:'10-100万',
    3:'100-1000万',
    4:'1000万以上'
};


const mediaType={
    'ResourceSite':'网站',
    'ResourceApp':'APP',
    'ResourceSoft':'软件',
};

const platforms={
    1:'IOS',
    2:'Android',
};

const terminal={
    3:'全部',
    1:'智能手机',
    2:'平板电脑',
};

export default {
    namespaced: true,
    state: {
        status,
        mediaType,
        visitnum,
        platforms,
        terminal,
    },
    getters: {

    },
    mutations: {

    },
    actions: {

    }
}
