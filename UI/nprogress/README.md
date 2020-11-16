# nprogress


### 目标
在小程序上使用 nprogress 进度条

### 使用

#### 1. 获取源码，请使用 版本号 1.02.1812180 以上的 IDE 打开代码片段

    代码片段：https://developers.weixin.qq.com/s/6V0uPGmQ7Xlx
    
    github: https://github.com/angxuejian/moto.wxui/tree/main/UI/nprogress


#### 2. 获取 components 文件下的 nprogress 文件夹 并放在自己项目中; 然后将 nprogress 组件 注册为全局组件或单独组件; 
```
// app.json 或 index.json

"usingComponents": {
    "nprogress": "components/nprogress/nprogress" // 你的实际路径
},
```
    
#### 3. index.wxml页面中使用
```
// index.wxml

<view>
    <nprogress id='nprogress' ></nprogress>
</view>
```

#### 4. index.js方法中使用; 通过 selectComponent 方法获取组件实例

```
// index.js

onShow: function() {
    this.getLoadData() // 请求接口数据
}

getLoadData: function() {
    this.selectComponent('#nprogress').start()  // 开始加载进度, 但不会加载到 100%

    wx.request({
        url: 'https:www.baidu.com',
        method: 'POST',
        data: {},
        success: res => {
            this.selectComponent('#nprogress').done()   // 完成加载, 加载到 100%

            // something...
        }
    })
}
```

#### 5. 全部nprogress组件实例方法

   - **start()** 开始加载
   
     ```
     this.selectComponent('#nprogress').start()
     ```
    
   - **done()** 完成加载
   
     ```
     this.selectComponent('#nprogress').done()
     ```

   - **setting(Object object)** 更改配置
   
        ```
        this.selectComponent('#nprogress').setting({
            bColor: '#4EC520',
            ...
        })
        ```
        
        **参数**

        **Object object**

        属性   | 类型   | 默认值     | 必填| 说明
        ---            | ---    | ---       | --- | ---
        bColor         | string | '#4EC520' | 否  | 进度条的颜色; 支持 '#000'/ 'black'/ 'rgba(0,0,0,0)'/ 'rgb(0,0,0)' 
        height         | number | 2       | 否  | 进度条的高度; 单位 px
        duration       | number | 2000    | 否  | 动画完成时间; 单位 ms
        timingFunction | string | 'linear'| 否  | 动画效果
        speed          | number | 10      | 否  | 进度条的起始步长
        mask           | boolran| true    | 否  | 是否需要遮罩层; 透明遮罩


        **timingFunction**的合法值均为[微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/api/ui/animation/wx.createAnimation.html)中的 timingFunction合法值

### 缺点

   **因小程序的特性。如要使用，必须在每个页面中都要引入 nprogress 组件**

   **调用时可封装一个全局调用, 详看代码片段中的 utils文件中 request.js**

### 上图
![示例](https://mmbiz.qpic.cn/mmbiz_gif/xoIzuYKVBOxTNibeibGPImU4OeVK2jeSRwsEbsTnOicLCTV20qsKJj6c3gicmhJ7tQV6fVt39CJpojxIlGdFKSm8QQ/0?wx_fmt=gif)

### 最后
第一次写, 各位看官下手轻点, 欢迎大家点评及提出问题😋😋
