import { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import "taro-ui/dist/style/components/icon.scss";
import HomePage from "./homePage";
import OrderList from "./orderList";
import MinePage from "./minePage";
import Taro, { getStorageSync } from "@tarojs/taro";
import { baseUrl, setStorageSync, postApi } from "../../static";

export default function BottomBar() {
    const [newUser, setNewUser] = useState(false);

    const getDishTypeList = (index, type) => {
        postApi(`${baseUrl}/order/getUpTypeDishList`, {
            storeId: 7,
            dishType: type
        }).then(res => {
            // console.log("数据 = ", res);
            setStorageSync(type, res.data.data);
            // dishDataOver[index] = new Array();
            // dishDataOver[index] = res.data.data;
            // setDataOver(dishDataOver);
            // typeLength[index] = res.data.data.length;
            // let arr = [];
            // for (let i = 0; i < dishDataOver.length; i++) {
            //     arr = arr.concat(dishDataOver[i]);
            // }
            // setDishData(arr);
            // setDataChange(pre => !pre);
        })
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

        Taro.request({
            url: `${baseUrl}/order/getDishTypeList`,
            data: {
                // storeId: storeParams.storeId
                storeId: 7
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                let typeList = res.data.data;
                // console.log("TYPELIST = ", res.data.data);
                setStorageSync("dishTypeList", res.data.data);
                // console.log(getStorageSync("dishTypeList"));
                // setDishTypeLength(typeList.length);
                // setDishTypeList(typeList);
                for (let i = 0; i < typeList.length; i++) {
                    setTimeout(() => {
                        getDishTypeList(i, typeList[i]);
                    }, 10 * i)
                }
            }
        })

        Taro.request({
            url: `${baseUrl}/order/getSingleStore`,
            data: {
                // storeId
                storeId: 7
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                //   setStoreData(res.data.data[0]);
                // console.log("location = ", res.data.data[0].storeLocation);
                setStorageSync("storeLocation", res.data.data[0].storeLocation);
            }
        })

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
