/**
 * @desc 系统首页信息
 */
const adStatus = {
    'AD_STATUS_NORMAL': '正常',
    'AD_STATUS_SUSPEND': '暂停',
    'AD_STATUS_PENDING': '待审核',
    'AD_STATUS_DENIED': '审核不通过',
    'AD_STATUS_DELETED': '删除'
};

const productType = {
    'PRODUCT_TYPE_LINK_WECHAT': '品牌活动页',
    'PRODUCT_TYPE_LBS_WECHAT': '本地门店推广',
    'PRODUCT_TYPE_ECOMMERCE': '电商推广'
};
const campaignType = {
    'CAMPAIGN_TYPE_WECHAT_OFFICIAL_ACCOUNTS': '微信公众号广告',
    'CAMPAIGN_TYPE_WECHAT_MOMENTS': '微信公众号广告'
};
const picType = {
    'IMAGE_TYPE_GIF': 'gif图片',
    'IMAGE_TYPE_JPG': 'jpg图片',
    'IMAGE_TYPE_PNG': 'png图片'
};
const qualifiactionStatus = {
    'QUALIFICATION_STATUS_NORMAL': '资质审核通过',
    'QUALIFICATION_STATUS_PENDING': '资质审核中',
    'QUALIFICATION_STATUS_DENIED': '资质审核未通过',
    'QUALIFICATION_STATUS_EXPIRED': '资质已过期',
    'QUALIFICATION_STATUS_SOON_EXPIRED': '即将过期',
    "STATUS_NORMAL": "资质审核通过",
    "STATUS_PENDING": "资质审核中",
    "STATUS_DENIED": "资质审核未通过",
    "STATUS_EXPIRED": "资质已过期",
    "STATUS_WILL_EXPIRE": "资质即将过期"
};
const platformType = {
    1: '深度传媒',
    2: '微信',
    3: '广点通'
};
export default {
    namespaced: true,
    state: {
        advertiserId: null,
        adStatus,
        productType,
        campaignType,
        picType,
        qualifiactionStatus,
        platformType
    },
    getters: {

    },
    mutations: {
        SET_ADVERTISER_ID(state, value) {
            state.advertiserId = value;
        }
    },
    actions: {
        setAdvertiserId: ({ commit }, data) => {
            commit('SET_ADVERTISER_ID', data);
        }
    }
}