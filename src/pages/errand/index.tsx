import { useEffect, useState } from "react";
import { View, Image, Textarea, Radio, Input, Button, Text } from "@tarojs/components";
import "taro-ui/dist/style/components/icon.scss";
import { heightRpx, baseUrl, getNowLocation, postApi, getStorageSync, swapTime, printErrandOrder, templatePrintErrandData } from "../../static";
import Taro, { getCurrentInstance } from "@tarojs/taro";

export default function BottomBar() {
    const params = getCurrentInstance().router?.params;
    const [preTime, setPreTime] = useState(0);
    const tagValue = {
        0: '家',
        1: '学校',
        2: '公司',
    };
    const tagValueIndex = {
        '家': 0,
        '学校': 1,
        '公司': 2,
    }
    const addressName: any = params?.addressTagName;

    const hasAddress = params?.hasAddress;
    const [heightrpx, setHeightRpx] = useState(0);
    const [tagIndex, setTagIndex] = useState(tagValueIndex[addressName == "" ? 0 : addressName]);
    const [address, setAddress] = useState("");
    const [name, setName] = useState(params?.userName);
    const [phone, setPhone] = useState(params?.userPhone);
    const [preAddress, setPreAddress] = useState(params?.preAddress);
    const [endAddress, setEndAddress] = useState(params?.endAddress);
    const [tagName, setTagName] = useState(params?.addressTagName);
    const [counts, setCounts] = useState(0);
    const [errandDetails, setErrandDetail] = useState("");
    const [arriveTime, setArriveTime] = useState("");

    // 控制提示信息显示
    const [isShow_1, setShow_1] = useState(false);
    const [isShow_2, setShow_2] = useState(false);
    const [isShow_3, setShow_3] = useState(false);
    const [isShow_4, setShow_4] = useState(false);
    const [isShow_5, setShow_5] = useState(false);
    const [isShow_6, setShow_6] = useState(false);

    useEffect(() => {
        heightRpx(res => {
            setHeightRpx(res);
        });
        getNowLocation(addr => {
            setAddress(addr);
        })
        postApi(`${baseUrl}/order/getAddress`, {
            openId: getStorageSync("openId")
        })
            .then(res => {
                let data = res.data.data;
                if (data.length == 0) {

                } else {
                    setPreAddress(data[0].preAddress);
                    setEndAddress(data[0].endAddress);
                    setName(data[0].userName);
                    setPhone(data[0].userPhone);
                    setTagName(data[0].addressTagName);
                    setTagIndex(tagValueIndex[data[0].addressTagName]);
                }
            })
    }, [])

    const inputName = e => {
        setName(e.detail.value);
        let str = e.detail.value;
        let judge = true;
        for (let i = 0; i < str.length; i++) { // 判断是否为空
            if (str[i] != " ") {
                judge = false;
                break;
            }
        }
        setShow_1(judge);
    };
    const inputPhone = e => {
        setPhone(e.detail.value);
        let str = e.detail.value;
        let judge = true;
        for (let i = 0; i < str.length; i++) { // 判断是否为空
            if (str[i] != " ") {
                judge = false;
                break;
            }
        }
        setShow_2(judge);
    };
    const inputPreAddress = e => {
        setPreAddress(e.detail.value);
        let str = e.detail.value;
        let judge = true;
        for (let i = 0; i < str.length; i++) { // 判断是否为空
            if (str[i] != " ") {
                judge = false;
                break;
            }
        }
        setShow_3(judge);
    };
    const inputEndAddress = e => {
        setEndAddress(e.detail.value);
        let str = e.detail.value;
        let judge = true;
        for (let i = 0; i < str.length; i++) { // 判断是否为空
            if (str[i] != " ") {
                judge = false;
                break;
            }
        }
        setShow_4(judge);
    };
    const inputArriveTime = e => {
        setArriveTime(e.detail.value);
        let str = e.detail.value;
        let judge = true;
        for (let i = 0; i < str.length; i++) { // 判断是否为空
            if (str[i] != " ") {
                judge = false;
                break;
            }
        }
        setShow_5(judge);
    };

    const outTradeNo = () => { // 订单号生成
        let nowTime = Date.now().toString();
        nowTime = nowTime.slice(3, 13);
        return nowTime +
            Math.floor(Math.random() * 1000) +
            Math.floor(Math.random() * 1000) +
            Math.floor(Math.random() * 1000) +
            Math.floor(Math.random() * 1000);
    }

    const submitErrand = () => {
        if (!isShow_1 && !isShow_2 && !isShow_3 && !isShow_4 && !isShow_5 && !isShow_6) { // 所有信息填写完毕才可进行提交
            if (name != "" && phone != "" && preAddress != "" && endAddress != "" && arriveTime != "" && errandDetails != "") {
                let certificate = ""; // 订单凭证
                for (let i = 0; i < 4; i++) {
                    certificate += String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1) + 65));
                }
                let orderIndex = outTradeNo();
                let orderTime = swapTime();
                // printErrandOrder(orderTime, templatePrintErrandData(orderTime, orderIndex, `${preAddress}${endAddress}`, name, phone, errandDetails, certificate, arriveTime));
                postApi(`${baseUrl}/order/insertErrand`, {
                    userName: name,
                    userPhone: phone,
                    address: `${preAddress}${endAddress}`,
                    orderText: errandDetails,
                    orderIndex,
                    certificate,
                    arriveTime,
                    errandDate: orderTime,
                    openId: getStorageSync("openId"),
                }).then(res => {
                    if (res.data.code == 0) {
                        printErrandOrder(orderTime, templatePrintErrandData(orderTime, orderIndex, `${preAddress}${endAddress}`, name, phone, errandDetails, certificate, arriveTime));
                        postApi(`${baseUrl}/order/sendWeChats`, {
                            openId: 'ofsx15BMM25n5I1nmT4Xg7X9x3Dg',
                            orderType: '跑腿',
                            time: orderTime,
                            address: `${preAddress}${endAddress}`,
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
                        Taro.redirectTo({
                            url: `/pages/errandDetail/index?orderIndex=${orderIndex}`
                        })
                    }
                })
            } else {
                if (name == "") {
                    setShow_1(true);
                }
                if (phone == "") {
                    setShow_2(true);
                }
                if (preAddress == "") {
                    setShow_3(true);
                }
                if (endAddress == "") {
                    setShow_4(true);
                }
                if (arriveTime == "") {
                    setShow_5(true);
                }
                if (errandDetails == "") {
                    setShow_6(true);
                }
            }
        }

    }

    const getVal = e => {
        setErrandDetail(e.detail.value);
        setCounts(e.detail.value.length);
        let str = e.detail.value;
        let judge = true;
        for (let i = 0; i < str.length; i++) { // 判断是否为空
            if (str[i] != " ") {
                judge = false;
                break;
            }
        }
        setShow_6(judge);
    }

    return (<>
        <View className="flexCenter" style={{ width: "750rpx", height: `${heightrpx}rpx`, backgroundColor: "rgb(249,249,249)" }}>
            <View style={{ width: "95%", height: "95%", display: "flex", flexDirection: "column", borderRadius: "10rpx", backgroundColor: "white" }}>

                <View style={{ width: "95%", height: "150rpx", backgroundColor: "", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <View className="flexCenter" style={{ width: "200rpx", height: "100%", }}>收货人: </View>
                    <View style={{ position: "relative", top: "12rpx" }}>
                        <Input onInput={e => { inputName(e) }} value={name} className="flexCenter" style={{ width: "500rpx", height: "100%" }} placeholder="请填写收货人姓名" />
                        <View style={{ width: "95%", height: "20rpx", fontSize: "12px", color: "red", }}>
                            <Text style={{ display: `${isShow_1 ? "block" : "none"}` }}>联系人姓名不能为空</Text>
                        </View>
                    </View>
                    <View className="flexCenter" style={{ width: "50rpx", height: "100%", }}>
                        <View className="at-icon at-icon-user"></View>
                    </View>
                </View>
                <View style={{ width: "95%", height: "150rpx", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <View className="flexCenter" style={{ width: "200rpx", height: "100%", }}>手机号码: </View>
                    <View style={{ position: "relative", top: "12rpx" }}>
                        <Input onInput={e => { inputPhone(e) }} value={phone} className="flexCenter" style={{ width: "500rpx", height: "100%" }} placeholder="请填写收货人手机号码" />
                        <View style={{ width: "95%", height: "20rpx", fontSize: "12px", color: "red", }}>
                            <Text style={{ display: `${isShow_2 ? "block" : "none"}` }}>手机号码不能为空</Text>
                        </View>
                    </View>
                    <View className="flexCenter" style={{ width: "50rpx", height: "100%", }}>
                        <View className="at-icon at-icon-phone"></View>
                    </View>
                </View>
                <View style={{ width: "95%", height: "150rpx", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <View className="flexCenter" style={{ width: "200rpx", height: "100%" }}>所在地区: </View>
                    <View style={{ position: "relative", top: "12rpx" }}>
                        <Input onInput={e => { inputPreAddress(e) }} value={preAddress} className="flexCenter" style={{ width: "500rpx", height: "100%" }} placeholder="省市区县、乡镇等" />
                        <View style={{ width: "95%", height: "20rpx", fontSize: "12px", color: "red", }}>
                            <Text style={{ display: `${isShow_3 ? "block" : "none"}` }}>所在地区不能为空</Text>
                        </View>
                    </View>
                    <View className="flexCenter" style={{ width: "50rpx", height: "100%", }}>
                        <View onClick={() => setPreAddress(address)} className="at-icon at-icon-map-pin" style={{ color: "rgb(255,108,52)" }}></View>
                    </View>
                </View>
                <View style={{ width: "95%", height: "150rpx", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <View className="flexCenter" style={{ width: "200rpx", height: "100%" }}>详细地址: </View>
                    <View style={{ position: "relative", top: "12rpx" }}>
                        <Input onInput={e => { inputEndAddress(e) }} value={endAddress} className="flexCenter" style={{ width: "500rpx", height: "100%" }} placeholder="街道、楼牌等" />
                        <View style={{ width: "95%", height: "20rpx", fontSize: "12px", color: "red", }}>
                            <Text style={{ display: `${isShow_4 ? "block" : "none"}` }}>详细地址不能为空</Text>
                        </View>
                    </View>
                    <View className="flexCenter" style={{ width: "50rpx", height: "100%", }}>
                        {/* <View className="at-icon at-icon-user"></View> */}
                    </View>
                </View>
                <View style={{ width: "95%", height: "150rpx", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <View className="flexCenter" style={{ width: "200rpx", height: "100%" }}>配送时间: </View>
                    <View style={{ position: "relative", top: "12rpx" }}>
                        <Input onInput={e => { inputArriveTime(e) }} value={arriveTime} className="flexCenter" style={{ width: "500rpx", height: "100%" }} placeholder="填写希望送达的时间范围" />
                        <View style={{ width: "95%", height: "20rpx", fontSize: "12px", color: "red", }}>
                            <Text style={{ display: `${isShow_5 ? "block" : "none"}` }}>配送时间不能为空</Text>
                        </View>
                    </View>
                    <View className="flexCenter" style={{ width: "50rpx", height: "100%", }}>
                        {/* <View className="at-icon at-icon-user"></View> */}
                    </View>
                </View>
                <View className="flexColumn" style={{ position: "relative", marginTop: "15rpx", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "400rpx", fontSize: "13px", backgroundColor: "white", borderRadius: "5px" }}>
                    <View style={{ width: "96%", height: "90%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", borderRadius: "4px" }}>
                        <Textarea cursorSpacing={3} style={{ width: "100%", height: "100%", overflow: "scroll", borderRadius: "5px", border: "1px solid rgb(254,108,57)" }} maxlength={150} onInput={e => { getVal(e) }} placeholder={'跑腿内容详细描述'} />
                    </View>
                    <Text style={{ position: "absolute", bottom: "15px", right: "15px", color: "rgb(157,157,157)", fontSize: "12px" }}>{counts}/150</Text>
                </View>
                <View className="flexCenter" style={{ width: "750rpx", height: "10rpx" }}>
                    <View style={{ width: "95%", height: "10rpx", fontSize: "12px", color: "red", }}>
                        <Text style={{ display: `${isShow_6 ? "block" : "none"}` }}>跑腿内容不能为空</Text>
                    </View>
                </View>
                <View className="flexCenter" style={{ width: "100%", height: "200rpx", }}>
                    <View onClick={() => {
                        let nowTime = Date.now();
                        if (nowTime - preTime >= 2000) {
                            submitErrand();
                            setPreTime(nowTime);
                        }
                    }} className="flexCenter" style={{ width: "80%", height: "100rpx", borderRadius: "60rpx", color: "white", fontSize: "18px", backgroundColor: "rgb(255,108,55)" }}>
                        提交跑腿信息
                    </View>
                </View>
            </View>
            {/* </View> */}
        </View>
    </>)
}