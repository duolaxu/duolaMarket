export const baseUrl = 'https://duolago.cn';// 进行nginx代理，作了端口映射
import Taro from "@tarojs/taro";

export const screenInfo = async (callback) => { // 手机屏幕信息
    const res = await Taro.getSystemInfo();
    callback(res);
}

export const heightRpx = async (callback) => { // 手机屏幕信息
    const res = await Taro.getSystemInfo();
    const width = res.windowWidth;
    const height = res.windowHeight; // 屏幕可用高度
    const pxTorpx: number = (750 / width); // px与rpx的换算
    const heightRpx = height * pxTorpx; // 屏幕高度，单位rpx
    callback(heightRpx.toFixed(0));
}

export const pxTorpx = async (callback) => { // 手机屏幕信息
    const res = await Taro.getSystemInfo();
    const width = res.windowWidth;
    const pxTorpx = (750 / width);
    callback(pxTorpx);
}

export const getStorage = (key, cb) => {
    Taro.getStorage({
        key,
        success: function (res) {
            cb(res.data);
        }
    })
};

export const getStorageSync = (key) => {
    return Taro.getStorageSync(key);
};

export const setStorage = (key, data, cb?) => {
    Taro.setStorage({
        key,
        data,
        success: function (res) {
            cb && cb(res);
        }
    })
};

export const setStorageSync = (key, data) => { // 尽量不用，data只能为字符串形式
    Taro.setStorageSync(key, data);
};

export const swapTime = () => {
    let date = new Date();
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

    let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    let strDate = Y + M + D + h + m + s;
    return strDate;
}

// export const swapStrTime = (date) => {
//     // let date = new Date();
//     let Y = date.getFullYear() + '-';
//     let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
//     let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';

//     let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
//     let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
//     let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
//     let strDate = Y + M + D + h + m + s;
//     return strDate;
// }

export const distance = (lat1, lng1, lat2, lng2) => {
    // lat1用户的纬度
    // lng1用户的经度
    // lat2商家的纬度
    // lng2商家的经度
    const Rad = (d) => {
        //根据经纬度判断距离
        return d * Math.PI / 180.0;
    }
    var radLat1 = Rad(lat1);
    var radLat2 = Rad(lat2);
    var a = radLat1 - radLat2;
    var b = Rad(lng1) - Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = parseFloat(s.toFixed(1)); //保留两位小数
    // setAddress(s);
    return s + 'km';
}

// 获取两地之间距离
export const getDistance = (location, callback) => {
    const QQMapWX = require('./location/qqmap-wx-jssdk');

    const qqmapsdk = new QQMapWX({
        key: 'YLJBZ-DKCLX-PH34U-T4PXO-PVG23-ECBXK' // 必填
    });

    let lat_1 = 0;
    let lng_1 = 0;

    Taro.getLocation({
        type: 'gcj02', //返回可以用于 Taro.openLocation的经纬度
        success: function (res) {
            const latitude = res.latitude
            const longitude = res.longitude

            //下载qqmap-wx-jssdk,然后引入其中的js文件

            //逆地址解析,通过经纬度获取位置等信息
            qqmapsdk.reverseGeocoder({
                location: { latitude, longitude },
                success: function (res) {
                    //获取当前城市
                    lat_1 = res.result.location.lat;
                    lng_1 = res.result.location.lng;
                    qqmapsdk.geocoder({
                        address: location,   //用户输入的地址（注：地址中请包含城市名称，否则会影响解析效果），如：'北京市海淀区彩和坊路海淀西大街74号'
                        complete: res => {
                        },
                        success: res => {
                            let result = res.result.location;
                            callback(result.lat, result.lng, distance(lat_1, lng_1, result.lat, result.lng))
                        },
                        fail: res => {
                        }
                    });
                    //具体参数查看
                    //https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodReverseGeocoder
                }

            })


        }
    })
}

export const getNowLocation = (callback) => {
    Taro.getLocation({
        type: 'gcj02', //返回可以用于 Taro.openLocation的经纬度
        success: function (res) {
            const latitude = res.latitude
            const longitude = res.longitude
            //下载qqmap-wx-jssdk,然后引入其中的js文件
            var QQMapWX = require('./location/qqmap-wx-jssdk.min');

            var qqmapsdk = new QQMapWX({
                key: 'YLJBZ-DKCLX-PH34U-T4PXO-PVG23-ECBXK' // 必填
            });

            //逆地址解析,通过经纬度获取位置等信息
            qqmapsdk.reverseGeocoder({
                location: { latitude, longitude },
                success: function (res) {
                    //获取当前城市
                    // setAddress(res.result.address);
                    callback(res.result.address);
                    setStorageSync('address', res.result.address);
                    //具体参数查看
                    //https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodReverseGeocoder
                }

            })
        }
    })
}

export const postApi = async (url: string, params: Object, header?: Object) => {
    const res = await Taro.request({
        url,
        data: params,
        method: "POST",
        header: {
            'Content-Type': 'application/json;charset=utf-8', // 默认值
            ...header
        },
    });
    return res;
}

export const getApi = (url: string, callback: Function, header?: Object) => {
    Taro.request({
        url: url,
        method: "GET",
        header: {
            'content-type': 'application/json', // 默认值
            ...header
        },
        success: res => {
            callback(res);
        }
    })
}

// 判断输入框内容是否为空
export const judgeInput = (str: string) => {
    let lent = str.length;
    if (str == "") {
        return false;
    }
    for (let i = 0; i < lent; i++) {
        if (str[i] != ' ') {
            return true;
        }
    }
    return false;
}

// 订阅消息开启
export const addMessagesNumber = (messagesNumber, setMessagesNumber) => {
    Taro.requestSubscribeMessage({   // 调起消息订阅界面
        tmplIds: ['XOZ7GeyCMY3YuQCOeQgjrXYys-UZy_bu_TRK8KOnUzI'],
        success(res) {
            let Values = Object.values(res);
            let judge = Values.indexOf('accept') == -1 ? false : true;
            if (judge) {
                postApi(`${baseUrl}/order/updateMessagesNumber`, {
                    openId: getStorageSync("openId"),
                    messageNumber: messagesNumber + 1,
                }).then(res => {
                    if (res.data.code == 0)
                        setMessagesNumber(number => number + 1);
                })
            }
        },
        fail(err) {
            console.log(err);
        }
    })

}