# 入住时间选择器-CheckInDatePicker

## 引用

[不知道如何引用组件的看这里](../README.md)

## 属性 
属性   | 类型   | 默认值 | 必填| 说明
---    | ---   | ---    | --- | ---
multiple  | boolean | true    | 否 | 单选或者多选
value | array/string/number | null | 否 | 默认选中时间, ['2022-8-23', '2022-8-25']开始时间和结束时间，时间只能选择**年月日**，number类型可以为**年月日**的时间戳


## 事件
事件名称     | 类型         | 默认值 |  必填 | 说明
---         | ---          |---    | ---  |---
bindchange  | eventhandler | 无    | 否   |确认日期，返回选择的日期

