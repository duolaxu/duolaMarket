import { Canvas, View, Block, OpenData, Button, Image } from "@tarojs/components";
import { useEffect, useState } from "react";
import SlideColorPicker from "./sliderColorPicker";
import SettingPicker from "./settingPicker";
import Taro from "@tarojs/taro";
export default function Index(props) {
    const { setIconUrl, setBottomBackColor, setBottomBtnColor, setShowColorPicker } = props;
    const [color, setColor] = useState("rgb(255,108,54)");
    const [selector, setSelector] = useState([['底部栏'], ['购物车图标', '底部栏背景颜色', '结算按钮背景颜色']]);
    const [selectValue, setSelectValue] = useState([0, 0]);
    const settingActions = [[setIconUrl, setBottomBackColor, setBottomBtnColor]];

    const [imgUrl, setImgUrl] = useState("");

    // 事件处理函数
    const sliderColor = (color) => {
        settingActions[selectValue[0]][selectValue[1]](color);
        setColor(color);
    };
    useEffect(() => {
    }, [selectValue])

    const uploadImg = () => {
        Taro.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                setImgUrl(res.tempFilePaths[0]);
                setIconUrl(res.tempFilePaths[0]);
            }
        })
    }

    return (<>


        <View style={{ fontSize: "14px", width: "750rpx", display: "flex", justifyContent: "center", color: "white", position: "fixed", top: "0rpx", opacity: "1" }}>
            {selector[1][selectValue[1]]}
        </View>
        {
            selectValue[1] == 0 ?
                <View style={{ position: "fixed", left: "0px", top: "0px", zIndex: "1005", width: "750rpx", height: "300rpx", backgroundColor: "rgba(255,255,255,0.5)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <View
                        onClick={() => setShowColorPicker(false)}

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
                            top: "15rpx",
                            left: "685rpx",
                            zIndex: "1010"
                        }}
                    >
                        <View className='at-icon at-icon-close' style={{ fontSize: "10px" }}></View>
                    </View>
                    <View onClick={uploadImg}
                        style={{
                            width: "200rpx",
                            height: "200rpx",
                            backgroundColor: "rgba(255,255,255,0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >

                        {

                            imgUrl ? <Image style={{ width: "100%", height: "100%" }} src={imgUrl} />
                                : <View style={{ width: "50rpx", height: "50rpx", color: "rgb(155,155,155)", fontSize: "23px" }} className="at-icon at-icon-upload"></View>
                        }

                    </View>
                </View>
                :
                <View style={{ position: "fixed", left: "0px", top: "0px", zIndex: "1005", width: "750rpx", height: "300rpx", backgroundColor: "rgba(255,255,255,0.5)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <View
                        onClick={() => setShowColorPicker(false)}

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
                            top: "15rpx",
                            left: "685rpx",
                            zIndex: "1010"
                        }}
                    >
                        <View className='at-icon at-icon-close' style={{ fontSize: "10px" }}></View>
                    </View>
                    <Button style={{ width: "400rpx", height: "100rpx", backgroundColor: color, color: "#ffffff" }}>{color}</Button>
                    <View style={{ width: "400rpx", height: "50rpx", marginTop: "50rpx" }}>
                        <SlideColorPicker MoveSlide={sliderColor} lineLength={160} sliderBtn={10}></SlideColorPicker>
                    </View>
                </View>
        }
        <View style={{ zIndex: "1005", position: "fixed", top: "15rpx", left: "15rpx", opacity: "1" }}>
            <SettingPicker setSelectValue={setSelectValue} selector={selector} setSelector={setSelector} />
        </View>

        <View>

        </View>

    </>)
}