import { useEffect, useState } from "react";
import { View, Image, Textarea, Radio, Input, Button } from "@tarojs/components";
import "taro-ui/dist/style/components/icon.scss";
import { heightRpx, baseUrl, getNowLocation, postApi, getStorageSync } from "../../static";
import Taro, { getCurrentInstance } from "@tarojs/taro";

export default function BottomBar() {
    const params = getCurrentInstance().router?.params;
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

    useEffect(() => {
        heightRpx(res => {
            setHeightRpx(res);
        });
        getNowLocation(addr => {
            setAddress(addr);
            // console.log("addr = ", addr);
        });
        // postApi(`${baseUrl}/order/getAddress`, {
        //     openId: getStorageSync("openId")
        // })
        //     .then(res => {
        //         let data = res.data.data;
        //         if (data.length != 0) {
        //             setName(data.userName);
        //             setEndAddress(data.endAddress);
        //             setPhone(data.userPhone);
        //             setPreAddress(data.preAddress);
        //             setTagName(data.addressTagName);
        //         }
        //     })

    }, [])

    const inputName = e => {
        setName(e.detail.value);
    };
    const inputPhone = e => {
        setPhone(e.detail.value);
    };
    const inputPreAddress = e => {
        setPreAddress(e.detail.value);
    };
    const inputEndAddress = e => {
        setEndAddress(e.detail.value);
    };

    const updateAddress = () => {
        if (hasAddress == "true") {
            postApi(`${baseUrl}/order/updateAddress`, {
                userName: name,
                userPhone: phone,
                preAddress,
                endAddress,
                addressTagName: tagName,
                openId: getStorageSync("openId"),
            }).then(res => {
                if (res.data.code == 0) {
                    Taro.showToast({
                        title: '地址修改成功',
                        icon: 'success',
                        duration: 1500//持续的时间
                    });
                    // setTimeout(() => {
                    //     Taro.redirectTo({
                    //         url: "/pages/entrancePage/index"
                    //     })
                    // }, 1500)
                }
            })
        } else {
            postApi(`${baseUrl}/order/insertAddress`, {
                userName: name,
                userPhone: phone,
                preAddress,
                endAddress,
                addressTagName: tagName,
                openId: getStorageSync("openId"),
            }).then(res => {
                if (res.data.code == 0) {
                    Taro.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 1500//持续的时间
                    });
                    setTimeout(() => {
                        Taro.redirectTo({
                            url: "/pages/entrancePage/index"
                        })
                    }, 1500)
                }
            })
        }
    }

    return (<>
        <View className="flexCenter" style={{ width: "750rpx", height: `${heightrpx}rpx`, backgroundColor: "rgb(249,249,249)" }}>
            <View style={{ width: "95%", height: "95%", display: "flex", flexDirection: "column", borderRadius: "10rpx", backgroundColor: "white" }}>
                {/* <View style={{ width: "100%", height: "100%" }}> */}

                <View style={{ width: "95%", height: "150rpx", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <View className="flexCenter" style={{ width: "150rpx", height: "100%" }}>收货人: </View>
                    <Input onInput={e => { inputName(e) }} value={name} className="flexCenter" style={{ width: "500rpx", height: "100%" }} placeholder="请填写收货人姓名" />
                    <View className="flexCenter" style={{ width: "50rpx", height: "100%", }}>
                        <View className="at-icon at-icon-user"></View>
                    </View>
                </View>
                <View style={{ width: "95%", height: "150rpx", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <View className="flexCenter" style={{ width: "150rpx", height: "100%" }}>手机号码: </View>
                    <Input onInput={e => { inputPhone(e) }} value={phone} className="flexCenter" style={{ width: "500rpx", height: "100%" }} placeholder="请填写收货人手机号码" />
                    <View className="flexCenter" style={{ width: "50rpx", height: "100%", }}>
                        <View className="at-icon at-icon-phone"></View>
                    </View>
                </View>
                <View style={{ width: "95%", height: "150rpx", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <View className="flexCenter" style={{ width: "150rpx", height: "100%" }}>所在地区: </View>
                    <Input onInput={e => { inputPreAddress(e) }} value={preAddress} className="flexCenter" style={{ width: "500rpx", height: "100%" }} placeholder="省市区县、乡镇等" />
                    <View className="flexCenter" style={{ width: "50rpx", height: "100%", }}>
                        <View onClick={() => setPreAddress(address)} className="at-icon at-icon-map-pin" style={{ color: "rgb(255,108,52)" }}></View>
                    </View>
                </View>
                <View style={{ width: "95%", height: "150rpx", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                    <View className="flexCenter" style={{ width: "150rpx", height: "100%" }}>详细地址: </View>
                    <Input onInput={e => { inputEndAddress(e) }} value={endAddress} className="flexCenter" style={{ width: "500rpx", height: "100%" }} placeholder="街道、楼牌等" />
                    <View className="flexCenter" style={{ width: "50rpx", height: "100%", }}>
                        {/* <View className="at-icon at-icon-user"></View> */}
                    </View>
                </View>
                <View style={{ width: "95%", height: "100rpx", display: "flex" }}>
                    <View className="flexCenter" style={{ width: "150rpx", height: "100%" }}>标签: </View>
                    <View style={{ width: "400rpx", height: "100%", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                        <View onClick={() => { setTagIndex(0); setTagName(tagValue[0]); }} className="flexCenter" style={{ width: "90rpx", height: "40rpx", borderRadius: "30rpx", border: "1px solid rgb(240,240,240)", backgroundColor: `${tagIndex == 0 ? 'rgb(255,108,55)' : 'white'}`, color: `${tagIndex == 0 ? 'white' : 'black'}` }}>家</View>
                        <View onClick={() => { setTagIndex(1); setTagName(tagValue[1]); }} className="flexCenter" style={{ width: "90rpx", height: "40rpx", borderRadius: "30rpx", border: "1px solid rgb(240,240,240)", backgroundColor: `${tagIndex == 1 ? 'rgb(255,108,55)' : 'white'}`, color: `${tagIndex == 1 ? 'white' : 'black'}` }}>学校</View>
                        <View onClick={() => { setTagIndex(2); setTagName(tagValue[2]); }} className="flexCenter" style={{ width: "90rpx", height: "40rpx", borderRadius: "30rpx", border: "1px solid rgb(240,240,240)", backgroundColor: `${tagIndex == 2 ? 'rgb(255,108,55)' : 'white'}`, color: `${tagIndex == 2 ? 'white' : 'black'}` }}>公司</View>
                    </View>
                </View>
                <View onClick={() => {
                    updateAddress();
                }} className="flexCenter" style={{ width: "100%", height: "200rpx" }}>
                    <View className="flexCenter" style={{ width: "80%", height: "100rpx", borderRadius: "60rpx", color: "white", fontSize: "18px", backgroundColor: "rgb(255,108,55)" }}>
                        保存
                    </View>
                </View>
            </View>
            {/* </View> */}
        </View>
    </>)
}