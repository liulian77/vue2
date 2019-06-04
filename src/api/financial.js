// 财务信息相关接口
import { get, post, put, del } from './restful'
/**
 * @desc 获取当前用户余额信息
 */
export const getAderAccount = (data = {}) => {
    return new Promise((resolve, reject) => {
        get({url:'/aderAccount/info.json', data})
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
};
/**
 * @desc 获取主页消费概述
 */
export const getExpendAccount = (data) => {
    return new Promise((resolve, reject) => {
        get({url:'/reportAder/overview.json',data})
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
};

/*
 * @desc 获取dsp首页平台曝光信息
*/
export const getDspExposureInfo = (data = {}) => {
    return new Promise((resolve, reject) => {
        get({url: '/platform/dspIndex.json', data})
            .then(res => resolve(res))
            .catch(err => reject(err));
    })
};

/**
 *  获取微信平台余额信息
 */
export const getWxFundsInfo = (data = {}) => {
    return new Promise((resolve, reject) => {
        get({url: '/ad/wx/other/getFunds.json', data})
            .then(res => resolve(res))
            .catch(err => reject(err));
    })
};

/**
 *  获取广点通平台余额信息
 */
export const getTsaFundsInfo = (data = {}) => {
    return new Promise((resolve, reject) => {
        get({url: '/ad/tsa/other/getFunds.json', data})
            .then(res => resolve(res))
            .catch(err => reject(err));
    })
};

/**
 * 获取平台近7日消费情况
 */
export const getPlatformConsumeInfo = (data = {}) => {
    return new Promise((resolve, reject) => {
        get({url: '/reports/adEffect/consume.json',data})
            .then(res => resolve(res))
            .catch(err => reject(err));
    })
};