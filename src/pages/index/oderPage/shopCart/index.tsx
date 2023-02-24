import { useEffect, useState } from "react";
import { View, Button, Image } from "@tarojs/components";
import { getStorageSync } from "../../../../static";
import Taro from "@tarojs/taro";

export default function BottomBar(props) {
    const { iconUrl, bottomBackColor, bottomBtnBackColor, setClickCart, shopCartCounts, setShowDishDetail, storeName, storeImg, storeConnection } = props;
    const [shopCartMoney, setShopCartMoney] = useState(0);
    useEffect(() => {
        const data = getStorageSync("shopCart");
        let totalMoney = 0;
        Array.isArray(data) && data.map((item, index) => {
            totalMoney += parseInt(item.dishPrice);
        })
        setShopCartMoney(totalMoney);
    }, [shopCartCounts])
    const [activeIndex, setActiveIndex] = useState<Number>(0);
    let bottomText = [
        "点餐",
        "单号",
        "取餐",
        "我的"
    ]

    const selectFunc = (index) => {
        setActiveIndex(index);
    }
    const Test = () => {
        if (shopCartMoney != 0) {
            setShowDishDetail(false)
            setClickCart(pre => !pre)
        }
    }

    const toBought = (e) => {
        e.stopPropagation(); // 阻止子组件事件向父组件传递
        Taro.navigateTo({
            url: `/pages/settlement/index?storeImg=${storeImg}&storeName=${storeName}&storeConnection=${storeConnection}`
        })
    }
    return (<>

        <View style={{
            width: "750rpx", height: "118rpx",
            backgroundColor: bottomBackColor,
            display: 'flex',
            justifyContent: "space-between",
            alignItems: 'center',
            position: 'fixed',
            bottom: '0px',
            borderRadius: '20rpx 20rpx 0px 0px',
            zIndex: '1000'
        }}
            onClick={Test}
        >
            {shopCartMoney == 0 ? "" : <View style={{
                textAlign: 'center',
                zIndex: '1000',
                fontSize: '12px',
                position: "fixed",
                left: '100rpx',
                bottom: "90rpx",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40rpx",
                height: "40rpx",
                borderRadius: "50%",
                backgroundColor: "white",
                color: "rgb(255,108,54)"
            }}>
                {shopCartCounts}
            </View>}

            <View style={{ width: "50%", height: "100%", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                <View style={{ width: "10%" }}></View>
                <View style={{ width: "30%", height: "100%" }}>
                    {
                        iconUrl ?
                            <Image src={iconUrl} id="shopcar" style={{ borderRadius: "50%", width: "85rpx", height: "85rpx", position: 'fixed', bottom: "26rpx", left: "28rpx" }} />
                            :
                            <View className='at-icon at-icon-shopping-cart' id="shopcar" style={{ fontSize: "80rpx", color: 'rgb(255,108,55)', position: 'fixed', bottom: "26rpx", left: "28rpx" }}>
                            </View>
                    }

                </View>
                <View style={{ width: "50%", height: "100%", color: "white", fontSize: "12px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                    <View style={{ fontSize: "16px", width: "100%", height: "60%", position: "relative", bottom: "15rpx", right: "20rpx" }}>

                        {
                            shopCartMoney == 0 ? <View style={{ color: "rgb(150,150,150)" }}>未选购商品</View> : shopCartMoney + '￥'
                        }
                    </View>
                </View>
                <View style={{ width: "10%" }}></View>
            </View>
            <View style={{ width: "50%", height: "100%", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                <View style={{ width: "20%" }}>
                </View>
                {
                    shopCartMoney == 0 ? <Button style={{ width: "230rpx", height: "85rpx", fontSize: "18px", borderRadius: "20px", backgroundColor: "rgb(108,108,108)", color: "rgb(150,150,150)", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <View>
                            去结算
                        </View>
                    </Button> : <Button onClick={e => toBought(e)} style={{ width: "230rpx", height: "85rpx", fontSize: "18px", borderRadius: "20px", backgroundColor: bottomBtnBackColor, color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <View>
                            去结算
                        </View>
                    </Button>
                }
            </View>
        </View>
    </>)
}
