import { useState, useEffect } from "react";
import { View, Image } from "@tarojs/components";
import "taro-ui/dist/style/components/icon.scss";
import { getStorage, getStorageSync, setStorage, baseUrl } from "../../../../../static"

export default function Dish(prop) {
    const { setCartChange, props, setRenderDishData, reRenderDishData, isClickCart } = prop;
    const [dishCounts, setDishCounts] = useState(0);
    useEffect(() => {

        let shopCarts = getStorageSync("shopCart");
        let counts = 0;
        {
            Array.isArray(shopCarts) ?
                (
                    shopCarts.map(item => {
                        if (item.dishId == props.dishId) {
                            counts++;
                        }
                    })
                )
                : ''
        }
        setDishCounts(counts);
    }, [reRenderDishData, isClickCart]);
    const addshopcar = () => {
        setCartChange(pre => ++pre);
        let preShopCart = getStorageSync('shopCart');
        if (preShopCart == '') {
            setStorage(
                'shopCart',
                [props]
            )
        } else {
            preShopCart.push(props);

            setStorage(
                'shopCart',
                preShopCart
            )

        }
        getStorage(
            'shopCart',
            function (res) {
                let counts = 0;
                Array.isArray(res) && res.map(item => {
                    if (item.dishId == props.dishId) {
                        counts++;
                    }
                })
                setDishCounts(counts);
            }
        )
        setRenderDishData(pre => !pre);
    }
    const subtractShopcar = () => {
        let shopCarts = getStorageSync("shopCart");
        let judge = false;
        shopCarts = shopCarts.filter(item => {
            if (item.dishId == props.dishId && !judge) {
                judge = true;
            } else {
                return item;
            }
        });
        setStorage(
            "shopCart",
            shopCarts
        )
        getStorage(
            'shopCart',
            function (res) {
                let counts = 0;
                Array.isArray(res) && res.map(item => {
                    if (item.dishId == props.dishId) {
                        counts++;
                    }
                })
                setDishCounts(counts);
            }
        )
        setCartChange(pre => ++pre);
        setRenderDishData(pre => !pre);
    }




    return (<>
        {
            <View style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '95%',
                height: '15vh',
                backgroundColor: "white",
                fontSize: '10px',
                borderRadius: '5px',
                marginBottom: '3%',
                opacity: '1',
                border: '0px solid rgb(240,240,240)',
                borderWidth: "1px 1px 1px 1px"
            }}>
                <View style={{ width: "90%", height: "80%", backgroundColor: "white", display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '5px' }}>
                    <View style={{
                        width: "30%",
                        height: "100%",
                        borderRadius: '5px'
                    }}>
                        <Image style={{ width: "100%", height: "100%", borderRadius: '5px' }} src={props.dishImg}></Image>
                    </View>
                    <View style={{ width: "40%", height: "100%", display: "flex", flexDirection: 'column', justifyContent: "space-between" }}>
                        <View style={{ fontSize: "15px" }}>{props.dishName}</View>
                        <View style={{ fontSize: '13px', color: "rgb(150,150,150)" }}>{props.dishMonthSales}</View>
                        <View style={{ fontSize: "14px", color: "rgb(255,108,54)", fontWeight: "bold" }}>{props.dishPrice + '￥'}</View>
                    </View>
                    <View style={{ width: '24%', height: '100%', backgroundColor: 'white', display: 'flex', flexDirection: "column", justifyContent: 'flex-end' }}>
                        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                            <View style={{ fontSize: '10px', color: 'rgb(255,108,54)', backgroundColor: 'white', width: '5vw', height: '5vw', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {dishCounts ? <View onClick={subtractShopcar} className='at-icon at-icon-subtract-circle'
                                    style={{ fontSize: '18px' }}
                                ></View> : ''}
                            </View>
                            <View style={{ position: 'relative', top: '1px' }}>{dishCounts ? dishCounts : ''}</View>
                            <View style={{ fontSize: '10px', color: 'white', backgroundColor: 'rgb(255,108,55)', width: '5vw', height: '5vw', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <View onClick={addshopcar} className='at-icon at-icon-add'
                                ></View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        }
    </>)
}
