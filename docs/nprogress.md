# nprogress

## 使用
### 引用

[不知道如何引用组件的看这里](../README.md)

### 实例

通过 [selectComponent](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html) 方法获取组件实例

 1. [start](#start) 开始加载、但不会加载到100%

 2. [done](docs/DONE.md) 结束加载、加载到100%

 3. [setting](docs/SETTING.md) 配置进度条

#### 1. <span id='start'>start</span>
> this.selectComponent('#nprogress').start() 调用


开始加载进度条，但不会加载到 100%



#### 2. <span id='done'>done</span>
> this.selectComponent('#nprogress').done() 调用


结束加载进度条，加载到 100%

#### 3. <span id='setting'>setting</span>
> this.selectComponent('#nprogress').setting(Object object) 调用


配置进度条信息

#### 参数
##### Object object

属性   | 类型   | 默认值     | 必填| 说明
---            | ---    | ---       | --- | ---
bColor         | string | '#438EDB' | 否  | 进度条的颜色; 支持 '#000'/ 'black'/ 'rgba(0,0,0,0)'/ 'rgb(0,0,0)' 
height         | number | 2       | 否  | 进度条的高度; 单位 px
duration       | number | 300    | 否  | 动画完成时间; 单位 ms
timingFunction | string | 'linear'| 否  | 动画效果
speed          | number | 10      | 否  | 进度条的起始步长


<br>

**timingFunction合法值**

值           | 说明
---          | ---
'linear'     | 动画从头到尾的速度是相同的	
'ease'       | 动画以低速开始，然后加快，在结束前变慢
'ease-in'    | 动画以低速开始
'ease-in-out'| 动画以低速开始和结束
'ease-out'   | 动画以低速结束
'ease-start' | 动画第一帧就跳至结束状态直到结束
'ease-end'   | 动画一直保持开始状态，最后一帧跳到结束状态

### 示例
![示例](https://img-blog.csdnimg.cn/20210227161642344.gif#pic_center)
