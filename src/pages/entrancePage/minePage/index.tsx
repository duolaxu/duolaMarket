import { View, Image, Input } from "@tarojs/components";
import { baseUrl, getStorageSync, getNowLocation } from "../../../static";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
export default function minePage(props) {
    const { activeIndex } = props;
    const [nickName, setNickName] = useState("");
    const [headImg, setHeadImg] = useState("");
    const [address, setAddress] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [hasAddress, setHasAddress] = useState(true);

    //以下为收货地址信息
    const [userName, setUserName] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [preAddress, setPreAddress] = useState("");
    const [endAddress, setEndAddress] = useState("");
    const [addressTagName, setAddressTagName] = useState("");
    useEffect(() => {
        if (activeIndex == 2) {
            getNowLocation((addr) => {
                setAddress(addr);
            })
            Taro.request({
                url: `${baseUrl}/order/getAddress`,
                data: {
                    openId: getStorageSync("openId")
                },
                method: "POST",
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    let data = res.data.data;
                    if (data.length == 0) {
                        setHasAddress(false);
                        setDeliveryAddress("");

                        setUserName("");
                        setUserPhone("");
                        setPreAddress("");
                        setEndAddress("");
                        setAddressTagName("");
                    } else {
                        setHasAddress(true);
                        setDeliveryAddress(data[0].preAddress + data[0].endAddress);

                        setUserName(data[0].userName);
                        setUserPhone(data[0].userPhone);
                        setPreAddress(data[0].preAddress);
                        setEndAddress(data[0].endAddress);
                        setAddressTagName(data[0].addressTagName);
                    }
                    // console.log("回收 = ", res.data.data);
                    // setHeadImg(baseUrl + res.data.data[0].headImg);
                    // setNickName(res.data.data[0].nickName);
                }
            })
            // setAddress(getStorageSync("address"));
            Taro.request({
                url: `${baseUrl}/order/getCustomer`,
                data: {
                    openId: getStorageSync("openId")
                },
                method: "POST",
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    setHeadImg(baseUrl + res.data.data[0].headImg);
                    setNickName(res.data.data[0].nickName);
                }
            })
        }
    }, [activeIndex])

    const uploadImg = () => {
        Taro.chooseImage({
            success(res) {
                const tempFilePaths = res.tempFilePaths;
                setHeadImg(tempFilePaths[0]);
                Taro.uploadFile({
                    url: `${baseUrl}/uploadImg`,
                    filePath: tempFilePaths[0],
                    name: 'file',
                    header: {
                        imgName: getStorageSync("openId"),
                        imgType: '5',

                        contentType: 'multipart/form-data'
                    },
                    success(res) {
                        let result = JSON.parse(res.data);
                        Taro.request({
                            url: `${baseUrl}/order/updateCustomerInfo`,
                            data: {
                                openId: getStorageSync("openId"),
                                headImg: result.url,
                                nickName: nickName
                            },
                            method: "POST",
                            header: {
                                'content-type': 'application/json' // 默认值
                            },
                            success: function (res) {
                            }
                        })
                    }
                })
            }
        })
    }
    const changeName = (e) => {
        Taro.request({
            url: `${baseUrl}/order/updateCustomerInfo`,
            data: {
                openId: getStorageSync("openId"),
                headImg: '/' + headImg.split("/")[4],
                nickName: e.detail.value
            },
            method: "POST",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
            }
        })
    }

    return (<>
        <View style={{ height: "100vh", width: "750rpx", backgroundColor: "rgb(244,244,244)" }}>
            <View style={{ backgroundColor: "rgb(254,187,64)", height: "230rpx", width: "100%", display: "flex", alignItems: "center" }}>
                <View style={{ marginLeft: "35rpx" }}>
                    <Image onClick={uploadImg} style={{ borderRadius: "50%", width: "140rpx", height: "140rpx" }} src={`${headImg}`} />
                </View>
                <View style={{ marginLeft: "35rpx" }}>
                    <Input value={nickName} style={{ caretColor: "white" }} onBlur={(e) => { changeName(e) }} >{nickName}</Input>
                </View>
            </View>
            <View style={{ width: "100%", height: "80rpx", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", marginTop: "50rpx" }}>
                <View className="flexCenter" style={{ width: "170rpx" }}>
                    <View className="at-icon at-icon-map-pin" style={{ fontSize: "14px" }}></View>
                    <View style={{ fontSize: "14px", color: "rgb(127,127,127)" }}>当前位置</View>
                </View>
                <View className="flexCenter" style={{ width: "580rpx" }}>
                    <View style={{ fontSize: "14px", color: "rgb(127,127,127)" }}>{address}</View>
                    <View style={{ fontSize: "20px", width: "50rpx", color: "rgb(212,212,212)" }}></View>
                </View>
            </View>
            <View
                onClick={() => {
                    Taro.navigateTo({
                        url: `/pages/deliveryAddress/index?hasAddress=${hasAddress}&userName=${userName}&userPhone=${userPhone}&preAddress=${preAddress}&endAddress=${endAddress}&addressTagName=${addressTagName}`,
                    })
                }}
                style={{ width: "100%", height: "80rpx", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "white", marginTop: "50rpx" }}>
                <View className="flexCenter" style={{ width: "170rpx" }}>
                    <View className="at-icon at-icon-map-pin" style={{ fontSize: "14px" }}></View>
                    <View style={{ fontSize: "14px", color: "rgb(127,127,127)" }}>收货地址</View>
                </View>
                <View className="flexCenter" style={{
                    width: "580rpx",
                }}>
                    <View className="flexCenter" style={{
                        fontSize: "14px", color: "rgb(127,127,127)", overflow: "hidden",
                        textOverflow: "ellipsis", // 文字超出部分以省略号展示
                        whiteSpace: "nowrap",
                        width: "100%",
                    }}>{deliveryAddress}</View>
                    <View className="at-icon at-icon-chevron-right" style={{ fontSize: "20px", width: "50rpx", color: "rgb(212,212,212)" }}></View>
                </View>
            </View>
        </View>
    </>)
}