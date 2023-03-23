import { useState, useEffect } from "react";
import Taro, { getStorageSync } from "@tarojs/taro";
import { heightRpx, baseUrl } from "../../../../static";
import { View } from "@tarojs/components";
import Settings from "../../../../static/sidebar.json";

export default function SideBar(props) {
    const [sideBarList, setSideBarList] = useState<any[]>(getStorageSync("dishTypeList") || []);
    const { storeParams, setDishTab, sidebarIndex } = props;
    const [heightrpx, setHeightrpx] = useState(0);
    const lent = sideBarList.length;
    const [preTime, setPreTime] = useState(Date.now());

    const [judgeIndexStatus, setJudgeIndexStatus] = useState(true); // 判断侧边栏状态改变是因下拉引起还是点击事件引起, 避免下拉事件导致activeIndex设置两次

    const [activeIndex, setActiveIndex] = useState<Number>(0);
    const selectDish = (index) => {
        let nowTime = Date.now();
        setJudgeIndexStatus(false);
        if (nowTime - preTime >= 300) {
            setActiveIndex(index);
            setDishTab(index);
            setPreTime(nowTime);
        }

    }

    useEffect(() => {
        // console.log("sideBar_1 = ", storeParams);
        // console.log("sideBar_2 = ", setDishTab);
        // console.log("sideBar_3 = ", sidebarIndex);
        heightRpx(res => {
            setHeightrpx(res);
        })
        if (sideBarList.length == 0) {
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
                    setSideBarList(res.data.data);
                }
            })
        } else {

        }
    }, [])

    useEffect(() => {
        judgeIndexStatus && setActiveIndex(sidebarIndex);
        setJudgeIndexStatus(true);
    }, [sidebarIndex])



    const sideBarRender = () => {
        return sideBarList.map((item, index: Number) => {
            return <>
                {index === lent ? <View style={{ height: "20rpx" }}></View>
                    : <View onClick={() => { return selectDish(index) }} className={activeIndex === index ? 'sideBarChild' : ''} style={{ fontWeight: activeIndex === index ? 'bold' : '', color: activeIndex === index ? Settings.sideBarActiveColor : Settings.sideBarColor, height: '85rpx', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: activeIndex === index ? Settings.sideBarActiveBackgroundColor : '' }}>
                        <View style={{ fontSize: Settings.sideBarFontSize }}>
                            {item}
                        </View>
                    </View>
                }
            </>
        })
    }

    return (<>
        <View style={{ width: '140rpx', height: `${heightrpx - 380}rpx`, backgroundColor: 'white', overflow: 'scroll' }}>
            {sideBarRender()}
            <View style={{ width: "100%", height: "180rpx", backgroundColor: "rgb(240,240,240)" }}></View>
        </View>
    </>)
}
