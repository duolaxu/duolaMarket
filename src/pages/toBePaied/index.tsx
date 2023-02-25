import { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import "taro-ui/dist/style/components/icon.scss";
import { heightRpx, getStorageSync, baseUrl } from "../../static";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { orderType, paramsType } from "./type";

export default function BottomBar() {
    const params = getCurrentInstance().router?.params;

    const [heightrpx, setHeightRpx] = useState(0);
    const [order, setOrder] = useState<orderType>();
    useEffect(() => {
        Taro.request({
            url: `${baseUrl}/order/getSingleOrder`, // 获取单个订单信息
            data: {
                openId: params?.openId,
                orderIndex: params?.orderIndex
            },
            method: "POST",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: res => {
                setOrder(res.data.data[0]);
            }
        })
        heightRpx(res => {
            setHeightRpx(res);
        })
    }, [])

    const renderOrder = () => {
        let orderList = order?.shopList.split(";");
        orderList?.pop();
        return orderList?.map(item => {
            let res = item.split("&");
            return <>
                <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "70rpx" }}>
                    <View>{res[0]}</View>
                    <View>*{res[1]}</View>
                </View>
            </>
        })
    }

    return (<>
        <View style={{ position: "relative", zIndex: "100", display: "flex", flexDirection: "column", alignItems: "center", width: "750rpx", height: "auto", backgroundColor: "rgb(244,244,244)", overflow: "scroll", }}>
            <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center", width: "95%", height: "320rpx", backgroundColor: "white", marginTop: "15rpx", borderRadius: "5px" }}>
                <View style={{ fontSize: "18px", height: "40%", display: "flex", alignItems: "center" }}>订单凭证</View>
                <View style={{ fontSize: "32px", height: "30%", display: "flex", alignItems: "flex-start" }}>{order?.certificate}</View>
                <View style={{ height: "30%", display: "flex", alignItems: "center" }}>
                    <View style={{ color: "rgb(254,187,64)", backgroundColor: "rgb(255,248,236)", fontSize: "12px", padding: "3rpx 20rpx 3px 20rpx", borderRadius: "13px" }}>请留意叫号, 祝你用餐愉快! </View>
                </View>
            </View>
            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "95%", height: "320rpx", backgroundColor: "white", marginTop: "15rpx", borderRadius: "5px" }}>
                <View style={{ width: "92%", height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start", }}>
                    <View style={{ fontSize: "18px" }}>订单已完成</View>
                    <View style={{ fontSize: "14px", color: "rgb(153,153,153)" }}>感谢你对我们的信任, 期待您的下次光临</View>
                    <View onClick={() => Taro.navigateTo({
                        url: `/pages/evaluate/index`
                    })
                    } style={{ color: "rgb(153,153,153)", width: "170rpx", height: "65rpx", borderRadius: "4px", display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid rgb(221,221,221)", fontSize: "13px" }}>评价</View>
                </View>
            </View>
            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "95%", height: "auto", backgroundColor: "white", marginTop: "15rpx", borderRadius: "5px" }}>
                <View style={{ width: "92%", height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start", }}>
                    <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "0px solid rgb(221,221,221)", borderWidth: "0px 0px 1px 0px", width: "100%", height: "125rpx", fontSize: "18px" }}>
                        <View>{order?.storeName}</View>
                        <View onClick={() => {
                            Taro.makePhoneCall({
                                phoneNumber: order?.storeConnection ? order?.storeConnection : '', // 拨打电话
                            })
                        }} className="at-icon at-icon-phone" style={{ fontSize: "22px", color: "rgb(254,108,54)" }}></View>
                    </View>
                    <View style={{ fontSize: "12px", color: "rgb(153,153,153)", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                        {order?.shopList != "" ? renderOrder() : ''}
                        <View style={{ border: "0px solid rgb(221,221,221)", borderWidth: "0px 0px 1px 0px", width: "100%", height: "20rpx" }}>

                        </View>
                    </View>
                    <View style={{ width: "100%", height: "100rpx", fontSize: "13px", color: "rgb(153,153,153)", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                        合计: <View style={{ color: "rgb(254,108,54)" }}> {order?.totalPrice}￥</View>
                    </View>
                </View>
            </View>
            <View style={{ width: "95%", height: "auto", backgroundColor: "white", marginTop: "15rpx", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center" }}>

                <View style={{ width: "92%", height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start", }}>
                    <View style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", border: "0px solid rgb(221,221,221)", borderWidth: "0px 0px 1px 0px", width: "100%", height: "125rpx", fontSize: "18px" }}>订单信息</View>
                    <View style={{ fontSize: "12px", color: "rgb(153,153,153)", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                        <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "70rpx" }}>
                            <View>备注</View>
                            <View>{order?.remarks}</View>
                        </View>
                        <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "70rpx" }}>
                            <View>订单编号</View>
                            <View>{order?.orderIndex}</View>
                        </View>
                        <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "70rpx" }}>
                            <View>下单时间</View>
                            <View>{order?.orderDate}</View>
                        </View>
                        <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "70rpx" }}>
                            <View>支付方式</View>
                            <View>{order?.orderPayType}</View>
                        </View>
                    </View>
                </View>


            </View>
            <View style={{ backgroundColor: "rgb(244,244,244)", width: "100%", height: "40rpx" }}></View>
        </View>
        <View style={{ zIndex: "0", position: "fixed", top: "0px", left: "0px", backgroundColor: "rgb(244,244,244)", width: "750rpx", height: heightrpx + "rpx" }}></View>
    </>)
}