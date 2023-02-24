import { View, Image } from "@tarojs/components";
import { storeComponentProps } from "../type";
import { useEffect } from "react";
import { baseUrl, getDistance } from "../../../../static";
import Taro, { setStorageSync } from "@tarojs/taro";
import { useState } from "react";
import NavigationImg from "../../../../icons/navigation.svg";
export default function StoreComponent(props: storeComponentProps) {

    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [distance, setDistance] = useState('');
    const [showFullLocation, setShowFullLocation] = useState(false);

    useEffect(() => {

        getDistance(storeData.storeLocation, (lat, lng, distance) => {
            setLat(lat);
            setLng(lng);
            setDistance(distance);
        })

    }, [])

    useEffect(() => {
    }, [])

    const checkLocation = () => {
        let key = 'YLJBZ-DKCLX-PH34U-T4PXO-PVG23-ECBXK';  //使用在腾讯位置服务申请的key
        let referer = 'duolaGo_new';   //调用插件的app的名称
        let endPoint = JSON.stringify({  //终点
            'name': storeData.storeLocation,
            'latitude': lat,
            'longitude': lng
        });
        Taro.navigateTo({
            url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
        }); // 打开腾讯地图
    }

    const { storeData } = props;
    return (<>
        <View
            onClick={() => {
                Taro.navigateTo({
                    url: `/pages/index/index?storeId=${storeData.storeId}&storeHeadImg=${storeData.storeHeadImg}&storeLocation=${storeData.storeLocation}&storeName=${storeData.storeName}&storeConnection=${storeData.storeConnection}`
                });
                setStorageSync("storeId", storeData.storeId);
                setStorageSync("storeHeadImg", storeData.storeHeadImg);
                setStorageSync("storeLocation", storeData.storeLocation);
                setStorageSync("storeName", storeData.storeName);
                setStorageSync("storeConnection", storeData.storeConnection);
            }
            }
            style={{
                width: "700rpx",
                height: "216rpx",
                backgroundColor: "white",
                borderRadius: "15rpx",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <View style={{ borderRadius: "20rpx", height: "185rpx", width: "95%", display: "flex" }}>
                <View style={{ width: "30%", height: "185rpx", borderRadius: "20rpx" }}>
                    <Image style={{ borderRadius: "20rpx", width: "185rpx", height: "185rpx" }} src={baseUrl + storeData.storeHeadImg} />
                </View>
                <View style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "40%", height: "100%," }}>
                    <View style={{ fontSize: "17px" }}>{storeData.storeName}</View>
                    <View></View>
                    <View
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowFullLocation(true);
                            setTimeout(() => {
                                setShowFullLocation(false);
                            }, 2000)
                        }}
                        style={{
                            color: "rgb(157,157,157)",
                            fontSize: "13px",
                            overflow: "hidden",
                            textOverflow: "ellipsis", // 文字超出部分以省略号展示
                            whiteSpace: "nowrap",
                            width: "100%",
                        }}>
                        {showFullLocation ?
                            <View
                                style={{
                                    position: "absolute",
                                    bottom: "35rpx",
                                    wordBreak: "break-word",// 在单词和url内部换行
                                    whiteSpace: "pre-line",// 合并空白符序列并保留换行符
                                    fontSize: "13px",
                                    zIndex: "10",
                                    width: "100%",
                                    color: "white",
                                    height: "auto",
                                    userSelect: "all", // 单击文本区域复制全文本
                                    backgroundColor: "rgba(154,154,154,0.5)",
                                    borderRadius: "3px"
                                }}>{storeData.storeLocation}</View> : ''}
                        <View className="at-icon at-icon-map-pin"></View>
                        {storeData.storeLocation}
                    </View>
                </View>
                <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center", width: "30%", height: "100%," }}>
                    <View onClick={checkLocation} style={{ width: "100%", height: "60%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Image style={{
                            width: "50rpx",
                            height: "50rpx",
                            paddingRight: "10rpx"
                        }} src={NavigationImg} />
                        <View style={{ color: "#FEBB40" }}>导航</View>

                    </View>
                    <View style={{ width: "100%", height: "40%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "14px", color: "rgb(153,153,153)" }}>
                        <View>{distance}</View>
                    </View>
                </View>
            </View>
        </View>
    </>)
}