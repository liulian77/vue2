// 此文件保存全局的通用接口

import { post } from './restful'


/**
 * @desc 用户信息
 */
export const accountInfo = () => new Promise(async (resolve,reject) => {
    try {
        let res = await post({ "user_info()": ["user_info"] });
        resolve(res.user_info)
    }catch (e) {
        reject(e);
    }
})

/**
 * @desc 登陆
 */
export const login = (options) => new Promise(async (resolve,reject) => {
    try {
        let res = await post(options);
        resolve(res.user_info)
    }catch (e) {
        reject(e);
    }
})
