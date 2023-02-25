import { useState, useEffect, useRef } from "react";
import Taro from "@tarojs/taro";
import Dish from "./dish";
import { dishDataType } from "./type";
import { View, ScrollView } from "@tarojs/components";
import { heightRpx, pxTorpx, baseUrl, postApi } from "../../../../static";
export default function MainContent(props) {
    const [dishData, setDishData] = useState<dishDataType[]>([]); // 菜品列表
    const [toView, setView] = useState('view0'); // 点击侧边栏自动定位到当前菜品类型顶部
    const [heightrpx, setHeightrpx] = useState(0); // 屏幕当前可用高度，rpx
    const refList = useRef([]);
    const [pxtorpx, setPxToRpx] = useState(0);
    const [dishTypelength, setDishTypeLength] = useState<number>(0);
    const [dishTypeList, setDishTypeList] = useState<any[]>([]);
    const [dishDataOver, setDataOver] = useState<any[]>([]);
    const [typeLength, setTypeLength] = useState({});
    const [typeIndex, setTypeIndex] = useState(0);
    // const dishDataOver = [];
    const [isDataChange, setDataChange] = useState(true);
    const {
        clickInput,
        storeParams,
        isShowDishDetail, // 菜品信息是否展示
        setShowDishDetail, // 菜品信息展示开关
        setCartChange, // 设置更改购物车数量
        setSidebarIndex, // 侧边栏下边
        reRenderDishData, // 菜品数量减少时，对菜品列表重新渲染
        setRenderDishData, //控制菜品列表是否重新渲染
        dishDataDetail,
        setDishDataDetail,
        selectDishTab
    } = props;

    const getDishTypeList = (index, type) => {
        postApi(`${baseUrl}/order/getUpTypeDishList`, {
            storeId: 7,
            dishType: type
        }).then(res => {
            // console.log("物品 = ", res.data);
            dishDataOver[index] = new Array();
            dishDataOver[index] = res.data.data;
            setDataOver(dishDataOver);
            typeLength[index] = res.data.data.length;
            let arr = [];
            for (let i = 0; i < dishDataOver.length; i++) {
                arr = arr.concat(dishDataOver[i]);
            }
            setDishData(arr);
            setDataChange(pre => !pre);
        })
    }

    // useEffect(() => {
    //     setView("view" + props.props);
    // }, [props])
    useEffect(() => {
        if (!clickInput) {
            setRenderDishData(pre => !pre);
        }
    }, [clickInput])

    useEffect(() => {
        // console.log("购物类型改变 = ", selectDishTab);
        setView("view" + selectDishTab);
        if (dishDataOver.length != dishTypelength) {
            getDishTypeList(selectDishTab, dishTypeList[selectDishTab]);
        }
    }, [selectDishTab])

    useEffect(() => {
        heightRpx(res => {
            setHeightrpx(res);
        })
        pxTorpx(res => {
            setPxToRpx(res);
        })

        Taro.request({
            url: `${baseUrl}/order/getDishTypeList`,
            data: {
                // storeId: storeParams.storeId
                storeId: 7
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                let typeList = res.data.data;
                setDishTypeLength(typeList.length);
                setDishTypeList(typeList);
                // console.log("物品种类 = ", res.data);
                for (let i = 0; i < typeList.length; i++) {
                    setTimeout(() => {
                        getDishTypeList(i, typeList[i]);
                    }, 50 * i)
                }
            }
        })
        // console.log("初始化下标 = ", selectDishTab);

    }, [])

    const scrollStyle = {
        height: `${heightrpx - 380}rpx`,
        width: "610rpx",
    };
    let scrollTop = 0;
    const Threshold = 100;
    const onScrollToUpper = () => {

    }

    let isSetIndex = false;

    const onScroll = event => {
        // 类型数量对应id数量，从接口获取dishTypeList
        // console.log("???? = ", typeLength);
        let dishTypeList = 8;
        let judge = true; // 图片加载临界点
        for (let i = 0; i < dishTypelength; i++) {
            const query = Taro.createSelectorQuery()
            query.select(`#view${i}`).boundingClientRect(function (res) {
                // console.log(i + " = " + res.top);
                if (res.top <= (380 / pxtorpx)) {
                    // console.log("I = ", i);
                    // console.log("RES.TOP = ", res.top);
                    // if(judge){
                    //     judge=false;
                    //     setTypeIndex(i);
                    //     for(let j=0;j<=i;j++){

                    //     }
                    // }
                    isSetIndex = true;
                } else {
                    // console.log("I_1 = ", i);
                    // console.log("RES.TOP_1 = ", res.top);
                    if (isSetIndex) {
                        setSidebarIndex(i - 1);
                        isSetIndex = false;
                    }
                }
            }).exec();
        }
    }

    const onScrollToLower = () => {
    }
    let indexId = 0;
    const renderDishData = () => {
        return <>
            {
                dishData.map((item, index) => {
                    if (index == 0) {
                        return <>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "95%", height: '60rpx', marginTop: "20rpx" }}>
                                <View style={{ color: "rgb(102,102,102)", fontWeight: 'bold', backgroundColor: "rgb(246,246,246)", width: "94%", height: "60rpx", borderRadius: "5px", marginLeft: "5rpx", display: "flex", alignItems: 'center' }}>
                                    <View id={'view' + indexId++} ref={element => { refList.current[item?.dishType] = element }} style={{ marginLeft: "32rpx" }}>
                                        {dishData[index]?.dishType}</View>
                                </View>
                            </View>
                            <Dish dishIndex={index} clickInput={clickInput} setDishDataDetail={setDishDataDetail} isShowDishDetail={isShowDishDetail} setShowDishDetail={setShowDishDetail} setRenderDishData={setRenderDishData} reRenderDishData={reRenderDishData} props={item} setCartChange={setCartChange} />
                        </>
                    } else if (index != dishData.length) {
                        return <>
                            {
                                dishData[index - 1]?.dishType != dishData[index]?.dishType ? <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: "95%", height: '60rpx', marginTop: "20rpx" }}>
                                    <View style={{ color: "rgb(102,102,102)", fontWeight: 'bold', backgroundColor: "rgb(246,246,246)", width: "94%", height: "60rpx", borderRadius: "5px", marginLeft: "5rpx", display: "flex", alignItems: 'center' }}>
                                        <View id={'view' + indexId++} ref={element => { refList.current[item?.dishType] = element }} style={{ marginLeft: "32rpx" }}>
                                            {dishData[index]?.dishType}</View></View>
                                </View> : <></>
                            }
                            <Dish dishIndex={index} setDishDataDetail={setDishDataDetail} isShowDishDetail={isShowDishDetail} setShowDishDetail={setShowDishDetail} setRenderDishData={setRenderDishData} reRenderDishData={reRenderDishData} props={item} setCartChange={setCartChange} />
                        </>
                    }

                })
            }
        </>
    }


    return (<>
        <View style={{
            height: `${heightrpx - 380}rpx`,
            overflow: 'scoll',
            position: 'relative',
            left: '17rpx'
        }}>
            <ScrollView
                className='scrollview'
                scrollY={true}
                scrollIntoView={toView}
                // scrollWithAnimation
                scrollTop={scrollTop}
                style={scrollStyle}
                lowerThreshold={Threshold}
                upperThreshold={Threshold}
                onScrollToUpper={onScrollToUpper}
                onScroll={onScroll}
                onScrollToLower={onScrollToLower}
            >
                {dishData.length == 0 ? <View></View> : (reRenderDishData || isDataChange ? renderDishData() : renderDishData())}
                <View style={{ width: "100%", height: "180rpx", backgroundColor: "rgb(240,240,240)" }}></View>
            </ScrollView>

        </View>
    </>)
}
