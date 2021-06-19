# moto.wxui
微信小程序的UI库

## 组件

组件 | 文档
--- | ---
图片模式-imgMode | [ >>> ](docs/imgMode.md)
顶部加载-Nprogress | [ >>> ](docs/nprogress.md)
颜色选择器-ColorPicker | [ >>> ](docs/colorPicker.md)
日期选择器-DatePicker | [ >>> ](docs/datePicker.md)

[全部组件 - 在这里！](LIST.md)

## 使用
将UI组件引用到项目中
```
// index.json

{
  "usingComponents": {
    "color-picker": "xxx/colorPicker/colorPicker"
  }
}

// index.html

<view>
 <color-picker></color-picker>
</view>

```

- **具体属性和方法** 详看docs文件夹下的 .md文件

## 许可
[MIT License](LICENSE)

moto.wxui Copyright © 2020-2021 angxuejian