import { get, post, put, del } from './restful'
/**
 * @desc 获取tableList信息
 */
export const getList = options => {
    return new Promise((resolve, reject) => {
        get(options)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
};
/**
 * @desc 新建提交信息,修改表单信息
 */
export const postMessage = options => {
    return new Promise((resolve, reject) => {
        post(options)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
};
/**
 * @desc 获取单条提交信息
 */
export const getMessage = options => {
    return new Promise((resolve, reject) => {
        get(options)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
};
