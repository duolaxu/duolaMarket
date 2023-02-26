import { useEffect, useState } from "react";
import { View, Image, Textarea, Radio, Button } from "@tarojs/components";
import "taro-ui/dist/style/components/icon.scss";
import { heightRpx, baseUrl, getStorageSync, swapTime, postApi } from "../../static";
import Taro, { getCurrentInstance, setStorageSync, useDidHide, useDidShow } from "@tarojs/taro";
import jsrsasign from 'jsrsasign';

export default function BottomBar() {
    const params = getCurrentInstance().router?.params;
    const [heightrpx, setHeightRpx] = useState(0);
    const [order, setOrder] = useState<any[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [remarks, setRemarks] = useState("");
    const [payTime, setPayTime] = useState(0); // 避免重复支付，两次点击时间间隔大于一分钟

    // 以下为地址信息
    const [userName, setUserName] = useState("");
    const [preAddress, setPreAddress] = useState("");
    const [endAddress, setEndAddress] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [addressTagName, setAddressTagName] = useState("");
    const [hasAddress, setHasAddress] = useState(true);
    // url: `/pages/deliveryAddress/index?
    // hasAddress=${hasAddress}&userName=${userName}&userPhone=${userPhone}&
    // preAddress=${preAddress}&endAddress=${endAddress}&addressTagName=${addressTagName}`,
    // useDidHide(() => {
    //     console.log("hide");
    // })
    useDidShow(() => {
        postApi(`${baseUrl}/order/getAddress`, {
            openId: getStorageSync("openId"),
        })
            .then(res => {
                let data = res.data.data;
                if (data.length == 0) {
                    setHasAddress(false);
                } else {
                    // console.log("datouia = ", data);
                    setHasAddress(true);
                    setPreAddress(data[0].preAddress);
                    setEndAddress(data[0].endAddress);
                    setUserName(data[0].userName);
                    setUserPhone(data[0].userPhone);
                    setAddressTagName(data[0].addressTagName);
                    // setAddress(`${data.}`)
                }
            })
    })

    useEffect(() => {

        // console.log("OPENID = ", getStorageSync("openId"));
        let arr = getStorageSync("shopCart").sort((a, b) => a.dishId - b.dishId);
        let lent = arr.length;
        let index = 1;
        let orderList: any[] = [];
        let price = 0;
        for (let i = 1; i < lent; i++) {
            price += parseInt(arr[i - 1].dishPrice);
            if (arr[i].dishId == arr[i - 1].dishId) {
                index++;
            } else {
                arr[i - 1].dishCounts = index;
                index = 1;
                orderList.push(arr[i - 1]);
            }
        }
        price += parseInt(arr[lent - 1].dishPrice);
        setTotalPrice(price);
        arr[lent - 1].dishCounts = index;
        orderList.push(arr[lent - 1]);
        index = 1;
        setOrder(orderList);
        heightRpx(res => {
            setHeightRpx(res);
        })
    }, [])
    const [clickStarIndex, setClickStarIndex] = useState(-1);
    const [isChecked, setChecked] = useState(true);
    const [orderType, setOrderType] = useState(1);
    const stars = [0, 1, 2, 3, 4];
    const clickStar = index => {
        setClickStarIndex(index);
    }

    const renderStar = (preIndex) => {
        return stars.map((item, index) => {
            return <>
                <View onClick={() => { clickStar(index) }} className="at-icon at-icon-star-2"
                    style={{
                        color: index <= preIndex ? 'rgb(255,187,56)' : "rgb(235,235,235)",
                        fontSize: "50px"
                    }}></View>
            </>
        })
    }

    const selectOrderType = (type) => {
        setOrderType(type);
    }

    const signStr = (method, url, timestamp, authStr, body) => {
        return `${method}\n${url}\n${timestamp}\n${authStr}\n${body}\n`
    }

    const remarking = e => {
        setRemarks(e.detail.value);
    }

    const outTradeNo = () => { // 订单号生成
        let nowTime = Date.now().toString();
        nowTime = nowTime.slice(3, 13);
        return nowTime +
            Math.floor(Math.random() * 1000) +
            Math.floor(Math.random() * 1000) +
            Math.floor(Math.random() * 1000) +
            Math.floor(Math.random() * 1000);
    }

    const toPay = () => {
        let timeStamp = parseInt(`${Date.now() / 1000}`).toString();
        let nonceStr = '593BEC0C930BF1AFEB40B4A08C8FB242';
        Taro.request({
            url: `${baseUrl}/order/getPrePayId`, // 获取支付前的订单id
            data: {
                openId: getStorageSync("openId"),
                description: "pay_test",
                totalPrice
            },
            method: "POST",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                // console.log("KEY = ", res.data.data.prepay_id);
                let rsa = new jsrsasign.RSAKey();
                rsa = jsrsasign.KEYUTIL.getKey(res.data.privateKey);
                let orderIndex = res.data.orderIndex;
                setStorageSync("orderIndex", orderIndex);
                const sig = new jsrsasign.KJUR.crypto.Signature({
                    alg: 'SHA256withRSA'
                });
                sig.init(rsa)


                let pg = `prepay_id=${res.data.data.prepay_id}`;
                let content = `wx8732a656084cc41a\n${timeStamp}\n${nonceStr}\n${pg}\n`;
                sig.updateString(content);
                // 加密后的16进制转成base64，这就是签名了
                const sign = jsrsasign.hextob64(sig.sign());
                Taro.requestPayment({ // 调起微信支付
                    timeStamp,
                    nonceStr,
                    package: pg,
                    signType: 'RSA',
                    paySign: `${sign}`,
                    success(res) {
                        // if (res.errMsg == "requestPayment:ok") {
                        // Taro.showModal({
                        //     title: '提示',
                        //     content: '这是一个模态弹窗',
                        //     success: function (res) {
                        //         if (res.confirm) {
                        //             console.log('用户点击确定')
                        //         } else if (res.cancel) {
                        //             console.log('用户点击取消')
                        //         }
                        //     }
                        // })

                        // Taro.showToast({
                        //     title: '支付成功',
                        //     icon: 'success',
                        //     duration: 1500//持续的时间
                        // });
                        setChecked(true);
                        const indexType = {
                            'wm': 'takeOutIndex',
                            'zt': 'pickSelfIndex'
                        };
                        // const ordertype = orderType == 1 ? 'wm' : 'zt';
                        let ordertype = "";
                        for (let i = 0; i < 4; i++) {
                            ordertype += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1) + 65));
                        }
                        let orderStr = '';
                        order.map(item => {
                            orderStr += (item.dishName + '&' + item.dishCounts + ';');
                        })
                        // Taro.redirectTo({
                        //     url: `/pages/orderDetail/index?openId=${getStorageSync("openId")}&orderIndex=${orderIndex}&orderStatus="订单待支付"`
                        // });
                        // setTimeout(() => {
                        //     Taro.redirectTo({
                        //         url: `/pages/orderDetail/index?openId=${getStorageSync("openId")}&orderIndex=${orderIndex}&orderStatus="订单待支付"`
                        //     });
                        // }, 500)
                        let orderTime = swapTime();
                        Taro.request({
                            url: `${baseUrl}/order/createOrderDetail`,
                            data: {
                                certificate: ordertype,
                                shopList: orderStr,
                                orderStatus: '已完成',
                                orderIndex: orderIndex,
                                orderDate: orderTime,
                                orderPayType: '微信支付',
                                dineWay: orderType == 1 ? '外卖' : '自提',
                                totalPrice: totalPrice,
                                storeName: '巷子里副食店',
                                storeImg: '/recruitment/undefined_1676647136208.jpg',
                                storeConnection: params?.storeConnection,
                                openId: getStorageSync("openId"),
                                remarks,
                                orderAddress: preAddress + endAddress,
                            },
                            method: "POST",
                            header: {
                                'content-type': 'application/json'
                            },
                            success: function (res) {
                                setStorageSync("shopCart", "");
                                postApi(`${baseUrl}/order/sendWeChats`, {
                                    openId: 'ofsx15BMM25n5I1nmT4Xg7X9x3Dg',
                                    orderType: orderType == 1 ? '外卖' : '自提',
                                    time: orderTime,
                                    address: preAddress + endAddress,
                                    templateId: 'XOZ7GeyCMY3YuQCOeQgjrXYys-UZy_bu_TRK8KOnUzI',
                                }, {
                                    // content-Type:
                                }).then(() => {
                                    postApi(`${baseUrl}/order/getMessagesNumber`, {
                                        openId: 'ofsx15BMM25n5I1nmT4Xg7X9x3Dg'
                                    }).then(res => {
                                        if (res.data.code == 0) {
                                            postApi(`${baseUrl}/order/updateMessagesNumber`, {
                                                openId: 'ofsx15BMM25n5I1nmT4Xg7X9x3Dg',
                                                messageNumber: res.data.data[0].messageNumber - 1
                                            })
                                        }
                                    })
                                })
                                // setTimeout(() => {
                                // Taro.showToast({
                                //     title: '支付成功',
                                //     icon: 'success',
                                //     duration: 2000
                                // })
                                Taro.redirectTo({
                                    url: `/pages/orderDetail/index?openId=${getStorageSync("openId")}&orderIndex=${orderIndex}&orderStatus="订单支付成功"`
                                });
                                // }, 50)
                                // Taro.showModal({
                                //     title: '提示',
                                //     content: '这是一个模态弹窗',
                                //     success: function (res) {
                                //         if (res.confirm) {
                                //             console.log('用户点击确定')
                                //         } else if (res.cancel) {
                                //             console.log('用户点击取消')
                                //         }
                                //     }
                                // })




                            }
                        })
                        // }

                    },
                    fail(res) { // 用户取消支付
                        // console.log("支付失败 = ", res);
                        setChecked(true);
                        let ordertype = "";
                        for (let i = 0; i < 4; i++) {
                            ordertype += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1) + 65));
                        }
                        let orderStr = '';
                        order.map(item => {
                            orderStr += (item.dishName + '&' + item.dishCounts + ';');
                        })
                        Taro.request({
                            url: `${baseUrl}/order/createOrderDetail`,
                            data: {
                                certificate: ordertype,
                                shopList: orderStr,
                                orderStatus: '待支付',
                                orderIndex: orderIndex,
                                orderDate: swapTime(),
                                orderPayType: '微信支付',
                                dineWay: orderType == 1 ? '外卖' : '自提',
                                totalPrice: totalPrice,
                                storeName: "巷子里副食店",
                                storeImg: '/recruitment/undefined_1676647136208.jpg',
                                storeConnection: params?.storeConnection,
                                openId: getStorageSync("openId"),
                                remarks,
                                orderAddress: preAddress + endAddress
                            },
                            method: "POST",
                            header: {
                                'content-type': 'application/json'
                            },
                            success: function (res) {
                                setStorageSync("shopCart", "");

                                Taro.redirectTo({
                                    url: `/pages/orderDetail/index?openId=${getStorageSync("openId")}&orderIndex=${orderIndex}&orderStatus="订单待支付"`
                                });

                            }
                        })
                    },
                    complete(res) {
                        // Taro.redirectTo({
                        //     url: `/pages/orderDetail/index?openId=${getStorageSync("openId")}&orderIndex=${orderIndex}&orderStatus="订单待支付"`
                        // });
                    }
                })
            }
        })

    }

    const renderOrder = () => {
        return order.map(item => {
            return <>
                <View style={{ marginTop: "15rpx", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "100rpx" }}>
                    <View style={{ width: "85%", height: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                        <View style={{ width: "90rpx", height: "90rpx", }}>
                            <Image style={{ width: "90rpx", height: "90rpx", borderRadius: "5px" }} src={`${item.dishImg}`} />
                        </View>
                        <View style={{
                            paddingLeft: "20rpx", width: "300rpx", height: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center",
                        }}>
                            <View style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis", // 文字超出部分以省略号展示
                                whiteSpace: "nowrap",
                            }}>{item.dishName}</View>
                        </View>
                        <View style={{ width: "80rpx", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", }}>*{item.dishCounts}</View>
                    </View>
                    <View style={{ width: "10%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>{item.dishPrice * item.dishCounts}￥</View>
                </View>
            </>
        })
    }

    return (<>
        <View style={{ position: "relative", zIndex: "100", display: "flex", flexDirection: "column", alignItems: "center", width: "750rpx", height: "auto", backgroundColor: "rgb(244,244,244)", overflow: "scroll", }}>
            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "95%", height: "260rpx", backgroundColor: "white", marginTop: "15rpx", borderRadius: "8px" }}>
                <View style={{ width: "92%", height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start", }}>
                    <View style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start" }}>
                        <View style={{ paddingLeft: "15rpx", width: "100%", height: "30%", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>请选择拿取方式</View>
                        <View style={{ width: "100%", height: "65%", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                            <View style={{ width: "45%", height: "90%", border: "1px solid rgb(212,212,212)", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: orderType == 1 ? 'rgb(254,108,57)' : "white" }} onClick={() => { selectOrderType(1) }}>外卖</View>
                            <View style={{ width: "45%", height: "90%", border: "1px solid rgb(212,212,212)", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: orderType == 2 ? 'rgb(254,108,57)' : "white" }} onClick={() => { selectOrderType(2) }}>自提</View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "95%", height: "auto", backgroundColor: "white", marginTop: "15rpx", borderRadius: "8px" }}>
                <View style={{ width: "92%", height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start", }}>
                    <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "70rpx", fontSize: "14px", border: "0px solid rgb(212,212,212)", borderWidth: "0px 0px 1px 0px" }}>
                        <View>购物列表</View>
                    </View>
                    <View style={{ fontSize: "13px", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                        {renderOrder()}
                    </View>
                    <View style={{ width: "100%", height: "35rpx", fontSize: "13px", color: "rgb(153,153,153)", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>

                    </View>
                </View>
            </View>
            <View style={{ width: "95%", height: "auto", backgroundColor: "white", marginTop: "15rpx", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>

                <View style={{ width: "92%", height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start", }}>
                    <View style={{ width: "100%", height: "70rpx", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                        <View>备注</View>
                    </View>
                    <View style={{ width: "100%", height: "150rpx", backgroundColor: "rgb(240,240,240)", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Textarea onInput={e => remarking(e)} style={{ width: "100%", height: "100%" }} placeholder="请输入备注" />
                    </View>
                    <View style={{ width: "100%", height: "30rpx" }}></View>
                </View>
            </View>
            <View style={{ width: "95%", height: "auto", backgroundColor: "white", marginTop: "15rpx", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>

                <View style={{ width: "92%", height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start", }}>
                    <View style={{ width: "100%", height: "70rpx", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <View className="flexCenter" style={{ fontSize: "14px", width: "10%", height: "100%" }}>地址</View>
                        <View className="flexCenter" style={{ fontSize: "12px", width: "80%", height: "100%" }}>{preAddress + endAddress}</View>
                        <View onClick={() => {
                            Taro.navigateTo({
                                url: `/pages/deliveryAddress/index?hasAddress=${hasAddress}&userName=${userName}&userPhone=${userPhone}&preAddress=${preAddress}&endAddress=${endAddress}&addressTagName=${addressTagName}`,
                            })
                        }} className="flexCenter" style={{ fontSize: "12px", color: "rgb(254,108,57)", width: "10%", height: "100%" }}>修改地址</View>
                    </View>
                    {/* <View style={{ width: "100%", height: "30rpx" }}></View> */}
                </View>
            </View>

            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "95%", height: "auto", backgroundColor: "white", marginTop: "15rpx", borderRadius: "8px" }}>
                <View style={{ width: "92%", height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start", }}>
                    <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "70rpx", fontSize: "14px", border: "0px solid rgb(212,212,212)", borderWidth: "0px 0px 1px 0px" }}>
                        <View>支付方式</View>
                    </View>
                    <View style={{ fontSize: "13px", width: "100%", height: "100rpx", display: "flex", justifyContent: "space-around" }}>
                        <View style={{ width: "50%", height: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>微信支付</View>
                        <View style={{ width: "50%", height: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <Radio key={1} onClick={() => { setChecked(pre => !pre) }} onTouchCancel={() => { setChecked(false) }} onTouchStart={() => { setChecked(true) }} color="rgb(255,187,56)" value='1' checked={isChecked} />
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ width: "100%", height: "140rpx" }}></View>

            <View style={{
                width: "750rpx", height: "118rpx",
                backgroundColor: "rgb(89,89,89)",
                display: 'flex',
                justifyContent: "space-between",
                alignItems: 'center',
                position: 'fixed',
                bottom: '0px',
                borderRadius: '20rpx 20rpx 0px 0px',
                zIndex: '1000'
            }}
            >
                <View style={{ width: "50%", height: "100%", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <View style={{ width: "10%" }}></View>
                    <View style={{ width: "50%", height: "100%", color: "white", fontSize: "12px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                        <View style={{ fontSize: "16px", width: "100%", height: "60%", position: "relative", bottom: "15rpx", right: "20rpx" }}>
                            {totalPrice}￥
                        </View>
                    </View>
                    <View style={{ width: "10%" }}></View>
                </View>
                <View style={{ width: "50%", height: "100%", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <Button onClick={() => {
                        if (hasAddress) {
                            if (Date.now() - payTime > 600000) {
                                toPay();
                                setPayTime(Date.now());
                                // Taro.showToast({
                                //     title: '支付',
                                //     icon: 'success',
                                //     duration: 100
                                // })
                            }
                        } else {
                            Taro.showModal({
                                title: '提示',
                                content: '检测到订单地址为空，请点击修改地址按钮添加收货地址',
                                success: function (res) {
                                    if (res.confirm) {
                                        console.log('用户点击确定')
                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            })
                        }
                    }} style={{ width: "230rpx", height: "85rpx", fontSize: "18px", borderRadius: "20px", backgroundColor: "rgb(254,108,57)", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <View>
                            支付
                        </View>
                    </Button>
                </View>
            </View>

        </View>
        <View style={{ zIndex: "0", position: "fixed", top: "0px", left: "0px", backgroundColor: "rgb(244,244,244)", width: "750rpx", height: heightrpx + "rpx" }}></View>
    </>)
}
