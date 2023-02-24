import { View, Input } from "@tarojs/components";
import { useState, useEffect } from "react";
import Settings from "../../../../static/topBar.json";
import Taro from "@tarojs/taro";
import { baseUrl } from "../../../../static";
import { storeDataType } from "./type";

export default function TopBar(props) {
    const [tabIndex, setTabIndex] = useState<Number>(0);
    const textBar = ['购物'];
    // const textBar = ['点餐', "评论", "商家"];
    const { setSelectTab, setTopBarChange, storeId, setClickInput, setShowDishDetail, setClickCart, shopCartCounts } = props;
    const [storeData, setStoreData] = useState<storeDataType>();

    useEffect(() => {
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
                setStoreData(res.data.data[0]);
            }
        })
    }, [])

    const selectTab = index => {
        if (index != 0) {
            setTopBarChange(true);
        }
        setTabIndex(index);
        setSelectTab(index);
    };
    const topBarRender = () => {
        return textBar.map((item, index) => {
            return <>
                <View
                    onClick={() => selectTab(index)}
                    style={{
                        width: "30%",
                        height: "100%",
                        backgroundColor: 'white',
                        display: "flex",
                        justifyContent: "center",
                        alignItems: 'center',
                    }}>
                    <View style={{
                        backgroundColor: "white",
                        width: "80%",
                        height: "90%",
                        border: "0rpx solid rgb(255,108,54)",
                        borderWidth: tabIndex == index ? "0rpx 0rpx 6rpx 0rpx" : '0rpx',
                        color: tabIndex == index ? Settings.topBarActiveColor : Settings.topBarColor,
                        fontWeight: tabIndex == index ? 'bold' : '',
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <View style={{ textAlign: "center" }}>{item}</View>
                    </View>
                </View>
            </>
        })
    };
    return (<>
        <View style={{
            display: 'flex',
            justifyContent: "space-between",
            width: "750rpx",
            height: "80rpx",
            backgroundColor: Settings.topBarBackgroundColor,
            fontSize: Settings.topBarFontSize,
            alignItems: "center",
            marginLeft: "20rpx",
        }}>
            <View style={{ width: "50%", height: "100%", display: "flex", justifyContent: "flex-start" }}>{topBarRender()}</View>
            <View style={{ height: "100%", width: "15%" }}></View>
            <View style={{ borderRadius: "50rpx", backgroundColor: "rgb(244,244,244)", display: "flex", justifyContent: "flex-start", marginRight: "25rpx", alignItems: "center", height: "75%", width: "40%" }}>
                <View style={{ width: "10%", display: "flex", justifyContent: "center", padding: "0rpx 10rpx 0rpx 15rpx" }}>
                    <View style={{ color: "rgb(127,127,127)" }} className="at-icon at-icon-search"></View>
                </View>
                <Input onClick={() => {
                    Taro.navigateTo({
                        // url: `/pages/index/index?isClick=${true}&storeId=${storeData?.storeId}&storeHeadImg=${storeData?.storeHeadImg}&storeLocation=${storeData?.storeLocation}&storeName=${storeData?.storeName}&storeConnection=${storeData?.storeConnection}`
                        url: `/pages/index/index?isClick=${true}&storeId=${7}&storeHeadImg=${storeData?.storeHeadImg}&storeLocation=${storeData?.storeLocation}&storeName=${storeData?.storeName}&storeConnection=${storeData?.storeConnection}`
                    });
                }} style={{ width: "60%", height: "100%" }} placeholder="搜索菜名"></Input>
            </View>
        </View>
    </>)
}
