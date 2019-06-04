/**
 * @desc 媒体商管理信息
 */
const status = [
    {
    label: '全部状态',
    value: null
},{
    label: '锁定',
    value: 0
},{
    label: '正常',
    value: 1
}]
/*const mediaType=[
    {value:1,label:'个人'},
    {value:2,label:'企业'},
];*/

const mediaType={
    1:'个人',
    2:'企业',
};

export default {
    namespaced: true,
    state: {
        status,
        mediaType
    },
    getters: {

    },
    mutations: {

    },
    actions: {

    }
}
