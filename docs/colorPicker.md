# colorPicker

## 使用
### 引用

[不知道如何引用组件的看这里](../README.md)

### 属性 
属性   | 类型   | 默认值 | 必填| 说明
---    | ---   | ---    | --- | ---
width     | number| 35     | 否  | 宽度; 单位px  
height    | number | 35    | 否  | 高度; 单位px
predefined| string |#409EFF| 否  | 预览颜色; 支持HEX和RGB; 只支持英文字符
default   | Boolean | true | 否  | 是否需要默认值
showAlpha | Boolean | false| 否  | 是否需要透明度
showPred  | Boolean | true | 否  | 是否显示预览view


### 事件
事件名称     | 类型         | 默认值 |  必填 | 说明
---         | ---          |---    | ---  |---
bindchange  | eventhandler | 无    | 否   |当修改绑定值时触发, 返回当前颜色代码


### 示例

![示例图片](https://img-blog.csdnimg.cn/20210227161551587.gif#pic_center)


## 如何实现

- [如何实现 拾色器](https://github.com/angxuejian/how-to-achieve/blob/main/docs/HTA-2-201210.md)

## 提示
- hsv 与 rgb 互转个别颜色会出现小**误差情况**。并非每次都相等
- hsv 与 rgb 互转时 会出现 **0 / 0 = NaN 情况**。