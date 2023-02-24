import { View } from "@tarojs/components";
import { useEffect, useState } from "react";
import { heightRpx } from "../../../../static";
export default function Merchant(props) {
    const { merchantData } = props;
    const [heightrpx, setHeightrpx] = useState(0);
    useEffect(() => {
        heightRpx(res => {
            setHeightrpx(res);
        });
    }, [])
    return <>
        <View style={{ width: "750rpx", height: `${heightrpx - 380}rpx`, backgroundColor: "rgba(240,240,240,0.5)", zIndex: "100", }}>
            <View style={{ zIndex: "200" }}>
                <View style={{ width: "750rpx", height: "auto", backgroundColor: "rgb(240,240,240)", display: "flex", justifyContent: "center", zIndex: "200" }}>
                    <View style={{ width: "700rpx", height: "auto", borderRadius: "20rpx", marginTop: "20rpx", backgroundColor: "rgb(255,255,255)", display: "flex", justifyContent: "center" }}>
                        <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "90%", height: "80%" }}>
                            <View style={{ marginTop: "20rpx", marginLeft: "12rpx", fontSize: "18px", height: "60rpx" }}>商家信息</View>
                            <View style={{ marginTop: "20rpx", fontSize: "14px", height: "60rpx" }}>
                                <View className='at-icon at-icon-map-pin' style={{ paddingLeft: "4rpx" }}> 商家位置：{merchantData.storeLocation}</View>
                            </View>
                            {merchantData.storeConnection != 'undefined' ?
                                <View style={{ marginTop: "20rpx", height: "60rpx" }}>
                                    <View className='at-icon at-icon-phone' style={{ paddingLeft: "4rpx" }}> 商家电话:{merchantData.storeConnection}</View>
                                </View>
                                : ''}
                        </View>
                    </View>
                </View>
            </View>
        </View>

    </>
}