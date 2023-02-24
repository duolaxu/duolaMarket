import StoreComponent from "./storeComponent";
import Taro from "@tarojs/taro";
import { baseUrl, setStorageSync } from "../../../static";
import { useEffect, useState } from "react";
import { View } from "@tarojs/components";
export default function Home() {
    const [address, setAddress] = useState("");
    const [storeList, setStoreList] = useState([]);
    useEffect(() => {
        Taro.getLocation({
            type: 'gcj02', //返回可以用于 Taro.openLocation的经纬度
            success: function (res) {
                const latitude = res.latitude
                const longitude = res.longitude
                //下载qqmap-wx-jssdk,然后引入其中的js文件
                var QQMapWX = require('../../../static/location/qqmap-wx-jssdk.min');

                var qqmapsdk = new QQMapWX({
                    key: 'YLJBZ-DKCLX-PH34U-T4PXO-PVG23-ECBXK' // 必填
                });

                //逆地址解析,通过经纬度获取位置等信息
                qqmapsdk.reverseGeocoder({
                    location: { latitude, longitude },
                    success: function (res) {
                        //获取当前城市
                        setAddress(res.result.address);
                        setStorageSync('address', res.result.address);
                        //具体参数查看
                        //https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodReverseGeocoder
                    }

                })
            }
        })

        Taro.request({
            url: `${baseUrl}/order/getStoreList`, //仅为示例，并非真实的接口地址
            method: "GET",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                setStoreList(res.data.data);
            }
        })
    }, [])

    const renderStoreList = () => {
        return storeList.map(item => {
            return <>
                <View style={{ width: "100%", height: "240rpx", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <StoreComponent storeData={item} />
                </View>
            </>
        })
    }
    return (<>
        <View style={{ backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "fixed", top: "0px", height: "75rpx", width: "750rpx", zIndex: "1001" }}>
            <View style={{ width: "90%", height: "90%", }}>
                <View style={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
                    <View className='at-icon at-icon-map-pin'></View>
                    <View style={{ color: "rgb(127,127,127)", fontSize: "14px" }}>{address}</View>
                </View>
            </View>
        </View>
        <View style={{ overflow: "scroll", backgroundColor: "rgb(246,246,246)", height: "100vh", width: "750rpx" }}>
            <View style={{ width: "750rpx", height: "75rpx" }}></View>
            {renderStoreList()}
            <View style={{ height: "115rpx" }}></View>
        </View>
    </>)
}