import { Canvas } from "@tarojs/components";
import { useEffect, useState, useRef } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
export default function Index(props) {

    const { MoveSlide, lineLength, sliderBtn } = props;
    const that = useRef(null);

    const [color, setColor] = useState('#FFFFFF');
    const [headX, setHeadX] = useState(12);
    const [headY, setHeadY] = useState(12);
    useEffect(() => {
        setHeadX(parseInt(sliderBtn) + 2);
        setHeadY(sliderBtn + 2);
        drawImageBase(headX, headY, "#FF0000");
    }, [])

    const hexoToString = (x) => {
        x = x.toString(16).toUpperCase()
        if (x.length == 1) {
            return "0" + x;
        }
        return x
    }
    const moveSlider = (e) => {
        let x = e.touches[0].x;
        let y = e.touches[0].y; // 坐标

        if (x >= lineLength + headX) {
            x = lineLength + headX
        }
        if (x <= headX) {
            x = headX
        }
        let color = calcuColor(x, lineLength);
        setColor(color);
        MoveSlide(color);
        drawImageBase(x, 12, color)
    }
    const calcuColor = (cur, length) => {

        let sliderLength = cur - headX; //当前滑动距离为
        let perColorLength = length / 5;  //每块色带距离是
        let order = sliderLength / perColorLength; //滑动到的色带次序
        let relLength = sliderLength % perColorLength; //滑动到当前色带的距离
        let x = 255 * relLength / perColorLength; // 十进制

        let x_tmp = 255 - x;
        let color = "#FF0000"
        switch (order) {
            case 0: {
                color = "#FF0000"
                if (relLength = 0) {
                    return color;
                }
                color = "#FF" + hexoToString(x) + "00"
                return color;
            }
            case 1: {
                color = "#FFFF00"
                if (relLength = 0) {
                    return color;
                }
                color = "#" + hexoToString(x_tmp) + "FF00"
                return color;
            }
            case 2: {
                color = "#00FF00"
                if (relLength = 0) {
                    return color;
                }
                color = "#00FF" + hexoToString(x)
                return color;
            }
            case 3: {
                color = "#00FFFF"
                if (relLength = 0) {
                    return color;
                }
                color = "#00" + hexoToString(x_tmp) + "FF"
                return color;
            }
            case 4: {
                color = "#0000FF"
                if (relLength = 0) {
                    return color;
                }
                color = "#" + hexoToString(x) + "00FF"
                return color;
            }
            default: {
                return "#FF00FF"
            }
        }
    }

    const drawImageBase = (x, y, color) => {
        //初始化方法
        const ctx = Taro.createCanvasContext('slider', getCurrentInstance());
        ctx.beginPath();
        ctx.arc(x, y, sliderBtn, 0, 2 * Math.PI);
        let strokeColor = color

        ctx.fillStyle = color;//设置填充颜色
        ctx.fill();//开始填充

        ctx.strokeStyle = strokeColor;//将线条颜色设置为蓝色
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        const grd = ctx.createLinearGradient(headX, headY, lineLength, 10)
        grd.addColorStop(0, '#FF0000')
        grd.addColorStop(0.2, '#FFFF00')
        grd.addColorStop(0.4, '#00FF00')
        grd.addColorStop(0.6, '#00FFFF')
        grd.addColorStop(0.8, '#0000FF')
        grd.addColorStop(1, '#FF00FF')

        ctx.setFillStyle(grd);
        ctx.fillRect(headX, headY, lineLength, 2);
        ctx.closePath();
        ctx.draw();
    }


    return (<>
        <Canvas
            ref={that}
            className='canvasSty'
            style={{
                width: '750rpx',
                height: 2.3 * sliderBtn + 'px'
            }}
            canvasId='slider'
            onTouchMove={moveSlider} ></Canvas>
    </>)
}