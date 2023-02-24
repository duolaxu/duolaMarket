import { View, Image } from "@tarojs/components";
export default function commentComponent() {
    return <>
        <View style={{ padding: "10px 15px 15px 15px", width: "85%", height: "auto", backgroundColor: "white", marginTop: "10px", borderRadius: "10px" }}>
            <View style={{ width: "100%", height: "20vw", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "55%", height: "80%" }}>
                    <View style={{ width: '15vw', height: '15vw', marginLeft: "10px" }}>
                        <Image style={{ width: '15vw', height: '15vw', borderRadius: "50%" }} src="https://ts1.cn.mm.bing.net/th/id/R-C.af7548d13756357f1031f0e642c4deaf?rik=V05h4G7bn4QZJg&riu=http%3a%2f%2fimg95.699pic.com%2fphoto%2f50048%2f7849.jpg_wh860.jpg&ehk=0dHHckVPRnriLfDFjyEYIkc6mR09ruXpn4MYD8mgyG0%3d&risl=&pid=ImgRaw&r=0">

                        </Image>
                    </View>
                    <View style={{ width: "70%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
                        <View style={{ paddingLeft: "7px" }}>匿名用户</View>
                        <View style={{ display: "flex", paddingLeft: "7px" }}>
                            <View className='at-icon at-icon-star-2' style={{ color: "rgb(255,108,54)" }}></View>
                            <View className='at-icon at-icon-star-2' style={{ color: "rgb(255,108,54)", paddingLeft: "2px" }}></View>
                            <View className='at-icon at-icon-star-2' style={{ color: "rgb(255,108,54)", paddingLeft: "2px" }}></View>
                            <View className='at-icon at-icon-star-2' style={{ color: "rgb(255,108,54)", paddingLeft: "2px" }}></View>
                            <View className='at-icon at-icon-star-2' style={{ color: "rgb(255,108,54)", paddingLeft: "2px" }}></View>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: "10px", marginRight: "10px" }}>
                    <View>
                        2022-10-02
                    </View>
                </View>
            </View>
            <View style={{ paddingLeft: "20vw" }}>评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论评论</View>
        </View>

    </>
}