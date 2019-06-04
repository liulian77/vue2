/**
 * @desc 广告位管理信息
 */
const ADType={
    1:'cpc',
    2:'cps'
};

let settingType={
    'float':'悬浮',
    'inlay':'嵌入',
    'splash':'闪烁',
    'in_feed':'信息流',
};
export default {
    namespaced: true,
    state: {
        ADType,
        settingType,
    },
    getters: {

    },
    mutations: {

    },
    actions: {

    }
}
