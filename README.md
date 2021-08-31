# moto.wxui
微信小程序的UI库

## 使用
将UI组件引用到项目中
```
// index.json

{
  "usingComponents": {
    "mo-color-picker": "/component/colorPicker/index"
  }
}
```
```
// index.html

<view>
 <mo-color-picker></mo-color-picker>
</view>
```

- **具体属性和方法** 详看docs文件夹下的 .md文件

## 组件

组件 | 文档
--- | ---
抽屉-Drawer      | [ >>> ](docs/drawer.md)
开关选择器-Switch | [ >>> ](docs/switch.md)
选择器-Picker    | [ >>> ](docs/picker.md)
图片模式-imgMode | [ >>> ](docs/imgMode.md)
颜色选择器-ColorPicker | [ >>> ](docs/colorPicker.md)
日期选择器-DatePicker | [ >>> ](docs/datePicker.md)

<!-- 录音-Record      | [ >>> ](docs/Record.md) -->

[全部组件 - 在这里！](LIST.md)

## 示例
> 若图片加载失败，搜索图片名称也可以找到哦！

![Moto UI示例](docs/a.jpg)

## 许可
[MIT License](LICENSE)

moto.wxui Copyright © 2020-2021 angxuejian