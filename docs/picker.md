# 选择器-Picker

## 引用

[不知道如何引用组件的看这里](../README.md)



## 属性 
属性   | 类型   | 默认值 | 必填| 说明
---    | ---   | ---    | --- | ---
mask      | boolean | true    | 否 | 点击遮罩层是否关闭
mode      | string  | selector | 否 | 选择器类型

**mode 的合法值**

值   |  说明
---  | ---
selector  | 单列选择器
multiSelector | 多列选择器
dateTimeSelector | 日期时间选择器
dateSelector | 日期选择器
timeSelector | 时间选择器

<br>

**mode = selector 或者 mode = multiSelector**
属性   | 类型   | 默认值 | 必填| 说明
---    | ---   | ---    | --- | ---
range     | array/object array | []     | 是  | 选择列表
range_key | string | value    | 否  | 当 range 是一个 Object Array 时，通过 range_key 来指定 Object 中 key 的值作为选择器显示内容
index     | string/number/array | 0 | 否 | 表示选择了 range 中的第几个（下标从 0 开始）

<br>

**mode = dateTimeSelector 或者 mode = dateSelector 或者 mode = timeSelector**

属性   | 类型   | 默认值 | 必填| 说明
---    | ---   | ---    | --- | ---
date      | number  |  | 否 | 13位时间戳、默认选中的时间

## 事件
事件名称     | 类型         | 默认值 |  必填 | 说明
---         | ---          |---    | ---  |---
bindchange  | eventhandle  |     | 否   | value改变时触发
bindcancel  | eventhandle  |     | 否   | 取消选择时触发
bindcolumnchange | eventhandle | | 否   | 列改变时触发(**mode = multiSelector**)

## 实例

通过 [selectComponent](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html) 方法获取组件实例

实例名称   | 类型  | 参数  | 必填 | 说明
---       | ---   | ---     | ---  | ---
open      | eventhandle | 无 | 否  |


