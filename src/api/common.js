import { get, post, put, del } from './restful'
import { Dialog } from '_c/dialog'

/**
 * @desc 后台接口示例
 * {
 *   []:{
 *       模型名:{
 *          @column:string e.g:_id,title,addtime 指定字段返回
 *          @order:string e.g:addtime+ 排序
 *          key{}:array in查询
 *          key%:string e.g:2018-12-13,2019-01-01 [区间查询)
 *          key$:string e.g:%match% 模糊查询
 *          }
 *    skip:0 分页参数,从0开始 skip=(page-1)*count 和page二选一
 *    page:1 分页参数,从1开始
 *    count:10 =0时使用不限制数量，缺省为10
 *   }
 * }
 */

/**
 *
 * @desc 有函数调用的表格
 * "ads()":["adzone_table",{
 *  "[]": {
 *    "AdZone": {
 *      "@column": "title,resource,resource_id,agent_id,setting.size,type,status,memo",
 *      "agent": {
 *        "AgentUser": {
 *          "_id": "$agent_id",
 *          "@column": "username"
 *        }
 *      }
 *    },
 *    "count": 10,
 *    "page": 1
 *  }
 *}]
 */



/**
 *
 * @param {Object} options
 * options.funcName 函数查询
 * options.funcParams 函数参数
 * options.funcResName 函数响应显示字段名
 * options.funcNextResName 联合查询函数响应显示第二层字段名
 * options.tableName 数据库表名
 * options.column 列名集合
 * options.tableInfo 翻页/排序/模糊查询/区间查询，及其他table数组控制
 * options.pageInfo 列名集合
 */
export const getTableApijson = ({ funcName, funcParams, funcResName, tableName, column, tableInfo, pageInfo , funcNextResName}) => {
    let apijson = Object.create(null)
    let baseParam = {
        [funcNextResName||"data[]"]: Object.assign({}, {
            [tableName]: Object.assign({}, {
                "@column": column.join(',')
            }, tableInfo || {})
        }, pageInfo || {
            page: 1,
            count: 10
        })
    }

    if (funcName && funcResName)  // 有函数调用的表格
        apijson = funcParams && funcParams.length ?
            { [funcResName]: [funcName, baseParam, ...funcParams] } :
            { [funcResName]: [funcName, baseParam] }
    else    // 常规表格
        apijson = baseParam
    return { json: apijson }
}


// 获取基础List      optoins = null
// 列排序            options = { table: { "@order": "addtime+" } }
// 翻页/当前count    options = { table: { count: 10, page: 2 } }
// 模糊查询          options = { table: { key$: 'str' } }
// 区间查询          options = { table: { key%: '2018-12-13,2019-01-01' } }
export const getList = options => new Promise((resolve, reject) => {
    get(getTableApijson(options))
        .then(res => resolve(res))
        .catch(err => reject(err))
})

// 新增媒体
export const addList = (tableName, formData) => new Promise((resolve, reject) => {
    post({ [tableName]: formData })
        .then(res => resolve(res))
        .catch(err => reject(err))
})

// 修改单条数据
export const updateList = (tableName, formData) => new Promise((resolve, reject) => {
    put({ [tableName]: formData })
        .then(res => resolve(res))
        .catch(err => reject(err))
})

// 删除单条数据
export const delList = (tableName, _id) => new Promise((resolve, reject) => {
    del({ [tableName]: { _id } })
        .then(res => resolve(res))
        .catch(err => reject(err))
})

//操作前的提示弹窗
export const handleWaring=(options)=>{
    let success=options.success || (()=>{});
    let fail=options.fail || (()=>{});
    let text=options.text || '确认该操作?';
    return new Promise((resolve, reject) => {
        Dialog({
            type: 'warning',
            text,
            onConfirm(){
                resolve(success(true));
            },
            onCancel(){
                // reject(fail());
                resolve(success(false));
            }
        });
    });
};



/**
 * @desc 获取用户名
 *
 * @param {Object} options
 * options.keywords 搜索关键字
 * options.page 分页
 *
 */

const getTitleJson=function ({keywords,page,type}={keywords:'',page:1,type:'agent'}) {
    keywords=String(keywords).trim();
    let baseParam;
    switch (type) {
        case 'zone':
            baseParam = {
                "data()": [
                    "adzone_table",
                    {
                        "data[]":{
                            "AdZone":{
                                //"status":1,
                                "@column":"title",
                                "title$":keywords.length>0?keywords:""
                            },
                            page: page||1,
                            "count":10
                        }
                    }
                ]
            };
            break;
        case 'agent':
            baseParam= {
                "data[]": {
                    "AgentUser": {
                        //"access.soft":1,
                        "username$":keywords.length>0?keywords:"",
                        "distributor":0,
                         //enable:1,
                        "@column": "username"  //,access
                    },
                    "count": 10,
                    page: page||1,
                }
            }
            break;
    }
    return { json: baseParam };
};

export const getTitleList = options => new Promise((resolve, reject) => {
    get(getTitleJson(options))
        .then(res => resolve(res))
        .catch(err => reject(err))
});

/**
 * @desc 对应id的资料
 *
 *
 */
const getSingleApijson = ({id,type,column,tableName}) => {
    let baseParam;
    switch (type) {
        case 1:
            baseParam={[tableName]: {
                    "_id": id,
                    "@column": column.join(',')
                }};
            break;
    }
    return {json: baseParam}
};


export const getSingleData = options => new Promise((resolve, reject) => {
    get(getSingleApijson(options))
        .then(res => resolve(res))
        .catch(err => reject(err))
});

/**
 * @desc 折线图的数据
 *
 *
 */
const getLineTableDataApijson = ({type,date}) => {
    let baseParam;
    baseParam={
        "data()":[
            "report_sum",
            {
                "data[]":{
                    "V2ReportSsp":{
                        "resource":type,
                        //"search":"qudao9910/qudao9910",
                        "search":"",
                        "date%d":date,
                        "@group":"type",
                        "@column":"pricec_sum:sum(total.price_c),pricep_sum:sum(total.price_p),pv_sum:sum(total.pv),show_sum:sum(total.show),clks_sum:sum(total.clks),uv_sum:sum(total.uv),ip_sum:sum(total.ip)"
                    }
                }
            }
        ]
    };
    return {json: baseParam}
};


export const getLineTableData = options => new Promise((resolve, reject) => {
    get(getLineTableDataApijson(options))
        .then(res => resolve(res))
        .catch(err => reject(err))
});

/**
 * 
 * @desc 获取深度平台广告行业
 */
export const getAdrCategory = (data) => {
    return new Promise((resolve, reject) => {
        get({url:'/user/getCategory.json',data})
            .then(res => resolve(res))
            .catch(err => reject(err))
    })
};


