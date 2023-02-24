import { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Settings from "../../../../static/bottomBar.json"

export default function BottomBar() {
    useEffect(() => {
    }, [])
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

    return (<>
        <View style={{
            width: "100vw", height: "8vh",
            backgroundColor: Settings.bottomBarBackgroundColor,
            display: 'flex', justifyContent: "space-around",
            alignItems: 'center',
            position: 'fixed',
            bottom: '0px'
        }}>
            {
                bottomText.map((item, index) =>
                    <View onClick={() => selectFunc(index)}
                        style={{
                            backgroundColor: activeIndex == index ? Settings.bottomBarActiveBackgroundColor : "",
                            fontSize: Settings.bottomBarFontSize,
                            color: Settings.bottomBarColor,
                            height: "100%",
                            width: "100%",
                            display: 'flex', justifyContent: "space-around",
                            alignItems: 'center',
                        }}
                    >
                        <View style={{ fontSize: Settings.bottomBarFontSize }}>
                            {item}
                        </View>
                    </View>)
            }
        </View>
    </>)
}
