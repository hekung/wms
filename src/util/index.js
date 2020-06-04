import axios from './request.js'
import cityData from './city.data-3.js'
export default class Util {
    getCommonUrl() {
        if (process.env.NODE_ENV === 'development') {
            return '/vue-wms'
        } else {
            return location.origin + '/'
        }
    }
    getOrderAddress({ prov, city, area, address }) {
        let provinceName, cityName, areaName, addressRes
        // 获取省
        let provinceItem = cityData.find(pitem => {
            return pitem.value == prov
        })
        if (!provinceItem) {
            return ''
        }
        provinceName = provinceItem.text || ''
        // 获取市
        let cityItem = provinceItem.children.find(citem => {
            return citem.value == city
        })
        if (!cityItem) {
            return ''
        }
        cityName = cityItem.text || ''
        // 获取区
        let areaItem = cityItem.children.find(aitem => {
            return aitem.value == area
        })
        if (!areaItem) {
            return ''
        }
        areaName = areaItem.text || ''
        addressRes = address || ''
        return provinceName + cityName + areaName + addressRes
    }
    // 获取请求
    get(url, params) {
        return axios.get(url, params)
    }
    // 获取请求
    post(url, params) {
        return axios.post(url, params)
    }
    postDownLoadFile(url, params) {
        return axios({
            method: 'post',
            url,
            data: params,
            responseType: 'blob'
        })
    }
    // delete请求
    requestDelete(url, params) {
        return axios.delete(url, params)
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
    postForm1(url, params) {
        return axios({
            method: 'post',
            url,
            data: params,
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