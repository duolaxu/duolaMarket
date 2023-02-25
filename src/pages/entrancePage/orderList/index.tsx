import OrderListChild from "./orderListChild";
import ErrandListChild from "./errandListChild";
import { View } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { baseUrl, getStorageSync, heightRpx } from "../../../static";
export default function orderList(props) {
    const [orderInfo, setOrderInfo] = useState([]);
    const [heightrpx, setHeightRpx] = useState(0);
    const { activeIndex } = props;
    const [selectBar, setSelectBar] = useState(0);
    const [topBarIndex, setTopBarIndex] = useState(0);
    useEffect(() => {
        if (activeIndex == 1) {
            heightRpx(res => {
                setHeightRpx(res);
            })
            if (topBarIndex == 0) {
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
            else {
                Taro.request({
                    url: `${baseUrl}/order/getErrand`,
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
        }
    }, [activeIndex, topBarIndex])

    const topText = ['购物订单', '跑腿订单'];
    const selectTopBar = (index) => {
        topBarIndex == index ? "" : (Taro.vibrateShort(), setTopBarIndex(index));
        // Taro.setNavigationBarTitle({ title: topTitle[index] });
    }
    let touchX = 0;
    let touchY = 0;
    const renderTopBar = () => {
        return topText.map((item, index) => {
            return <>
                <View
                    style={{ width: "49%", height: "100%", position: "relative", zIndex: "10", }}
                    className="flexCenter"
                >
                    <View
                        onClick={() => { selectTopBar(index) }}
                        className="flexCenter"
                        style={topBarIndex == index ?
                            {
                                height: "50rpx",
                                border: "0px solid rgb(254,108,57)",
                                borderWidth: "0px 0px 3px 0px",
                                width: index == 0 ? '35%' : "48%",
                                color: "rgb(254,108,57)",
                            } : {
                                height: "50rpx",
                                width: index == 0 ? '35%' : "48%",
                            }
                        }
                    >{item}</View>
                </View>
            </>
        })
    }

    const touchStart = e => {
        // console.log("START");
        touchX = e.changedTouches[0].clientX;
        touchY = e.changedTouches[0].clientY;
    }
    const touchEnd = (e) => {
        let x = e.changedTouches[0].clientX;
        let y = e.changedTouches[0].clientY;
        let turn = "";
        if (x - touchX > 50 && Math.abs(y - touchY) < 50) {      //右滑
            turn = 'right';
            // if (houseType > 0) {
            //     setHouseType(pre => pre - 1);

            // }
            if (topBarIndex == 1) {
                setTopBarIndex(0);
            }
        } else if (x - touchX < -50 && Math.abs(y - touchY) < 50) {   //左滑
            turn = 'left';
            if (topBarIndex == 0) {
                setTopBarIndex(1);
            }
            // if (houseType < 3) {
            //     setHouseType(pre => pre + 1);
            // }
        } else if (y - touchY > 50 && Math.abs(x - touchX) < 50) {
        } else if (y - touchY < -50 && Math.abs(x - touchX) < 50) {
            // const query = Taro.createSelectorQuery();
            // query.select("#house").boundingClientRect(res => {
            //     pxTorpx(res_1 => {
            //         let judge = (res.height + res.top) * res_1 - heightrpx;
            //         if (judge <= 400) {
            //             if (!isDataNull) {
            //                 getHouse(searchName, barText[houseType], textArr[selectIndex], res, 1, firstIndex, endIndex);
            //             }
            //         }

            //     })
            // }).exec()
        }

    }

    const renderOrderList = () => {
        if (topBarIndex == 0)
            return orderInfo.map(orderInfo => {
                return <OrderListChild orderInfo={orderInfo} />

            });
        return orderInfo.map(orderInfo => {
            return <ErrandListChild orderInfo={orderInfo} />

        });
    }
    return (<>
        <View onTouchStart={(e) => { touchStart(e) }}
            onTouchEnd={(e) => { touchEnd(e) }} style={{ zIndex: "1", width: "750rpx", height: heightrpx + 'rpx', backgroundColor: "rgb(224,224,224)", position: "fixed", left: "0rpx", top: "0rpx" }}></View>
        <View className="flexCenter" style={{ width: "750rpx", height: "70rpx" }}>
            {renderTopBar()}
        </View>
        <View
            onTouchStart={(e) => { touchStart(e) }}
            onTouchEnd={(e) => { touchEnd(e) }}
            style={{
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