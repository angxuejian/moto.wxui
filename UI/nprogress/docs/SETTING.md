# setting(Object object)
> this.selectComponent('#nprogress').setting(Object object) 调用

> #nprogress为组件id

配置进度条信息

## 参数
### Object object

属性   | 类型   | 默认值     | 必填| 说明
---            | ---    | ---       | --- | ---
bColor         | string | '#4EC520' | 否  | 进度条的颜色; 支持 '#000'/ 'black'/ 'rgba(0,0,0,0)'/ 'rgb(0,0,0)' 
height         | number | 2       | 否  | 进度条的高度; 单位 px
duration       | number | 2000    | 否  | 动画完成时间; 单位 ms
timingFunction | string | 'linear'| 否  | 动画效果
speed          | number | 10      | 否  | 进度条的起始步长
mask           | boolran| true    | 否  | 是否需要遮罩层; 透明遮罩

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