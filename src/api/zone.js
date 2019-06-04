import {get} from "./restful";

/**
 * @desc 获取媒商的id
 *
 *
 */
const getMediaApijson = ({id}) => {
    let baseParam={
        "data()":[
            "resource_table",
            {
                "data[]":{
                    "ResourceSoft":{
                        "@column":"title",
                        "_id$":id
                    }
                }
            }
        ]
    };
    return {json: baseParam}
};


export const getMediaTitle = options => new Promise((resolve, reject) => {
    get(getMediaApijson(options))
        .then(res => resolve(res))
        .catch(err => reject(err))
});
/**
 * @desc 获取媒体商的title
 *
 *
 */
const getResourceTitleApijson = ({id}) => {
    let baseParam={
        "data[]": {
            "AgentUser": {
                "_id$":id,
                "@column": "username"
            }
        }
    };
    return {json: baseParam}
};


export const getResourceTitle = options => new Promise((resolve, reject) => {
    get(getResourceTitleApijson(options))
        .then(res => resolve(res))
        .catch(err => reject(err))
});
