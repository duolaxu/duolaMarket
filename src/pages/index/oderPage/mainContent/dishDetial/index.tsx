import { useState, useEffect } from "react";
import { View, Image, Input } from "@tarojs/components";
import { baseUrl, heightRpx } from "../../../../../static";
import { setStorage, getStorage, getStorageSync } from "../../../../../static"
export default function Dish(props) {
    const { isShowDishDetail, setShowDishDetail, dishData, setCartChange, setRenderDishData, reRenderDishData } = props;
    const [heightrpx, setHeightrpx] = useState(0);
    const [dishCounts, setDishCounts] = useState(0);
    const [isShow, setShow] = useState(false); //是否已加入购物车

    useEffect(() => {
        heightRpx(res => {
            setHeightrpx(res);
        })
    }, [])
    useEffect(() => {

        let shopCarts = getStorageSync("shopCart");
        let counts = 0;
        {
            Array.isArray(shopCarts) ?
                (
                    shopCarts.map(item => {
                        if (item.dishId == dishData.dishId) {
                            counts++;
                        }
                    }),
                    setDishCounts(counts),
                    setShow(true)
                )
                : ''
        }
    }, [isShowDishDetail, reRenderDishData]);

    const styleA = {
        width: "750rpx",
        height: heightrpx + 'rpx',
        background: "rgb(0,0,0,0.5)",
        position: "fixed",
        bottom: "0rpx",
        left: "0rpx",
        transition: "height 2s cubic-bezier(0.2, 1.0, 0.2, 1.0)",
        zIndex: '999',
        overflow: "scroll",
    }

    const styleB = {
        width: "750rpx",
        height: "0rpx",
        position: "fixed",
        bottom: "0rpx",
        left: "0rpx",
        transition: "height 2s cubic-bezier(0.2, 1.0, 0.2, 1.0)",
        background: "rgba(0,0,0,0)",
    }

    const addshopcar = () => {
        setCartChange(pre => ++pre);
        setShow(true);
        setDishCounts(pre => pre + 1);
        let preShopCart = getStorageSync('shopCart');
        if (preShopCart == '') {
            setStorage(
                'shopCart',
                [dishData]
            )
        } else {
            preShopCart.push(dishData);

            setStorage(
                'shopCart',
                preShopCart
            )

        }
        setRenderDishData(pre => !pre);
    }
    const subtractShopcar = () => {
        let shopCarts = getStorageSync("shopCart");
        let judge = false;
        shopCarts = shopCarts.filter(item => {
            if (item.dishId == dishData.dishId && !judge) {
                judge = true;
            } else {
                return item;
            }
        });
        setStorage(
            "shopCart",
            shopCarts
        )
        setCartChange(pre => ++pre); // 更改购物车数量
        setRenderDishData(pre => !pre); // 将菜单列表重新渲染
    }

    const closeDishDetail = () => {
        setShowDishDetail(false);
    }

    return (<>
        <View onClick={() => { setShowDishDetail(pre => !pre) }} style={isShowDishDetail ? {
            width: "750rpx",
            height: heightrpx + 'rpx',
            background: "rgb(0,0,0,0.5)",
            position: "fixed",
            bottom: "0rpx",
            left: "0rpx",
            transition: "height 2s cubic-bezier(0.2, 1.0, 0.2, 1.0)",
            zIndex: '999',
            overflow: "scroll",
        } : {
            width: "750rpx",
            height: "0rpx",
            position: "fixed",
            bottom: "0rpx",
            left: "0rpx",
            transition: "height 2s cubic-bezier(0.2, 1.0, 0.2, 1.0)",
            background: "rgba(0,0,0,0)",
        }}>

            <View style={{ width: "750rpx", height: "25vh" }}></View>
            <View onClick={e => e.stopPropagation()} style={{ width: "750rpx", height: "68vh", backgroundColor: "aqua", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
                <View style={{ background: "rgba(255,255,255)", width: "750rpx", height: "50vh", opacity: '1' }}>
                    <View
                        onClick={closeDishDetail}

                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "50%",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            width: "50rpx",
                            height: "50rpx",
                            position: "absolute",
                            color: "rgb(246,246,246)",
                            top: "26vh",
                            left: "685rpx"
                        }}
                    >
                        <View className='at-icon at-icon-close' style={{ fontSize: "10px" }}></View>
                    </View>
                    <Image style={{ width: "750rpx", height: "100%" }} src={dishData.dishImg} />
                </View>
                <View style={{ width: "100%", height: "18vh", backgroundColor: "white", display: "flex", justifyContent: "space-around" }}>
                    <View style={{ width: "40%", height: "13vh", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                        <View style={{ fontSize: "15px", fontWeight: "bold" }}>{dishData.dishName}</View>
                        <View style={{ fontSize: "12px", color: "rgb(127,127,127)" }}>{'月售' + (dishData.dishMonthSales || 0) + "份"}</View>
                        <View style={{ fontSize: "14px", color: "rgb(255,108,54)", fontWeight: "bold" }}>{dishData.dishPrice}￥</View>
                    </View>
                    <View style={{ width: "40%", height: "13vh", backgroundColor: 'white', display: 'flex', flexDirection: "column", justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <View style={{ width: "50%", background: "white", display: 'flex', justifyContent: 'space-between' }}>
                            <View style={{ fontSize: '10px', color: 'rgb(255,108,54)', backgroundColor: 'white', width: '5vw', height: '5vw', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {dishCounts && isShow ? <View onClick={subtractShopcar} className='at-icon at-icon-subtract-circle'
                                    style={{ fontSize: '18px' }}
                                ></View> : ''}
                            </View>
                            <View style={{ position: 'relative', top: '1px' }}>{dishCounts && isShow ? dishCounts : ''}</View>
                            <View style={{ fontSize: '10px', color: 'white', backgroundColor: 'rgb(255,108,55)', width: '5vw', height: '5vw', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <View onClick={addshopcar} className='at-icon at-icon-add'
                                ></View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    </>)
}
