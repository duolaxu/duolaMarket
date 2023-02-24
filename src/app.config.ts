export default defineAppConfig({

  pages: [
    // 'pages/success/index',
    'pages/entrancePage/index',
    'pages/deliveryAddress/index',
    'pages/index/index',
    'pages/orderDetail/index',
    'pages/evaluate/index',
    'pages/search/index',
    'pages/settlement/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  "permission": {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序定位"
    }
  },
  "requiredPrivateInfos": [
    "getLocation"
  ],
  "plugins": {
    "routePlan": {
      "version": "1.0.18",
      "provider": "wx50b5593e81dd937a"
    }
  },
})
