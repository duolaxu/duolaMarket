import OrderListChild from "./orderListChild";
import { View } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { baseUrl, getStorageSync, heightRpx } from "../../../static";
export default function orderList(props) {
    const [orderInfo, setOrderInfo] = useState([]);
    const [heightrpx, setHeightRpx] = useState(0);
    const { activeIndex } = props;
    useEffect(() => {
        if (activeIndex == 1) {
            heightRpx(res => {
                setHeightRpx(res);
            })
            Taro.request({
                url: `${baseUrl}/order/getOrderDetail`,
                data: {
                    openId: getStorageSync("openId")
                },
                method: "POST",
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: res => {
                    setOrderInfo(res.data.data);
                }
            })
        }
    }, [activeIndex])
    const renderOrderList = () => {
        return orderInfo.map(orderInfo => {
            return <OrderListChild orderInfo={orderInfo} />

        })
    }
    return (<>
        <View style={{ zIndex: "1", width: "750rpx", height: heightrpx + 'rpx', backgroundColor: "rgb(224,224,224)", position: "fixed", left: "0rpx", top: "0rpx" }}></View>
        <View style={{
            position: "relative",
            zIndex: "10",
            width: "750rpx",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center"
        }}>
            {renderOrderList()}
        </View>
        <View style={{ width: "750rpx", height: "130rpx" }}></View>
    </>)
}