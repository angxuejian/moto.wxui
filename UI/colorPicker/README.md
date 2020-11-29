# colorPicker


### 目标
看到这个[很酷的网站](https://color.hailpixel.com/)  所以也想看看怎么弄？

先来挑战入门版..

### 颜色坐标系

1. 首先要解决一个 误解

    ![element的颜色选择器](https://mmbiz.qpic.cn/mmbiz_gif/xoIzuYKVBOzLjK4NCiaq9bZVib4ibuxSjro4CrWvB0MVCVaOVnKC5dsFqb3l0tJ0EmEHXcDvbLFLJ3ycIViavKnJ7w/0?wx_fmt=gif)

    我们所看到的颜色面板, 其实就是一个固定的样式, 而我们获取的颜色其实是从 坐标模型中 计算出来的。

2. 坐标模型有很多, 在此使用的是 [HSV颜色模型](https://baike.baidu.com/item/HSV%E9%A2%9C%E8%89%B2%E6%A8%A1%E5%9E%8B/21501482)

    Q: 为什么使用 HSV ?

    A: HSV色系对用户来说是一种直观的颜色模型, 主要由 **色调(Hue, 简H)、饱和度(Saturation, 简S)、色明度(Value, 简V)**

3. 将 HSV六角锥体模型 转为 直观的数学坐标系

    ![HSV六角锥体模型](https://mmbiz.qpic.cn/mmbiz_png/xoIzuYKVBOzLjK4NCiaq9bZVib4ibuxSjroFicxf879puBBZPLkLU8whuM1LD4hZ87dVuhtiblIDGvrg5Eia17VPxciag/0?wx_fmt=png)

    **需要注意, document中元素节点 坐标原点是右上角, 而数学坐标原点为右下角**

    **数学坐标系: y、x、h**

    **HSV坐标系: v、s、h**

4. 确认坐标系的范围
    
    **色调H: 取值范围为0°～360°**

    **饱和度S：取值范围为0.0～1.0**

    **亮度V：取值范围为0.0(黑色)～1.0(白色)**
    
    **通过document节点上元素的宽高, 计算步长, 达到取值范围为 0～100(转为百分制)**

### 颜色转换

通过 触摸 坐标系 获取 y(v)、x(s)、h 的值, 然后利用算法公式转换成 rgb 颜色

- [hsv转rgb公式](https://www.rapidtables.com/convert/color/hsv-to-rgb.html)

- [rgb转hsv公式](https://www.rapidtables.com/convert/color/rgb-to-hsv.html)

- 还有 rgb转hex、 rgb转hsl; 都在[这里](https://www.rapidtables.com/convert/color/)


### 实例用法
详细注释在 代码中...

    代码片段: https://developers.weixin.qq.com/s/rRHvfdmx79mR

    github: https://github.com/angxuejian/moto.wxui/tree/main/UI/colorPicker


#### 1. 将 colorPicker 组件 引入到项目中。

```
// index.json

{
  "usingComponents": {
    "color-picker": "../../components/colorPicker/colorPicker"
  }
}

// index.html

<view>

 <color-picker></color-picker>

</view>

```

#### 2. Attributes
属性   | 类型   | 默认值 | 必填| 说明
---    | ---   | ---    | --- | ---
width     | number| 35     | 否  | 宽度; 单位px  
height    | number | 35    | 否  | 高度; 单位px
predefined| string |#409EFF| 否  | 预览颜色; 支持HEX和RGB; 只支持英文字符

#### 3. Events
事件名称 | 回调参数 | 说明
---     | ---     | ---
change  | 当前颜色 |当修改绑定值时触发 


#### 4. 示例

![示例图片](https://mmbiz.qpic.cn/mmbiz_gif/xoIzuYKVBOzLjK4NCiaq9bZVib4ibuxSjrokQrJSKNn75Cib2Bwicw4H0hia8dMdltP4sp6UHVtncStrIW7a6BhSicvLg/0?wx_fmt=gif)


### 参考文献
[MakerGYT](https://github.com/MakerGYT/mini-color-picker) 看了MakerGYT写的mini-color-picker源码, 非常强🤙🤙🤙

[颜色公式转换](https://www.rapidtables.com/convert/color/)

[在线测试工具,校验计算是否正确](https://c.runoob.com/front-end/868)

[hsv百度百科](https://baike.baidu.com/item/HSV/547122)

[Element的color-picker](https://element.eleme.cn/#/zh-CN/component/color-picker)

