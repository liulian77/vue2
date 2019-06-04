import moment from 'moment'

/**
 * @desc 格式化时间
 * @param {String}
 */
export const formatTime = (arg,format,formatOrigin) => moment(arg,formatOrigin).format(format || 'YYYY-MM-DD HH:mm:ss')

export const toPercent = point => {
    if (typeof point === 'string' && !Number(point)) return point
    if (point === 0) return 0
    let str = Number(point * 100).toFixed(2)
    str += "%"
    return str
}

/**
 *
 * @param {*} number
 * @param {*} long
 */
export const toRegularNum = (number, long) => {
    if (typeof long == 'undefined') {
        long = 2;
    }
    if (long > 2) {
        let nump = ((number - 0).toFixed(long)).split('.');
        return nump[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + '.' + nump[1];
    }
    return ((number - 0).toFixed(long) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

export const chargeTyps={
    '-1':'扣费',
    '1':'现金',
    '2':'银行转账',
    '3':'支付宝',
    '4':'银联B2C',
    '5':'奖励',
    '6':'补量',
    '7':'微信',
    '8':'银联B2B',
    '99':'预充值'
};

export default {

    filters: {
        formatTime,
        toPercent,
        toRegularNum,
    }
}
