# nprogress

因小程序特性，不推荐使用该组件

## 引用
[不知道如何引用组件的看这里](../README.md)


## 实例

通过 [selectComponent](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html) 方法获取组件实例

实例名称   | 类型  | 参数  | 必填 | 说明
---       | ---   | ---     | ---  | ---
start     | eventhandle | 无 | 否  | 开始加载、但不会加载到100%
done      | eventhandle | 无 | 否  | 结束加载、加载到100%
setting   | eventhandle | {} | 否  | 配置进度条信息

**setting(Object object) 参数**

属性   | 类型   | 默认值 | 必填| 说明
---    | ---   | ---    | --- | ---
bColor         | string | '#438EDB' | 否  | 进度条的颜色; 支持 '#000'/ 'black'/ 'rgba(0,0,0,0)'/ 'rgb(0,0,0)' 
height         | number | 2       | 否  | 进度条的高度; 单位 px
duration       | number | 300    | 否  | 动画完成时间; 单位 ms
timingFunction | string | 'linear'| 否  | 动画效果
speed          | number | 10      | 否  | 进度条的起始步长

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


## 示例
![示例](https://img-blog.csdnimg.cn/20210227161642344.gif#pic_center)

