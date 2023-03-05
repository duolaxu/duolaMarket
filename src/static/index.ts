export const baseUrl = 'https://duolago.cn';// 进行nginx代理，作了端口映射
import Taro from "@tarojs/taro";
import md5 from "md5";

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
                    openId: 'ofsx15BMM25n5I1nmT4Xg7X9x3Dg',
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

// 订单打印模板
export const templatePrintData = (time, orderIndex, address, name, phone, type, certificate, order, totalPrice) => {
    // return `
    // <S2><C>巷子里超市</C></S2>
    // <S2><C>-在线支付-</C></S2>
    // <S2><C>[预订单]</C></S2>
    // =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
    // <RN>下单时间: ${time}
    // <RN>订单编号: ${orderIndex}
    // <H2><C><TR><TD>脆笋腊肉饭</TD><TD>×1</TD><TD>21</TD></TR><TR><TD>冰红茶</TD><TD>×1</TD><TD>6</TD></TR></C></H2>
    // ****************************<RN>
    // <H2>总价:18</H2><RN>
    // 地址: ${address}<RN>
    // ${name} ${phone}<RN>`
    let str = "";
    for (let i = 0; i < order.length; i++) {
        str += `<TR><TD>${order[i].dishName}</TD><TD>*${order[i].dishCounts}</TD><TD>${parseInt(order[i].dishPrice) * order[i].dishCounts}元</TD></TR>`
    }
    return `
    <S1>巷子里超市</S1><RN>
    <S1>-在线支付-</S1><RN>
    <S1>[${type}订单]</S1><RN>
    =*=*=*=*=*=*=*=*=*=*=*=*=*=*
    <S1>订单凭证: ${certificate}</S1><RN>
    <S1>购买物品: </S1><RN>
    <H2>
    ${str}
    </H2>
    <C><S1>总计: ${totalPrice}元</S1></C>
    ****************************<RN>
    <S1>下单时间: ${time}</S1><RN>
    <S1>订单编号: ${orderIndex}</S1><RN>
    <S1>地址: ${address}</S1><RN>
    <S1>${name} ${phone}</S1><RN>`
}

// 打印订单
export const printOrder = (time, printData) => {
    let a = { "appid": 10439, "timestamp": time, "deviceid": "70007846", "devicesecret": "uwrum8u8", "printdata": printData };
    function compareFunction() {
        return function (src, tar) {
            //获取比较的值
            var v1 = src;
            var v2 = tar;
            if (v1 > v2) {
                return 1;
            }
            if (v1 < v2) {
                return -1;
            }
            return 0;
        };
    }
    function generatesign(param, secret) {
        let arr: any = [];
        for (let key in param) {
            arr.push(key);

        }
        let newarr = arr.sort(compareFunction());
        var stringToSigned = '';
        for (var i = 0; i < newarr.length; i++) {
            if (newarr[i] && newarr[i] != 'appsecret') {
                let key = newarr[i];
                stringToSigned += newarr[i] + param[key];
            }
        }
        stringToSigned += secret;
        return md5(stringToSigned);
    }
    let secret = 'd1985be4352368bc23cf85bd07d1ecf2';
    let param = a;
    let sign = generatesign(param, secret);
    param['sign'] = sign;
    postApi('https://open-api.ushengyun.com/printer/print', param);
}

// 跑腿订单打印列表
export const templatePrintErrandData = (time, orderIndex, address, name, phone, orderText, certificate, arriveTime) => {
    return `
    <S1>巷子里超市</S1><RN>
    <S1>-在线支付-</S1><RN>
    <S1>[跑腿订单]</S1><RN>
    =*=*=*=*=*=*=*=*=*=*=*=*=*=*
    <S1>订单凭证: ${certificate}</S1><RN>
    <S1>跑腿内容: ${orderText}</S1><RN>
    ****************************<RN>
    <S1>下单时间: ${time}</S1><RN>
    <S1>期望送达时间: ${arriveTime}</S1><RN>
    <S1>订单编号: ${orderIndex}</S1><RN>
    <S1>地址: ${address}</S1><RN>
    <S1>${name} ${phone}</S1><RN>`
}

// 打印跑腿订单
export const printErrandOrder = (time, printData) => {
    let a = { "appid": 10439, "timestamp": time, "deviceid": "70007846", "devicesecret": "uwrum8u8", "printdata": printData };
    function compareFunction() {
        return function (src, tar) {
            //获取比较的值
            var v1 = src;
            var v2 = tar;
            if (v1 > v2) {
                return 1;
            }
            if (v1 < v2) {
                return -1;
            }
            return 0;
        };
    }
    function generatesign(param, secret) {
        let arr: any = [];
        for (let key in param) {
            arr.push(key);

        }
        let newarr = arr.sort(compareFunction());
        var stringToSigned = '';
        for (var i = 0; i < newarr.length; i++) {
            if (newarr[i] && newarr[i] != 'appsecret') {
                let key = newarr[i];
                stringToSigned += newarr[i] + param[key];
            }
        }
        stringToSigned += secret;
        return md5(stringToSigned);
    }
    let secret = 'd1985be4352368bc23cf85bd07d1ecf2';
    let param = a;
    let sign = generatesign(param, secret);
    param['sign'] = sign;
    postApi('https://open-api.ushengyun.com/printer/print', param);
}