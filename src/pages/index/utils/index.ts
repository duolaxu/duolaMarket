import { useState } from "react";
export function funcUseState() {
    const [clickInput, setClickInput] = useState(false); // 是否点击搜索框
    const [dishDataDetail, setDishDataDetail] = useState({});
    const [reRenderDishData, setRenderDishData] = useState(true);
    return { clickInput, setClickInput, dishDataDetail, setDishDataDetail, reRenderDishData, setRenderDishData };
}