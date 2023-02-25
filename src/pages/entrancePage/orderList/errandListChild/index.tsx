import { View, Image } from "@tarojs/components";
import { baseUrl } from "../../../../static";
import Taro from "@tarojs/taro";
export default function orderList(props) {
    const { orderInfo } = props;
    return <View onClick={() => Taro.navigateTo({
        url: `/pages/errandDetail/index?openId=${orderInfo.openId}&orderIndex=${orderInfo.orderIndex}`
    })}
        style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20rpx", width: "95%", height: "300rpx", backgroundColor: "white", borderRadius: "10rpx" }}>
        <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "90%", height: "90%" }}>
            <View style={{ width: "100%", height: "60rpx", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <View style={{ fontSize: "27rpx", color: "rgb(129,129,129)" }}>{orderInfo.errandDate}</View>
                <View style={{ fontSize: "28rpx", color: "rgb(129,129,129)" }}>订单已创建</View>
            </View>
            <View style={{ border: "0px solid rgb(223,223,223)", borderWidth: "0px 0px 1px 0px", width: "100%", height: "180rpx", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ width: "45%", height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <View> <Image style={{ width: "70rpx", height: "70rpx" }} src={baseUrl + '/icon/duola.png'} /></View>
                    <View style={{ fontSize: "17px", marginTop: "-30rpx" }}>跑腿代购</View>
                </View>
                <View style={{ fontSize: "28rpx", color: "rgb(254,108,54)" }}>{orderInfo.orderType}</View>
            </View>
            {/* <View style={{ width: "100%", height: "60rpx", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <View style={{ fontSize: "28rpx", color: "rgb(129,129,129)" }}>付款: </View>
                <View style={{ color: "rgb(254,108,54)" }}> {orderInfo.totalPrice}￥</View>
            </View> */}
        </View>
    </View>
}