import OrderPage from "./oderPage";
import { getCurrentInstance, getStorageSync } from "@tarojs/taro";
import { useEffect, useState } from "react";
import { View, Image } from "@tarojs/components";
import "taro-ui/dist/style/components/icon.scss";
import SliderColorPicker from "./sliderColorPicker";
import { baseUrl } from "../../static";
import Taro from "@tarojs/taro";

export default function Index() {
  const params = getCurrentInstance().router?.params;
  // console.log("参数 = ", params);

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [bottomBackColor, setBottomBackColor] = useState("rgb(89,89,89)");
  const [bottomBtnColor, setBottomBtnColor] = useState("rgb(255,108,55)");
  const [iconUrl, setIconUrl] = useState("");
  const [showFullLocation, setShowFullLocation] = useState(false);
  const [clickInput, setClickInput] = useState(params?.isClick == "true" ? true : false); // 是否点击搜索框
  const [storeData, setStoreData] = useState<any>();

  let parsClick = false;
  if (params?.isClick == "true") {
    parsClick = true;
  }

  useEffect(() => {
    if (params?.isClick == "true") {
      parsClick = true;
      setClickInput(true);
    }
    Taro.request({
      url: `${baseUrl}/order/getSingleStore`,
      data: {
        // storeId
        storeId: 7
      },
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        setStoreData(res.data.data[0]);
      }
    })
  }, [])
  return (<>
    {/* top图片 地址，设置，店铺头像 */}
    {
      clickInput ? "" : <>
        <View style={{ width: "750rpx", height: "200rpx", }}>
          <Image style={{ width: "100%", height: "100%" }} src="https://duolago.cn/secondHand/undefined_1676673416419.jpg" />
        </View>
        <View style={{ width: "100%", height: "100rpx", display: "flex", justifyContent: "space-around", alignItems: "center", }}>
          <View style={{ width: "70%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>
            <View onClick={() => {
              setShowFullLocation(true);
              setTimeout(() => {
                setShowFullLocation(false);
              }, 2000)
            }} style={{ position: "relative", width: "100%", paddingLeft: "40rpx", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <View style={{ fontSize: "14px" }} className="at-icon at-icon-map-pin"></View>
              <View

                style={{

                  paddingLeft: "10rpx",
                  fontSize: "12px",
                  color: "rgb(127,127,127)",
                  overflow: "hidden",
                  textOverflow: "ellipsis", // 文字超出部分以省略号展示
                  whiteSpace: "nowrap",
                  width: "50%",
                }}>
                {showFullLocation ?
                  <View
                    style={{
                      position: "absolute",
                      bottom: "35rpx",
                      wordBreak: "break-word",// 在单词和url内部换行
                      whiteSpace: "pre-line",// 合并空白符序列并保留换行符
                      fontSize: "13px",
                      zIndex: "2000",
                      width: "50%",
                      color: "white",
                      height: "auto",
                      userSelect: "all", // 单击文本区域复制全文本
                      backgroundColor: "rgba(154,154,154,0.5)",
                      borderRadius: "3px"
                    }}>{storeData?.storeLocation}</View> : ''}
                {storeData?.storeLocation}</View>
            </View>
            <View style={{ width: "100%", paddingLeft: "40rpx", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <View onClick={() => { }} style={{ fontSize: "14px" }} className="at-icon at-icon-settings"></View>
              {/* <View onClick={() => setShowColorPicker(true)} style={{ fontSize: "14px" }} className="at-icon at-icon-settings"></View> */}
              <View style={{ paddingLeft: "10rpx", fontSize: "12px", color: "rgb(127,127,127)" }}>营业时间: 9:00~22:00</View>
            </View>
          </View>
          <View style={{ zIndex: "103" }}>
            <Image style={{ borderRadius: "4px", width: "140rpx", height: "140rpx", zIndex: "103", marginTop: "-55rpx" }} src={`${baseUrl + storeData?.storeHeadImg}`} />
          </View>
        </View>
      </>
    }
    <View style={{ display: showColorPicker ? 'block' : 'none', }}><SliderColorPicker setIconUrl={setIconUrl} setBottomBackColor={setBottomBackColor} setBottomBtnColor={setBottomBtnColor} setShowColorPicker={setShowColorPicker} /></View>

    <OrderPage clickInput={clickInput} parsClick={parsClick} setClickInput={setClickInput} iconUrl={iconUrl} bottomBackColor={bottomBackColor} bottomBtnBackColor={bottomBtnColor} params={params} />
  </>)
}
