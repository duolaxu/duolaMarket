import { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import "taro-ui/dist/style/components/icon.scss";
import Home from "./home";
import HomePage from "./homePage";
import OrderList from "./orderList";
import MinePage from "./minePage";
import Taro from "@tarojs/taro";
import { baseUrl, setStorageSync, postApi, getApi } from "../../static";

export default function BottomBar() {
    const [newUser, setNewUser] = useState(false);
    const getUserInfo = () => {
        var _this = this
        Taro.showModal({
            title: '温馨提示',
            content: '亲，授权微信登录后才能正常使用小程序功能',
            success(res) {
                //如果用户点击了确定按钮
                if (res.confirm) {
                    Taro.getUserProfile({
                        desc: '获取你的昵称、头像、地区及性别',
                        success: res => {
                            _this.setData({
                                userInfo: res.userInfo,
                                hasUserInfo: true
                            })
                        },
                        fail: res => {
                            //拒绝授权
                            Taro.showToast({
                                title: '您拒绝了请求,不能正常使用小程序',
                                icon: 'error',
                                duration: 2000
                            });
                            return;
                        }
                    });
                } else if (res.cancel) {
                    //如果用户点击了取消按钮
                    Taro.showToast({
                        title: '您拒绝了请求,不能正常使用小程序',
                        icon: 'error',
                        duration: 2000
                    });
                    return;
                }
            }
        });
    }
    useEffect(() => {
        Taro.login({
            success(res) {
                if (res.code) {
                    //发起网络请求
                    Taro.request({
                        url: `${baseUrl}/order/getOpenId`,
                        data: {
                            code: res.code
                        },
                        method: "POST",
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: function (res) {
                            setStorageSync("openId", res.data.data.openid);
                            // console.log("openId = ", res.data.data);
                            setStorageSync("sessionKey", res.data.data.session_key);
                            if (res.data.code == 0) {
                                setNewUser(false);
                            } else {
                                setNewUser(true);
                            }
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
        // let urlHttps = "https://duolago.cn";
        // urlHttps = encodeURI(urlHttps);
        // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb2af49ed2e30db19&redirect_uri=${urlHttps}&response_type=code&scope=snsapi_base#wechat_redirect`;
        // getApi(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb2af49ed2e30db19&redirect_uri=${urlHttps}&response_type=code&scope=snsapi_base#wechat_redirect`, res => {
        //     // console.log("返回数据 = ", res);
        //     Taro.showModal({
        //         title: '提示',
        //         content: res.data,
        //         success: function (res) {
        //             if (res.confirm) {
        //                 console.log('用户点击确定')
        //             } else if (res.cancel) {
        //                 console.log('用户点击取消')
        //             }
        //         }
        //     })
        // })
        // https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect
    }, [])
    const [activeIndex, setActiveIndex] = useState<Number>(0);
    let bottomText = [
        "首页",
        "订单",
        "我的",
    ]
    const icons = ['home', 'shopping-bag', 'user'];
    const selectFunc = (index) => {
        setActiveIndex(index);
    }
    const topTitle = ['duolaGo', '订单', '我的'];

    // orderList参数
    const orderInfo = [{
        orderDate: "2022-10-12 20:19:24",
        orderStatus: "已完成",
        storeHeadImg: "/dishImg/1665294308315duola.png",
        storeName: "哆啦over",
        orderPrice: "0",
        orderType: "堂食",
    }, {
        orderDate: "2022-10-12 21:05:45",
        orderStatus: "已完成",
        storeHeadImg: "/dishImg/1665294308315duola.png",
        storeName: "哆啦over",
        orderPrice: "0",
        orderType: "堂食",
    }]

    const renderMainPage = () => {
        return <>
            <View>
                <View style={{ display: activeIndex == 0 ? "block" : "none" }}>
                    {/* <Home /> */}
                    <HomePage />
                </View>
                <View style={{ display: activeIndex == 1 ? "block" : "none" }}>
                    <OrderList activeIndex={activeIndex} orderInfo={orderInfo} />
                </View>
                <View style={{ display: activeIndex == 2 ? "block" : "none" }}>
                    <MinePage activeIndex={activeIndex} />
                </View>
            </View>
        </>
    }

    const selectBar = (index) => {
        activeIndex == index ? "" : (Taro.vibrateShort(), selectFunc(index));
        Taro.setNavigationBarTitle({ title: topTitle[index] });
    }

    return (<>
        <View>
            <View>
                {renderMainPage()}
            </View>
            <View
                style={{
                    width: "750rpx", height: "115rpx",
                    backgroundColor: "white",
                    display: 'flex', justifyContent: "space-around",
                    alignItems: 'center',
                    position: 'fixed',
                    bottom: '0px',
                    border: "0px solid rgb(230,230,230)",
                    borderWidth: "1px 0px 0px 0px",
                    zIndex: "103"
                }}>
                {
                    bottomText.map((item, index) =>
                        <View
                            style={{
                                fontSize: "30rpx",
                                color: activeIndex == index ? "rgb(254,108,54)" : "rgb(157,157,157)",
                                height: "100%",
                                width: "100%",
                                display: 'flex', justifyContent: "space-around",
                                alignItems: 'center',
                            }}
                        >
                            <View onClick={() => { selectBar(index) }}
                                style={{
                                    fontSize: "30rpx",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "70%",
                                    height: "100%",
                                }}>
                                <View style={activeIndex == index ? {
                                    fontSize: "50rpx",
                                    transition: "fontSize 2s,color 0.5s"
                                } : {
                                    fontSize: "45rpx",
                                    transition: "fontSize 2s,color 0.5s"
                                }} className={`at-icon at-icon-${icons[index]}`}></View>
                                <View style={{ color: "rgb(127,127,127)" }}>{item}</View>
                            </View>
                        </View>)
                }
            </View>
        </View>
    </>)
}
