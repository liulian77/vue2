import axios from 'axios'
import { baseUrl } from '@/common/config'
import router from '@/router'
import { Dialog } from '_c/dialog'
import {Message} from 'iview'
import qs from 'qs'

export default function (options) {
    return new Promise((resolve, reject) => {
        let createOption = {
            baseURL: baseUrl,
            timeout: 10E3,
            headers: {
                // 'Content-Type': 'application/json'
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        };
        if (createOption.headers['Content-Type'] === 'application/x-www-form-urlencoded' && options.data) {
            options.data = qs.stringify(options.data);
        }
        const instance = axios.create(createOption);
        instance.interceptors.request.use(
            options => options,
            error => Promise.reject(error)
        )

        instance.interceptors.response.use(
            response => {
                let { data } = response;
                if (typeof data === "string") {
                    if (response.status === 200) {
                        resolve({code: 200, msg: data, data: []});
                    } else if (response.status === 401){
                        // 登陆失效
                        router.push('/login');
                        reject(response)
                    } else {
                        if(options.noDialog===true){
                            reject(response)
                            return false;
                        }
                        Dialog({ type: 'error', text: data });
                        reject(response)
                    }
                } else {
                    if (!data.code) {
                        resolve(data)
                    } else if (data.code === 401) {
                        // 登陆失效
                        router.push('/login');
                        reject(response)
                    } else if (data.code === 422) {
                        // 登陆失败
                        reject(data.info)
                    } else if (data.code === 200) {
                        resolve(data)
                    } else {
                        if(options.noDialog===true){
                            response.data = {msg: response.data};
                            reject(response);
                            return false;
                        }
                        Dialog({ type: 'error', text: data.msg });
                        reject(response)
                    }
                }
            },
            error => {
                let { response } = error;
                if (response.status === 401){ 
                    // 登陆失效
                    router.push('/login');
                    reject(response);
                } else {
                    if(options.noDialog===true){
                        let obj = {data: {code: error.response.status,msg: error.response.data,data: []}};
                        reject(obj);
                        return false;
                    }
                    let text;
                    if (error.response) {
                        text = error.response.data;
                    } else {
                        text = error;
                    }
                    if (text)
                    Message.error(text)
                    // Dialog({ type: 'error', text });
                    reject(text);
                }
            }
        )
        instance(options)
    })
}




