import { View, Image, Text } from "@tarojs/components";
import "taro-ui/dist/style/components/icon.scss";
import Taro from "@tarojs/taro";
import { heightRpx } from "../../static";
import { useEffect, useState } from "react";

export default function BottomBar() {
    const [heightrpx, setHeightrpx] = useState(0);

    useEffect(() => {
        heightRpx(res => {
            setHeightrpx(res);
        })
    }, [])

    return (<>

        <View className="flexCenter" style={{ width: "750rpx", height: (heightrpx - 130) + 'rpx' }}>
            <View className="flexAround" style={{ width: "85%", height: "200rpx" }}>
                <Image style={{ width: "70rpx", height: "70rpx" }} src={'https://duolago.cn/icon/success.svg'} />
                <View onClick={() => { }} style={{ color: "rgb(112,112,112)", fontSize: "12px", width: "87%" }}>
                    你的信息已提交成功, 待管理员审核通过后即可发表, 进度可在我的-<Text style={{ color: "rgb(254,108,57)" }}>我的发布</Text>里查看进度.
                </View>
            </View>
        </View>
    </>)
}



















