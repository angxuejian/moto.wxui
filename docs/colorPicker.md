# 颜色选择器-ColorPicker

## 引用

[不知道如何引用组件的看这里](../README.md)

## 属性 
属性   | 类型   | 默认值 | 必填| 说明
---    | ---   | ---    | --- | ---
width     | number| 35     | 否  | 宽度; 单位px  
height    | number | 35    | 否  | 高度; 单位px
predefined| string |#409EFF| 否  | 预览颜色; 支持HEX和RGB; 只支持英文字符
default   | boolean | true | 否  | 是否需要默认值
showAlpha | boolean | false| 否  | 是否需要透明度
showPred  | boolean | true | 否  | 是否显示预览view
mask      | boolean | true    | 否 | 点击遮罩层是否关闭


## 事件
事件名称     | 类型         | 默认值 |  必填 | 说明
---         | ---          |---    | ---  |---
bindchange  | eventhandler | 无    | 否   |修改 value时触发, 返回当前颜色代码


## 示例

![示例图片](https://img-blog.csdnimg.cn/20210227161551587.gif#pic_center)
