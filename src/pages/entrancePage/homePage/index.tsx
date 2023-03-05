import { useEffect, useState } from "react";
import { View, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { baseUrl, heightRpx } from "../../../static";
import PaotuiIcon from "../../../icons/paotui.svg";
import XiadanIcon from "../../../icons/xiadan.svg";
export default function Home() {
    const [heightrpx, setHeightrpx] = useState(0);
    const [preTime, setPreTime] = useState(0); // 节流防抖
    useEffect(() => {
        heightRpx(res => {
            setHeightrpx(res);
        })
    }, [])
    return (<>
        <View style={{ overflow: "scroll", backgroundColor: "rgb(246,246,246)", height: "95vh", width: "750rpx" }}>
            <View style={{ display: "flex", width: "100%", height: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                <View style={{ width: "300rpx", height: "370rpx", backgroundColor: "white", borderRadius: "5px" }}>
                    <View onClick={() => {
                        // Taro.showToast({
                        //     title: '下单功能暂时还未对外开放哟~',
                        //     icon: 'none',
                        //     duration: 2000
                        // })
                        let nowTime = Date.now();
                        if (nowTime - preTime >= 2000) {
                            Taro.navigateTo({
                                url: "/pages/index/index"
                            });
                            setPreTime(nowTime);
                        }
                    }} className="flexCenter" style={{ width: "300rpx", height: "300rpx", }}>
                        <Image src={XiadanIcon} />
                    </View>
                    <View className="flexCenter" style={{ width: "100%", height: "70rpx", color: "#FF6634", fontWeight: "bold" }}>下单</View>
                </View>
                <View style={{ width: "300rpx", height: "370rpx", backgroundColor: "white", borderRadius: "5px" }}>
                    <View onClick={() => {
                        let nowTime = Date.now();
                        if (nowTime - preTime >= 2000) {
                            Taro.navigateTo({
                                url: `/pages/errand/index`
                            });
                            setPreTime(nowTime);
                        }
                    }} className="flexCenter" style={{ width: "300rpx", height: "300rpx" }}>
                        <Image src={PaotuiIcon} />
                    </View>
                    <View className="flexCenter" style={{ width: "100%", height: "70rpx", color: "#FF6634", fontWeight: "bold" }}>跑腿</View>
                </View>
            </View>
        </View>
    </>)
}