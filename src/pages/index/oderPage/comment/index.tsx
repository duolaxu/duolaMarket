import { View } from "@tarojs/components";
import CommentComponent from "./commentComponent";
import { heightRpx } from "../../../../static";
import { useState, useEffect } from "react";
export default function Comment() {
    const [heightrpx, setHeightrpx] = useState(0);
    useEffect(() => {
        heightRpx(res => {
            setHeightrpx(res);
        })
    }, [])
    return <>
        <View style={{ width: "100vw", height: `${heightrpx - 380}rpx`, backgroundColor: "rgb(240,240,240)", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", overflow: "scroll" }}>
            <CommentComponent />
        </View>
    </>
}