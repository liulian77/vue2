import { post,get } from './restful'

/**
 * @desc 登陆
 */
export const login = (options) => new Promise(async (resolve,reject) => {
    try {
        let res=await post(options);
        resolve(res);
    }catch (e) {
        reject(e);
    }
});

/**
 * @desc 退出登陆
 */
export const logout = (options) => new Promise(async (resolve, reject) => {
    try {
        await get(options);
        resolve()
    }catch (e) {reject(e);}
});

/**
 * @desc 用户信息
 */
export const getUersInfo = (options) => new Promise(async (resolve,reject) => {
    try {
        let res = await get(options);
        resolve(res)
    }catch (e) {reject(e);}
});

