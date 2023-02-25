import { View, Text, Button } from "@tarojs/components";
import { useState, useEffect } from "react";
import { baseUrl, postApi, getStorageSync, addMessagesNumber, setStorageSync } from "../../static";
import Taro from "@tarojs/taro";
export default function Index() {
    const [messagesNumber, setMessagesNumber] = useState(0);
    useEffect(() => {
        postApi(`${baseUrl}/order/getMessagesNumber`, {
            openId: getStorageSync("openId"),
        }).then(res => {
            // console.log(res.data.data[0].messageNumber);
            setMessagesNumber(res.data.data[0].messageNumber);
            setStorageSync("messageNumber", res.data.data[0].messageNumber);
        })
    }, [])
    return <>
        <View className="flexCenter" style={{
            width: "750rpx", height: "70rpx",
        }}>
            <View style={{
                height: "80rpx", width: "650rpx", backgroundColor: "rgba(254,254,36,0.5)", borderRadius: "15rpx", fontSize: "13px"
                , display: "flex", justifyContent: "space-around", alignItems: "center"
            }}>
                <View style={{ width: "48%", height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: "0.5" }}>
                    <Text>消息通知剩余次数: </Text>
                    <Text>
                        <Text style={{ color: "rgb(254,107,54)" }}>{messagesNumber}</Text>
                        次
                    </Text>
                    <View className='at-icon at-icon-help' style={{ fontSize: "15px" }}
                        onClick={() => {
                            Taro.showModal({
                                title: '消息通知提示',
                                confirmText: "确定",
                                confirmColor: "#FE6b36",
                                content: '由于微信服务通知限制, 你需要点击增加消息通知次数才能及时收到房东或者租客的信息哟~',
                                showCancel: false,
                                success: function (res) {
                                    if (res.confirm) {
                                    }
                                }
                            })
                        }}
                    ></View>
                </View>
                <View style={{ width: "35%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <View style={{ width: "25%", height: "100%" }}></View>
                    <Button onClick={() => {
                        addMessagesNumber(messagesNumber, setMessagesNumber);
                    }} style={{ width: "75%", height: "70%", fontSize: "13px", backgroundColor: "rgba(255,255,255,0.7)", border: "none", }}>
                        <View className="flexCenter" style={{ position: "relative", top: "0rpx", width: "100%", height: "100%", opacity: "0.6" }}>点击增加</View>
                    </Button>
                </View>
            </View>
        </View>
    </>
}