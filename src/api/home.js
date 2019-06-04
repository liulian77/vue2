import moment from 'moment'
import { get, post } from './restful'


const getIncome7daysJson=function ({type}) {
    const start = moment().subtract(7, 'days').format('YYYYMMDD');
    const end = moment().format('YYYYMMDD');
    let baseParam={
        "data()":[
            "index_income",
            {
                "data[]":{
                    "V2ReportSsp":{
                        //"type":type,
                        "date%d":`${start},${end}`,
                        //"date%d":"20180725,20180731",
                        "@group":"date",
                        "@column":"pricec_sum:sum(total.price_c),pricep_sum:sum(total.price_p)"
                    }
                }
            }
        ]
    };
    return { json: baseParam };
};

// 收入情况Echarts
export const income7days = (options) => {
    return get(getIncome7daysJson(options))
}

// 流量地域分布
export const flowArea = () => {
    const now = moment().format('YYYYMMDD')
    return post({
        "index_area()": ["index_area", now]
    })
}
