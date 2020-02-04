import axios from './request.js'
export default class Util {
    getCommonUrl() {
        if (process.env.NODE_ENV === 'development') {
            return '开发环境地址'
        } else {
            return '生产环境地址'
        }
    }
    // 获取请求
    get(url, params) {
        return axios.get(url, params)
    }
    // 获取请求
    post(url, params) {
        return axios.post(url, params)
    }
    // form格式请求
    postForm(url, params) {
        return axios({
            method: 'post',
            url,
            data: params,
            transformRequest: [
                function (data) {
                    let ret = ''
                    for (let it in data) {
                        ret +=
                            encodeURIComponent(it) +
                            '=' +
                            encodeURIComponent(data[it]) +
                            '&'
                    }
                    ret = ret.substring(0, ret.lastIndexOf('&'))
                    return ret
                }
            ],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }
    getCookieAll() {
        var obj = {};
        var arr = document.cookie.split('; ');
        for (var i = 0; i < arr.length; i++) {
            obj[arr[i].split('=')[0]] = arr[i].split('=')[1];
        }
        return obj;
    }
    getCookie(key) {
        return this.getCookieAll()[key];
    }
    setCookie(key, value, day) {
        var date = new Date().getTime() + day * 1000 * 60 * 60 * 24;
        document.cookie = key + '=' + value + ';expires=' + new Date(date).toUTCString();
    }
    removeCookie(key) {
        var date = new Date().getTime() - 1;
        document.cookie = key + '=;expires=' + new Date(date).toUTCString();
    }
}