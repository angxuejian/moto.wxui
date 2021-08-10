# 日期选择器-DatePicker

## 引用
[不知道如何引用组件的看这里](../README.md)

## 属性 
属性   | 类型   | 默认值 | 必填| 说明
---    | ---   | ---    | --- | ---
timestamp| string |当前时间戳| 否  | 13位时间戳
showLunar | boolean | false | 否  | 是否需要加载 阴历、节日、节气等信息
showPred  | boolean | true  | 否  | 是否显示预览view
mask      | boolean | true    | 否 | 点击遮罩层是否关闭



## 事件
事件名称     | 类型         | 默认值 |  必填 | 说明
---         | ---          |---    | ---  |---
bindchange  | eventhandle | 无    | 否   |修改日期时触发, 返回当前日期

## 示例

![示例图片](https://img-blog.csdnimg.cn/20210318224715419.gif#pic_center)