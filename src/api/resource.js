import { get, post } from './restful'
import fetch from '@/common/fetch'
import Qs from 'qs'
// GET
export const getData = (params) => fetch({
    method: 'GET',
    url: `resource/domain.json?${Qs.stringify(params)}`,
});
export const VerifyWebsite = (options) => new Promise((resolve, reject) => {
    getData(options)
        .then(res => resolve(res))
        .catch(err => reject(err))
});
//获取媒体商类型
const getTypeListJson=function ({tableName,type}) {
    let baseParam={
        [`${tableName}()`]:[tableName,type,""]
    };
    return { json: baseParam };
};
export const getTypeList = (options) => new Promise((resolve, reject) => {
    get(getTypeListJson(options))
        .then(res => resolve(res))
        .catch(err => reject(err))
});





export const getExclude = () => new Promise((resolve, reject) => {
    post({
        "cate()":["resource_cate"]
    })
    .then(res => resolve(res))
    .catch(err => reject(err))
});


