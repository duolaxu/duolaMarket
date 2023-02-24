import { useEffect, useState } from "react";
import { View, Image, Textarea, Radio } from "@tarojs/components";
import "taro-ui/dist/style/components/icon.scss";
import { heightRpx, baseUrl } from "../../static";

export default function BottomBar() {
    const [heightrpx, setHeightRpx] = useState(0);
    useEffect(() => {
        heightRpx(res => {
            setHeightRpx(res);
        })
    }, [])
    const [clickStarIndex, setClickStarIndex] = useState(-1);
    const [isChecked, setChecked] = useState(false);
    const stars = [0, 1, 2, 3, 4];
    const clickStar = index => {
        setClickStarIndex(index);
    }

    const renderStar = (preIndex) => {
        return stars.map((item, index) => {
            return <>
                <View onClick={() => { clickStar(index) }} className="at-icon at-icon-star-2"
                    style={{
                        color: index <= preIndex ? 'rgb(255,187,56)' : "rgb(235,235,235)",
                        fontSize: "50px"
                    }}></View>
            </>
        })
    }
    return (<>
        <View style={{ position: "relative", zIndex: "100", display: "flex", flexDirection: "column", alignItems: "center", width: "750rpx", height: "auto", backgroundColor: "rgb(244,244,244)", overflow: "scroll", }}>
            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "95%", height: "260rpx", backgroundColor: "white", marginTop: "15rpx", borderRadius: "8px" }}>
                <View style={{ width: "92%", height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start", }}>
                    <View style={{ width: "100%", height: "40%", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                        <Image style={{ width: "85rpx", height: "85rpx", borderRadius: "50%" }} src={`${baseUrl}/dishImg/1665294308315duola.png`} />
                        <View style={{ marginLeft: "15rpx" }}>哆啦商店</View>
                    </View>
                    <View style={{ display: "flex", alignItems: "center", justifyContent: "space-around", width: "100%", height: "60%" }}>
                        {renderStar(clickStarIndex)}
                    </View>
                </View>
            </View>
            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "95%", height: "400rpx", backgroundColor: "white", marginTop: "15rpx", borderRadius: "8px" }}>
                <View style={{ width: "92%", height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start", }}>
                    <View style={{ height: "18%", width: "100%" }}>你对我们的服务还满意吗? </View>
                    <View style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "82%", fontSize: "13px", backgroundColor: "rgb(244,244,244)", borderRadius: "4px" }}>
                        <View style={{ width: "95%", height: "90%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Textarea style={{ width: "100%", height: "100%" }} placeholder="亲, 你对我们的服务还满意吗? " />
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "95%", height: "auto", backgroundColor: "white", marginTop: "15rpx", borderRadius: "8px" }}>
                <View style={{ width: "92%", height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start", }}>
                    <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "100rpx", fontSize: "16px" }}>
                        <View>菜品评价</View>
                    </View>
                    <View style={{ fontSize: "13px", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                        <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "70rpx" }}>
                            <View>回锅肉</View>
                            <View>2</View>
                        </View>
                        <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "70rpx" }}>
                            <View>麻辣兔丁</View>
                            <View>2</View>
                        </View>
                        <View style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", height: "70rpx" }}>
                            <View>1</View>
                            <View>2</View>
                        </View>
                    </View>
                    <View style={{ width: "100%", height: "35rpx", fontSize: "13px", color: "rgb(153,153,153)", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>

                    </View>
                </View>
            </View>
            <View style={{ width: "95%", height: "auto", backgroundColor: "white", marginTop: "15rpx", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center" }}>

                {/* <View style={{ width: "92%", height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start", }}>
                    <View style={{ width: "100%", height: "70rpx", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                        <View> <Radio key={1} onClick={() => { setChecked(pre => !pre) }} onTouchCancel={() => { setChecked(false) }} onTouchStart={() => { setChecked(true) }} color="rgb(255,187,56)" value='1' checked={isChecked} /> 匿名评价</View>
                    </View>
                </View> */}
            </View>
            <View style={{ width: "95%", height: "150rpx", marginTop: "15rpx", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center" }}>

                <View style={{ width: "92%", height: "90%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-start", }}>
                    <View style={{ width: "100%", height: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                        <View style={{ width: "100%", height: "65%", borderRadius: "25px", backgroundColor: "rgb(255,187,56)", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>提交评价</View>
                    </View>
                </View>
            </View>
        </View>
        <View style={{ zIndex: "0", position: "fixed", top: "0px", left: "0px", backgroundColor: "rgb(244,244,244)", width: "750rpx", height: heightrpx + "rpx" }}></View>
    </>)
}
