import { useState, useEffect } from "react";
import SideBar from "./sideBar";
import TopBar from "./topBar";
import MainContent from "./mainContent";
import ShopCart from "./shopCart";
import { View } from "@tarojs/components";
import Merchant from "./merchant";
import Comment from "./comment";
import { getStorage } from "../../../static";
import ShopCartDetail from "./shopCartDetail";
import Taro, { getStorageSync, useDidHide, useDidShow } from "@tarojs/taro";
import Search from "./search";
import DishDetail from "./mainContent/dishDetial";

export default function Index(params) { // params包含商店Id，商店名，商店位置，以及商店头像

    const { iconUrl, bottomBackColor, bottomBtnBackColor, parsClick, clickInput, setClickInput } = params;

    const [isShowDishDetail, setShowDishDetail] = useState(false); // 控制菜品详情页的显示与隐藏
    const [selectTab, setSelectTab] = useState(0);
    const [selectDishTab, setDishTab] = useState(0);
    const [isClickCart, setClickCart] = useState(false);
    const [cartChange, setCartChange] = useState(0);
    const [shopCartCounts, setShopCartCounts] = useState(0);
    const [sidebarIndex, setSidebarIndex] = useState(0);
    const [reRenderDishData, setRenderDishData] = useState(true);
    const [topBarChange, setTopBarChange] = useState(false);
    const [dishDataDetail, setDishDataDetail] = useState({});

    useDidShow(() => {
        if (getStorageSync("shopCart") == "") {
            setShopCartCounts(0);
            setRenderDishData(pre => !pre);
        } else {
            setRenderDishData(pre => !pre);
        }
        setCartChange(pre => ++pre);
    })
    useDidHide(() => {
        if (getStorageSync("shopCart") == "") {
            setShopCartCounts(0);
            setRenderDishData(pre => !pre);
        }
    })

    useEffect(() => {
        Taro.setNavigationBarTitle({ title: '巷子里超市' });
    }, [])

    useEffect(() => {
        getStorage("shopCart", res => {
            setShopCartCounts(res.length);
        })
    }, [cartChange])

    const renderMainContent = () => {
        return <>
            <View style={{ display: `${selectTab == 0 ? 'flex' : 'none'}`, justifyContent: 'space-between', fontFamily: "Microsoft Yahei" }}>
                <SideBar storeParams={params.params} setDishTab={setDishTab} sidebarIndex={sidebarIndex} />
                <View style={{ backgroundColor: 'rgb(240,240,240)', width: "78%", display: "flex", flexDirection: "column", justifyContent: 'flex-start', alignItems: 'center', height: "100%", overflow: 'scroll' }}>
                    <MainContent clickInput={clickInput} dishDataDetail={dishDataDetail} setDishDataDetail={setDishDataDetail} storeParams={params.params} setShowDishDetail={setShowDishDetail} isShowDishDetail={isShowDishDetail} topBarChange={topBarChange} setRenderDishData={setRenderDishData} reRenderDishData={reRenderDishData} selectDishTab={selectDishTab} setSidebarIndex={setSidebarIndex} setCartChange={setCartChange} />
                </View>
            </View>
            <View style={{ display: `${selectTab == 1 ? 'block' : 'none'}` }}>
                <Comment />
            </View>
            <View style={{ display: `${selectTab == 2 ? 'block' : 'none'}` }}>
                <Merchant merchantData={params.params} />
            </View>
        </>
    };
    return (<>
        <View style={{ display: clickInput ? 'block' : 'none' }}>
            <Search clickInput={clickInput} setClickInput={setClickInput} setDishDataDetail={setDishDataDetail} isShowDishDetail={isShowDishDetail} setShowDishDetail={setShowDishDetail} setRenderDishData={setRenderDishData} reRenderDishData={reRenderDishData} setCartChange={setCartChange} />
        </View>
        {
            clickInput ? "" :
                <View>
                    <TopBar
                        setClickInput={setClickInput}
                        // storeId={params.params.storeId} setTopBarChange={setTopBarChange} setSelectTab={setSelectTab} setShowDishDetail={setShowDishDetail} setClickCart={setClickCart} shopCartCounts={shopCartCounts} />
                        storeId={7} setTopBarChange={setTopBarChange} setSelectTab={setSelectTab} setShowDishDetail={setShowDishDetail} setClickCart={setClickCart} shopCartCounts={shopCartCounts} />
                    {/* 搜索结果展示 */}
                    {renderMainContent()}
                </View>
        }
        <View style={{ display: selectTab == 0 ? 'block' : 'none' }}>
            <ShopCart storeConnection={params.params.storeConnection} storeName={params.params.storeName} storeImg={params.params.storeHeadImg} iconUrl={iconUrl} bottomBackColor={bottomBackColor} bottomBtnBackColor={bottomBtnBackColor} setShowDishDetail={setShowDishDetail} setClickCart={setClickCart} shopCartCounts={shopCartCounts} />


        </View>
        <DishDetail reRenderDishData={reRenderDishData} setRenderDishData={setRenderDishData} setCartChange={setCartChange} setShowDishDetail={setShowDishDetail} isShowDishDetail={isShowDishDetail} dishData={dishDataDetail} />

        <ShopCartDetail reRenderDishData={reRenderDishData} setRenderDishData={setRenderDishData} setCartChange={setCartChange} setClickCart={setClickCart} isClickCart={isClickCart} />
    </>)
}