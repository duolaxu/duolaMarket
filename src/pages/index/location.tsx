import QQMapWX from "../../static/location/qqmap-wx-jssdk.min";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { Input, View } from "@tarojs/components";


export default function Index() {
    var qqmapsdk;
    qqmapsdk = new QQMapWX({
        key: 'YLJBZ-DKCLX-PH34U-T4PXO-PVG23-ECBXK'//申请的开发者秘钥key
    });
    const [lat_1, setLat_1] = useState(0);
    const [lng_1, setLng_1] = useState(0);
    const [lat_2, setLat_2] = useState(0);
    const [lng_2, setLng_2] = useState(0);
    const [address, setAddress] = useState("");

    const getLocation = () => {
        Taro.getLocation({
            type: 'gcj02',
            success: res => {
                // 调用sdk接口
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    success: res => {
                        //获取当前地址成功
                    },
                    fail: res => {
                    }
                });
            },
        })
    };
    useEffect(() => {

        Taro.getLocation({
            type: 'gcj02', //返回可以用于 Taro.openLocation的经纬度
            success: function (res) {
                const latitude = res.latitude
                const longitude = res.longitude

                //下载qqmap-wx-jssdk,然后引入其中的js文件
                var QQMapWX = require('../../static/location/qqmap-wx-jssdk.min');

                var qqmapsdk = new QQMapWX({
                    key: 'YLJBZ-DKCLX-PH34U-T4PXO-PVG23-ECBXK' // 必填
                });

                //逆地址解析,通过经纬度获取位置等信息
                qqmapsdk.reverseGeocoder({
                    location: { latitude, longitude },
                    success: function (res) {
                        //获取当前城市
                        let result = res.result.location;
                        setAddress(res.result.address);
                        setLat_1(result.lat);
                        setLng_1(result.lng);
                        //具体参数查看
                        //https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodReverseGeocoder
                    }

                })
            }
        })
    }, [])

    const atuoGetLocation = (e) => {
        qqmapsdk.geocoder({
            address: e.detail.value,   //用户输入的地址（注：地址中请包含城市名称，否则会影响解析效果），如：'北京市海淀区彩和坊路海淀西大街74号'
            complete: res => {  //经纬度对象
                let result = res.result.location;
                setLat_2(result.lat);
                setLng_2(result.lng);
            }
        });
    }

    // 计算距离函数
    const Rad = (d) => {
        //根据经纬度判断距离
        return d * Math.PI / 180.0;
    }
    const getDistance = (lat1, lng1, lat2, lng2) => {
        var radLat1 = Rad(lat1);
        var radLat2 = Rad(lat2);
        var a = radLat1 - radLat2;
        var b = Rad(lng1) - Rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;
        s = Math.round(s * 10000) / 10000;
        s = parseFloat(s.toFixed(1)); //保留两位小数
        setAddress(s + 'km');
        return s
    }

    return (<>
        <View>{address}</View>
        <Input style={{ border: "1px solid rgb(255,208,54)" }} onBlur={atuoGetLocation} />
    </>)
}
