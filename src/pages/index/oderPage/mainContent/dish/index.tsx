import { useState, useEffect } from "react";
import { View, Image } from "@tarojs/components";
import "taro-ui/dist/style/components/icon.scss";
import { baseUrl } from "../../../../../static";
import "./index.css";
import { getStorage, getStorageSync, setStorage } from "../../../../../static";
import Taro from "@tarojs/taro";

export default function Dish(prop) {
    const { dishIndex, clickInput, setDishDataDetail, isShowDishDetail, setShowDishDetail, setCartChange, props, reRenderDishData, setRenderDishData } = prop;

    const [showdot, setShowDot] = useState(false);
    const [dishCounts, setDishCounts] = useState(0);
    const [isShow, setShow] = useState(false); //是否已加入购物车
    const [loadImgSrc, setImgSrc] = useState(false);

    useEffect(() => {
        // window.onscroll=()=>{
        //     console.log("????")
        // }
        getStorage(
            'shopCart',
            function (res) {
                let counts = 0;
                Array.isArray(res) && res.map(item => {
                    if (item.dishId == props?.dishId) {
                        counts++;
                    }
                })
                setDishCounts(counts);
                setShow(true);
            }
        )
    }, [reRenderDishData, clickInput])
    useEffect(() => {

        setTimeout(() => {
            setImgSrc(true);
        }, dishIndex * 10); //图片异步加载
        // Taro.createSelectorQuery().select(`#dish_${dishIndex}`).boundingClientRect(function (rect) {
        //     // if (0 <= rect.top) {
        //     //     that.setData({
        //     //         curr: false
        //     //     })
        //     // } else {
        //     //     that.setData({
        //     //         curr: true
        //     //     })
        //     // }
        //     // console.log(dishIndex + " = " + rect.top);
        //     if (rect.top > 200 && rect.top < 2000) {
        //         setImgSrc(true);
        //     }

        // }).exec()

        // console.log("dishIndex = ", dishIndex);
        // document.addEventListener("scroll", () => {
        //     console.log("???!!!!")
        // }, true)
    })

    const addshopcar = (e) => {

        if (showdot == true) {
            return
        }
        setDishCounts(pre => pre + 1);
        setCartChange(pre => ++pre);
        setShow(true);
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
        setRenderDishData(pre => !pre);
    }
    const subtractShopcar = () => {
        let shopCarts = getStorageSync("shopCart");
        let judge = false;
        shopCarts = shopCarts.filter(item => {
            if (item.dishId == props?.dishId && !judge) {
                judge = true;
            } else {
                return item;
            }
        });
        setStorage(
            "shopCart",
            shopCarts
        )
        setCartChange(pre => ++pre);
        setRenderDishData(pre => !pre);
    }

    return (<>
        <View id={'dish_' + dishIndex} onClick={() => { setShowDishDetail(pre => !pre); setDishDataDetail(props) }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '90%', height: '205rpx', backgroundColor: "white", fontSize: '10px', borderRadius: '5px', marginTop: '3%', marginLeft: "3%" }}>
            <View style={{ width: "90%", height: "80%", backgroundColor: "white", display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '5px' }}>
                <View style={{
                    width: "164rpx",
                    height: "164rpx",
                    borderRadius: '5px',
                    backgroundColor: 'white'
                }}>
                    <Image style={{ borderRadius: '5px', width: '164rpx', height: "164rpx" }} src={loadImgSrc ? props?.dishImg : ""}></Image>
                </View>
                <View style={{ width: "40%", height: "100%", display: "flex", flexDirection: 'column', justifyContent: "space-between" }}>
                    <View style={{ fontSize: "13px", fontWeight: "bold" }}>{props?.dishName}</View>
                    <View style={{ fontSize: '13px', color: "rgb(150,150,150)" }}>{props?.dishMonthSales}</View>
                    <View style={{ fontSize: "14px", color: "rgb(255,108,54)", fontWeight: "bold" }}>{props?.dishPrice + '￥'}</View>
                </View>
                <View style={{ width: '24%', height: '100%', backgroundColor: 'white', display: 'flex', flexDirection: "column", justifyContent: 'flex-end' }}>
                    <View onClick={e => { e.stopPropagation() }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
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
    </>)
}
