// 财务信息相关接口
import { get,post } from './restful'

/**
 * @desc   获取所有的媒体商
 * @param
 */

const getAgentDataJson=function ({page,count}) {
    let baseParam={
        "data[]":{
            "AgentUser":{
                "distributor":0,
                "enable":1,
                "@column":"username,access"
            },
            count,
            page
        }
    };
    return { json: baseParam };
};

export const getAgentData = options => new Promise((resolve, reject) => {
    get(getAgentDataJson(options))
        .then(res => resolve(res))
        .catch(err => reject(err))
});
/**
 * @desc   获取所有的广告位
 * @param
 */

const getAdZoneDataJson=function ({page,count,type,id}) {
    let baseParam={
        "data()":[
            "adzone_table",{
                "data[]":{
                    "AdZone":Object.assign({
                                "resource":type,
                                "@column":"title,resource,resource_id"
                            },
                            id?{"resource_id":id}:{}
                        ),
                    page,
                    count
                }
            }
        ]
    };
    return { json: baseParam };
};

export const getAdZoneData = options => new Promise((resolve, reject) => {
    get(getAdZoneDataJson(options))
        .then(res => resolve(res))
        .catch(err => reject(err))
});
