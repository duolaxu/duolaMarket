import { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {heightRpx} from "../../../static";
export default function Home() {
    const [heightrpx,setHeightrpx] = useState(0);
    useEffect(() => {
        heightRpx(res => {
            setHeightrpx(res);
        })
    }, [])
    return (<>
        <View style={{ overflow: "scroll", backgroundColor: "rgb(246,246,246)", height: "95vh", width: "750rpx" }}>
            <View style={{ display: "flex", width: "100%", height: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                <View onClick={() => {
                    Taro.navigateTo({
                        url: "/pages/index/index"
                    })
                }} className="flexCenter" style={{ width: "300rpx", height: "300rpx", backgroundColor: "aqua" }}>下单</View>
                <View className="flexCenter" style={{ width: "300rpx", height: "300rpx", backgroundColor: "yellow" }}>跑腿</View>
            </View>
        </View>
    </>)
}