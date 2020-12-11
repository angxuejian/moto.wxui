# nprogress

## 使用
### 引用组件

[不知道如何引用组件的看这里](/README.md)

### 组件实例方法

通过 [selectComponent](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html) 方法获取组件实例

- [start](docs/START.md) 开始加载、但不会加载到100%

- [done](docs/DONE.md) 结束加载、加载到100%

- [setting](docs/SETTING.md) 配置进度条


## 示例

因小程序的特性。如要使用，必须在每个页面中都要引入 nprogress 组件

### 引入组件
```
// index.json

{
  "usingComponents": {
    "nprogress": "xxx/nprogress/nprogress"
  }
}

// index.html

<view>

 <nprogress id='nprogress'></nprogress>

</view>
```

### 使用实例方法
```
// index.js

onShow: function() {
    this._loadData() // 请求接口数据
}

_loadData: function() {
    this.selectComponent('#nprogress').start()  // 开始加载进度, 但不会加载到 100%

    wx.request({
        url: 'https://www.baidu.com/',
        method: 'POST',
        data: {},
        success: res => {
            this.selectComponent('#nprogress').done()   // 完成加载, 加载到 100%

            // something...
        }
    })
}
```

### 示例图
![示例](https://mmbiz.qpic.cn/mmbiz_gif/xoIzuYKVBOxTNibeibGPImU4OeVK2jeSRwsEbsTnOicLCTV20qsKJj6c3gicmhJ7tQV6fVt39CJpojxIlGdFKSm8QQ/0?wx_fmt=gif)

