# moto.wxui
微信小程序的 UI/工具 示例库

## 使用
将UI组件引用到项目中
```js
// index.json
{
  "usingComponents": {
    "mo-color-picker": "/component/colorPicker/index"
  }
}
```
```html
<!-- index.wxml -->
<view>
 <mo-color-picker id='colorPicker'></mo-color-picker>
</view>
```
```js
//  index.js
this.selectComponent('#colorPicker').open()
```

- **具体属性和方法** 详看docs文件夹下的 .md文件

## 组件

组件 | 文档
--- | ---
抽屉-Drawer      | [ >>> ](docs/drawer.md)
开关选择器-Switch | [ >>> ](docs/switch.md)
选择器-Picker    | [ >>> ](docs/picker.md)
颜色选择器-ColorPicker | [ >>> ](docs/colorPicker.md)
日期选择器-DatePicker | [ >>> ](docs/datePicker.md)
时间选择器-TimePicker | [ >>> ](docs/timePicker.md)
入住时间选择器-CheckInDatePicker | [ >>> ](docs/checkInDatePicker.md)
录音-Recorder | [>>>](docs/recorder.md)
顶部加载-Nprogress | [>>>](docs/nprogress.md)


## 示例
> 若图片加载失败，搜索图片名称也可以找到哦！

![Moto UI示例](docs/a.jpg)

## 许可
[MIT License](LICENSE)

moto.wxui Copyright © 2020-2024 angxuejian