import Taro, { getCurrentInstance } from "@tarojs/taro";
import { baseUrl, heightRpx, getStorageSync } from "../../../../static";
import { useEffect, useState } from "react";
import { View, Input } from "@tarojs/components";
import Dish from "../mainContent/dish";
import { dishListType } from "./type";
export default function Search(props) {
    const { clickInput, setClickInput, setDishDataDetail, isShowDishDetail, setShowDishDetail, setCartChange, reRenderDishData, setRenderDishData } = props;
    const [dishList, setDishList] = useState<dishListType[]>([]);
    const [dishData_1, setDishData_1] = useState<any[]>([]);
    const [heightrpx, setHeightrpx] = useState(0);
    const [inputValue, setInputValue] = useState("");
    useEffect(() => {
        heightRpx(res => {
            setHeightrpx(res);
        })
    })
    useEffect(() => {
        if (!clickInput) {
            setInputValue("");
            setDishData_1([]);
        } else {

            Taro.request({
                url: `${baseUrl}/order/getUpDishList`,
                data: {
                    // storeId: getStorageSync("storeId")
                    storeId: 7
                },
                method: "POST",
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    setDishList(res.data.data);
                }
            })
        }

    }, [clickInput])

    const inputSearch = e => {
        setInputValue(e.detail.value);
        if (e.detail.value != '') {
            let arr = dishList.filter((item, index) => {
                return item['dishName'].indexOf(e.detail.value) != -1;
            });
            setDishData_1(arr);
        }
    }

    const renderDishData = () => {
        return dishData_1.map((item) => {
            return <Dish
                setDishDataDetail={setDishDataDetail}
                isShowDishDetail={isShowDishDetail}
                setShowDishDetail={setShowDishDetail}
                setRenderDishData={setRenderDishData}
                reRenderDishData={reRenderDishData}
                props={item}
                setCartChange={setCartChange} />
        })
    }

    return (<>
        <View style={{ width: "750rpx", height: `${heightrpx}rpx`, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>
            <View style={{ width: "95%", height: "100rpx", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                <View style={{ borderRadius: "50rpx", border: "1px solid rgb(240,240,240)", backgroundColor: "white", display: "flex", alignItems: "center", height: "65%", width: "80%" }}>
                    <View style={{ width: "10%", display: "flex", justifyContent: "center" }}>
                        <View style={{ color: "rgb(127,127,127)" }} className="at-icon at-icon-search"></View>
                    </View>
                    <Input value={inputValue} onInput={(e) => { inputSearch(e) }} style={{ width: "80%", height: "100%" }} placeholder="请输入菜品名"></Input>
                    {inputValue == '' ? '' : <View onClick={() => { setInputValue(""); setDishData_1([]) }} className="at-icon at-icon-close" style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "13px", width: "40rpx", height: "40rpx", backgroundColor: "rgb(240,240,240)", borderRadius: "50%" }}></View>}
                </View>
                <View onClick={() => {
                    setClickInput(false);
                    Taro.navigateBack({ delta: 1 })
                }} style={{ height: "80%", width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}>取消</View>
            </View>
            <View style={{ width: "750rpx", height: "100%", backgroundColor: "rgb(240,240,240)" }}>
                {renderDishData()}
            </View>
        </View>
    </>)
}