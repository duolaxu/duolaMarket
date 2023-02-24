import { View, Picker } from '@tarojs/components';
export default function Index(props) {
    const { selector, setSelector, setSelectValue } = props;
    const Change = e => {
        setSelectValue(e.detail.value);
    }
    return (
        <View className='container'>
            <View className='page-body'>
                <View className='page-section'>
                    <View>
                        <Picker range={selector} mode='multiSelector' onChange={Change} value={selector}>
                            <View style={{ fontSize: "12px", color: "rgb(245,108,54)" }}>选择配置类型</View>
                        </Picker>
                    </View>
                </View>
            </View>
        </View>
    )
}