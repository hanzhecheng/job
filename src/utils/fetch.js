import axios from "axios";
import {
    notification
} from 'antd';
const methods = ["get", "post"]
let ajax = axios.create({
    timeout: 50000
})
const fetch = {}
ajax.interceptors.request.use(config => {

    return config
}, error => {
    return new Promise.reject(error)
})
const errorMsg = {
    400: "请求错误",
    401: "未授权，请重新登录",
    403: "拒绝访问",
    404: "请求错误,未找到该资源",
    405: "请求方法未允许",
    408: "请求超时",
    500: "服务器端出错",
    501: "网络未实现",
    502: "网络错误",
    503: "服务不可用",
    504: "网络超时",
    505: "http版本不支持该请求"
};

ajax.interceptors.response.use(response => {
    return response
}, error => {
    // 请求错误时做些事
    if (error && error.response) {
        let errMsg = errorMsg[error.response.status]
        error.message = errMsg ? errMsg : `连接错误${error.response.status}`

    } else {
        error.message = "连接到服务器失败"
    }

    notification['error']({
        message: '温馨提示',
        description: error.message
    });
    return new Promise(error)
})
methods.forEach(item => {
    fetch[item] = function (url, data, config) {
        return new Promise(function (resolve, reject) {
            ajax[item](url, data, config).then(response => {
                if (response.data.status === 1) {
                    resolve(response.data);
                } else {
                    notification['error']({
                        message: '温馨提示',
                        description: response.data.message
                    });
                    reject(response.data.message)
                }
            }).catch(error => {
                reject(error.message)
            })
        })
    }
})
export default fetch