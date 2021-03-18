# datePicker

## 使用
### 引用

[不知道如何引用组件的看这里](../README.md)

### 属性 
属性   | 类型   | 默认值 | 必填| 说明
---    | ---   | ---    | --- | ---
timestamp| string |当前时间戳| 否  | 指定时间、13位时间戳
showLunar | Boolean | false | 否  | 是否需要加载 阴历、节日、节气等信息
showPred  | Boolean | true  | 否  | 是否显示预览view



### 事件
事件名称     | 类型         | 默认值 |  必填 | 说明
---         | ---          |---    | ---  |---
bindchange  | eventhandler | 无    | 否   |修改日期时触发, 返回当前日期

### 示例

![示例图片](https://img-blog.csdnimg.cn/20210318224715419.gif#pic_center)