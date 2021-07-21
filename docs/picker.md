# picker

## 引用

[不知道如何引用组件的看这里](../README.md)

使用组件时，需要注意插槽问题

【插槽使用示例】
```
// index.json
{
  "usingComponents": {
    "mo-picker":"/components/picker/picker"
  },
  "navigationBarTitleText": "选择器-Picker"
}

```
```
// index.html
<mo-picker range='{{list}}'>

  <view slot='picker-slot'>点击打开选择器</view> 
</mo-picker>
```

## 插槽
插槽名称 | 必填 |说明
---      | --- | ---
picker-slot   | 否   | 如未使用插槽，可以通过使用 实例方法打开picker组件

## 属性 
属性   | 类型   | 默认值 | 必填| 说明
---    | ---   | ---    | --- | ---
range     | array/object array | []     | 是  | 选择列表
range_key | string | value    | 否  | 当 range 是一个 Object Array 时，通过 range_key 来指定 Object 中 key 的值作为选择器显示内容
mask      | boolean | true    | 否 | 点击遮罩层是否关闭
mode      | string  | selector | 否 | 选择器类型

**mode 的合法值**

值   |  说明
---  | ---
selector  | 单列选择器
multiSelector | 多列选择器

## 事件
事件名称     | 类型         | 默认值 |  必填 | 说明
---         | ---          |---    | ---  |---
bindchange  | eventhandle  |     | 否   | value改变时触发
bindcancel  | eventhandle  |     | 否   | 取消选择时触发
bindcolumnchange | eventhandle | | 否   | 列改变时触发(mode为multiSelector)

## 实例

通过 [selectComponent](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html) 方法获取组件实例

实例名称   | 类型  | 参数  | 必填 | 说明
---       | ---   | ---     | ---  | ---
open      | eventhandle | 无 | 否  |


