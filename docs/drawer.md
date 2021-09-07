# 抽屉-Drawer

## 引用
[不知道如何引用组件的看这里](../README.md)


属性   | 类型   | 默认值 | 必填| 说明
---    | ---   | ---    | --- | ---
position  | string  | bottom  | 否 | 弹窗位置
width   | string | 100% | 否    | 弹窗宽度 同 css 的 width
height   | string | 200px | 否    | 弹窗高度 同 css 的 height
mask      | boolean | true    | 否 | 点击遮罩层是否关闭
touch     | boolean | false   | 否 | 是否开启滑动关闭弹窗

**position 的合法值**

值   |  说明
---  | ---
top  | 顶部
bottom | 底部
left | 左边
right | 右边
center | 中间

**touch**

开启滑动关闭弹窗后、子组件使用**movable-area**标签会与 drawer组件中的touch事件发送冲突、请考虑后使用

<br>
<br>

## 事件
事件名称     | 类型         | 默认值 |  必填 | 说明
---         | ---          |---    | ---  |---
bindopen  | eventhandle  |     | 否   | 打开弹窗时触发
bindclose  | eventhandle  |     | 否   | 关闭弹窗时触发


## 实例

通过 [selectComponent](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html) 方法获取组件实例

实例名称   | 类型  | 参数  | 必填 | 说明
---       | ---   | ---     | ---  | ---
open      | eventhandle | 无 | 否  | 打开弹窗
close     | eventhandle | 无 | 否  | 关闭弹窗

## 示例

请直接在组件内使用插槽即可

默认组件无背景颜色，请设置插槽的样式(背景色)。**如不设置插槽样式(背景色)，肉眼将看不到弹窗**

<br>
<br>

【插槽使用示例】
```
// index.json

{
  "usingComponents": {
    "mo-drawer":"/components/drawer/index"
  }
}
```
```
// index.html

<mo-drawer position="bottom">
  <view class='slot-view'>
    这里是弹窗内容
  </view> 
</mo-drawer>
```

```
// index.wxss

.slot-view {
  width: 100%;
  height: 100%;
  background-color: red;
  border-radius: 5px;
}
```


