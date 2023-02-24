import { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import { setStorage, getStorageSync } from "../../../../static";
import Dish from "./mainContent";
import Taro from "@tarojs/taro";

export default function Index(props) {
    const { isClickCart, setClickCart, setCartChange, reRenderDishData, setRenderDishData } = props;
    const [shopCarts, setShopCarts] = useState<any[]>([]);

    useEffect(() => {
        let shopcarts = getStorageSync("shopCart");
        let cartArr: any[] = [];
        let judge = {};
        Array.isArray(shopcarts) && shopcarts.map(item => {
            if (!judge[item.dishId]) {
                judge[item.dishId] = true;
                cartArr.push(item);
            }
        })
        setShopCarts(cartArr);

    }, [isClickCart])
    useEffect(() => {
    }, [])
    useEffect(() => {
        const dishData = getStorageSync("shopCart");
        if (dishData == '') {
            setClickCart(false);
        } else if (Array.isArray(dishData) && dishData.length == 0) {
            setClickCart(false);
        }
    }, [reRenderDishData])

    const renderShopCarts = () => {
        return Array.isArray(shopCarts) && shopCarts.map((item, index) => {
            return <Dish isClickCart={isClickCart} setRenderDishData={setRenderDishData} setCartChange={setCartChange} props={item} reRenderDishData={reRenderDishData} />
        })
    }

    const styleC = {
        position: "fixed",
        bottom: "118rpx",
        left: "0px",
        background: "rgb(127,127,127,0.5)",
        height: "100vh",
        width: "750rpx",
        transition: "height 2s cubic-bezier(0.2, 1.0, 0.2, 1.0)",
        zIndex: "50",
    }
    const styleD = {
        position: "fixed",
        bottom: "0rpx",
        left: "0px",
        background: "rgba(127,127,127,0.5)",
        height: "0vh",
        width: "750rpx",
        transition: "height 2s cubic-bezier(0.2, 1.0, 0.2, 1.0)",
        zIndex: "50",
    }

    const Test = () => {
        setClickCart(!isClickCart)
    }

    const Test_1 = () => {
        setClickCart(!isClickCart)
    }

    const Test_2 = (e) => {
        e.stopPropagation(); // 阻止子组件事件向父组件传递
    }


    const [touchx, setTouchx] = useState(0);
    const [touchy, setTouchy] = useState(0);
    const [isChange, setChange] = useState('center');

    const touchStart = (e) => {
        setTouchx(e.changedTouches[0].clientX);
        setTouchy(e.changedTouches[0].clientY);
    };
    const touchEnd = (e) => {
        let x = e.changedTouches[0].clientX;
        let y = e.changedTouches[0].clientY;
        let turn = "";

        if (x - touchx > 50 && Math.abs(y - touchy) < 50) {      //右滑
            turn = "right";
            setChange("right");
            setClickCart(!isClickCart)
        } else if (x - touchx < -50 && Math.abs(y - touchy) < 50) {   //左滑
            turn = "left";
            setChange("left");

        }
        if (y - touchy > 50 && Math.abs(x - touchx) < 50) { //下滑
            turn = "down";
            setChange("down");


        } else if (y - touchy < -50 && Math.abs(x - touchx) < 50) { //上滑
            turn = "up";
            setChange("up");


        }
        //根据方向进行操作
        if (turn == 'down') {
            //下滑触发操作
        }
    }

    const clearShopCart = () => {
        Taro.showModal({
            title: '',
            content: '确认清空购物车吗?',
            success(res) {
                if (res.confirm) {
                    setStorage(
                        'shopCart',
                        ""
                    )
                    setCartChange(pre => ++pre);
                    setRenderDishData(pre => !pre);
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }


    return (<>
        <View style={!isClickCart ? {
            position: "fixed",
            bottom: "0rpx",
            left: "0px",
            background: "rgba(127,127,127,0.5)",
            height: "0vh",
            width: "750rpx",
            transition: "height 2s cubic-bezier(0.2, 1.0, 0.2, 1.0)",
            zIndex: "50",
        } : {
            position: "fixed",
            bottom: "118rpx",
            left: "0px",
            background: "rgb(127,127,127,0.5)",
            height: "100vh",
            width: "750rpx",
            transition: "height 2s cubic-bezier(0.2, 1.0, 0.2, 1.0)",
            zIndex: "50",
        }} onTouchStart={e => touchStart(e)} onTouchEnd={e => touchEnd(e)}>
            <View onClick={Test} style={{ width: "750rpx", height: '50vh' }}></View>
            <View onClick={Test_1} style={{ width: "750rpx", height: "50vh", display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                <View onClick={Test_2} style={{ borderRadius: "45rpx", backgroundColor: "white", maxHeight: '50vh', width: "100%", overflow: 'scroll', paddingLeft: '35rpx' }}>
                    <View style={{ backgroundColor: "white", zIndex: "2000", position: "fixed", width: "95%", height: "80rpx", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ color: "rgb(89,89,89)", fontSize: "13px" }}>已选商品</View>
                        <View onClick={clearShopCart} style={{ color: "rgb(150,150,150)", fontSize: "14px" }}> <View className='at-icon at-icon-trash'
                        ></View>&nbsp;清空</View>
                    </View>
                    <View style={{ marginTop: "80rpx" }}>
                        {renderShopCarts()}
                    </View>
                </View>
            </View>
        </View>
    </>)
}