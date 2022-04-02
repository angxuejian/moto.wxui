// components/colorPicker/colorPicker.js

import Color from '../../utils/color'
const colo = new Color()

const svRange = 100 // S、V 取值范围为 0.0 - 1.0(转为百分制)
const deColor = '#438EDB' // 默认颜色
const deNone  = '#ffffff' // 当 default 为 false 时 显示

const app = {
  h: 0, // 0 - 360
  s: 0, // 0 - 100
  v: 0, // 0 - 100
  a: 1  // 0 - 1
} // 全局变量 hsv 的值

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: {
      type: Number,
      value: 35
    },
    height: {
      type: Number,
      value: 35
    },
    predefined: {
      type: String,
      value: deColor
    },
    default: {
      type: Boolean,
      value: true
    },
    showAlpha: {
      type: Boolean,
      value: false
    },
    showPred: {
      type: Boolean,
      value: true
    },
    mask: {
      type:Boolean,
      value: true
    }

  },


  /**
   * 组件的初始数据
   */
  data: {
    isClear: false, // 是否点击了清空。清空后 外部显示 deNone, 内部显示 deColor
    isShow: 0, // 是否打开 colorPicker 组件 0:真关闭 1:打开 2:伪关闭

    ouColor: {
      hex: '',
      rgb: '',
      rgba: ''
    }, // rgb, rgba与hex 颜色 | 最后输出的颜色
    bcColor: '', // 颜色面板 背景颜色
    noColor: deNone, // !default || isClear = dom显示 deNone 颜色
    prColor: deColor, //  弹出view 遮罩层颜色 + 复制颜色
    
    alphaC: '', // slider标签的背景颜色

    hValue: 0, // slider标签 的 value值 取值范围 0-360
    aValue: 100, // slider标签的 value值 取值范围 0 -100

    wSpeed: 0, // 宽度步长
    hSpeed: 0, // 高度步长

    x: 0, // 坐标x
    y: 0, // 坐标y 
  },

  attached: function () {
    if (!this.data.default) {
      this.data.predefined = this.data.noColor
      this.setData({
        predefined: this.data.predefined
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 对外实例方法 - 调用实例打开组件
    open: function() {
      this.showColorPicker()
    },

    /**
     * -------------------------------
     * -------------------------------
     * -------------------------------
     * -------------------------------
     * 分割线 - 分割线
     * 
     * 下面是 私有方法！ 不要随意调用哦！！！
     */

    // 打开 或 关闭 colorPicker 组件
    showColorPicker: function () {
      let show = this.data.isShow
      if (!show) this.data.isShow = 1
      else if (show === 1) this.data.isShow = 2
      else if (show === 2) this.data.isShow = 1

      this.setData({
        isShow: this.data.isShow
      }, () => {
        if (this.data.isShow === 1) this.init()
      })
    },

    // 是否开启遮罩层关闭
    maskShowColorPicker: function() {
      if (!this.data.mask) return

      this.showColorPicker()
    },

    onCallbackEnd: function() {
      if (this.data.isShow === 2) {
        this.data.isShow = 0
        this.setData({
          isShow: this.data.isShow
        })
      }
    },

    // 初始化 坐标系
    init: function () {

      const dom = this.createSelectorQuery()
      dom.select('.movable').boundingClientRect()
      dom.select('.circle').boundingClientRect().exec((rect => {

        const { height, width } = rect[0]
        const { width: circle } = rect[1] // .circle 标签为正方形, 只取其中一个值。

        this.data.wSpeed = (width - circle) / svRange
        this.data.hSpeed = (height - circle) / svRange

        this.onPredfinedColor()
      }))
    },

    // 设置预定颜色
    onPredfinedColor: function () {
      let { predefined, noColor } = this.data

      // 设置无默认值 + 没有改变颜色 = deColor 颜色
      if ((!this.data.default && predefined === noColor) || !predefined) {
        predefined = deColor
      }

      let c = predefined
      c = c.replace(/\s*/g, "")

      if (/^#[0-9a-fA-F]{6}/g.test(c)) {
        const h = c.substring(1, 3),
              e = c.substring(3, 5),
              x = c.substring(5, 7);

        this.setRGB_XY(colo.hex_to_rgb([h, e, x]))

      } else if (c.match(/^[rR][gG][Bb][\(]([\d+,]*?)[\)]$/ig) !== null) {

        this.setRGB_XY(this.clearRgb(c).map(this.checkRGB))

      } else if (c.match(/^[rR][gG][Bb][aA][\(]([1-9]\d*\.?\d*)|(0\.\d*[1-9]*?)[\)]$/ig) !== null) {

        let arr = this.clearRgba(c)
        app.a = this.checkRGBA(arr.pop())
        arr.map(this.checkRGB)

        this.setRGB_XY(arr)
       
      } else {
        throw new Error(`The color type is wrong, it should be hex or rgb --- 颜色类型错误， 它应该是 16进制 或 RGB `)
      }
    },

    
    // setData x 和 y 的坐标
    setRGB_XY: function ([r, g, b], a = app.a) {
      const { h, s, v } = colo.rgb_to_hsv(r, g, b)

      app.h = h

      this.data.ouColor.hex = colo.rgb_to_hex([r, g, b])
      
      this.setAlpha(r, g, b, a)

      this.setData({
        hValue: app.h,
        aValue: this.data.aValue,
        bcColor: colo.hsv_to_rgb(app.h, svRange, svRange).rgb,
        prColor: this.data.prColor,
        alphaC: this.data.alphaC,
        x: Math.round(s * this.data.wSpeed),
        y: Math.round((svRange - v) * this.data.hSpeed)
      })
    },


    // 设置透明度颜色
    setAlpha: function(r, g, b, a) {
      if (this.data.showAlpha) {
        let str = `rgba(${r}, ${g}, ${b}`
        this.data.prColor = `${str}, ${a})`
        this.data.alphaC = `${str}, 0), ${str}, 1)`
      } else {
        this.data.prColor = this.data.ouColor.hex
        this.data.alphaC = ''
      }

      if (a == 1) this.data.aValue = 100
      else this.data.aValue = a * 100
    },


    // 获取 移动 S、V 的坐标
    onTouchMoveSV: function ({ detail }) {

      const { x, y, source } = detail

      // 将 x, y 坐标 转为 s, v 坐标
      app.s = Math.round(x / this.data.wSpeed)
      app.v = svRange - Math.round(y / this.data.hSpeed)

      const { rgb, hex, rgba } = colo.hsv_to_rgb(app.h, app.s, app.v, app.a)
      this.data.ouColor = { rgb, hex, rgba }

      const [r, g, b] = this.clearRgb(rgb)
      this.setAlpha(r, g, b, app.a)

      // 非 setData 触发 就更新 prColor颜色
      if (source) {
        this.setData({
          prColor: this.data.prColor,
          alphaC: this.data.alphaC
        })
      }
    },


    // 获取 移动 H 的坐标
    onTouchMoveH: function ({ detail }) {
      const { value } = detail
      app.h = value

      const { rgb, hex, rgba } = colo.hsv_to_rgb(app.h, app.s, app.v, app.a)

      this.data.ouColor = { rgb, hex, rgba }

      const [r, g, b] = this.clearRgb(rgb)
      this.setAlpha(r, g, b, app.a)

      this.setData({
        bcColor: colo.hsv_to_rgb(app.h, svRange, svRange).rgb,
        prColor: this.data.prColor,
        alphaC: this.data.alphaC
      })
    },


    // 获取 移动 A 的坐标 | 透明度
    onTouchMoveA: function({ detail }) {
      app.a = Number((detail.value * 0.01).toFixed(1))
      
      const rgb = this.clearRgb(this.data.ouColor.rgb)
      this.data.ouColor.rgba = `rgba(${rgb.join()}, ${app.a})`
  
      this.setData({
        prColor: this.data.ouColor.rgba
      })
    },
    

    // 复制 hex 的值
    onCopyHex: function () {
      const { prColor } = this.data
      wx.setClipboardData({
        data: prColor
      })
    },


    // 清空颜色，传出回调
    onClear: function () {
      let { ouColor, isClear, predefined, prColor, alphaC } = this.data

      ouColor = { hex: '', rgb: '', rgba: '' }
      prColor = ''
      alphaC  = ''
      isClear = true
      app.a = 1
      predefined = deColor
      this.setData({ predefined, isClear, prColor, alphaC })
      this.triggerEvent('change', ouColor)
      this.showColorPicker()
    },


    // 确认颜色，传出回调
    onConfirm: function () {
      /*
        bindchange: 当颜色值改变时触发
      */
      let { ouColor, isClear, predefined, prColor } = this.data

      isClear = false
      predefined = prColor
      this.setData({ predefined, isClear })
      this.triggerEvent('change', ouColor)
      this.showColorPicker()
    },

    // 校验 rgb的合法值
    checkRGB: function (n) {
      n = Number(n)
      if (n <= 255 && n >= 0) {
        return n
      } else {
        throw new Error(`The value of rgb is wrong, it should be 0-255 --- rgb的值是错误的，范围0-255`)
      }
    },

    //校验rgba的合法值
    checkRGBA: function(n) {
      n = Number(n)
      if (n <= 1 && n >= 0) {
        return n
      } else {
        throw new Error(`The value of rgba is wrong, it should be 0-1 --- rgba的值是错误的，范围0-1`)
      }
    },

    /**
     * 清洗 rgb
     * @param {string} c rgb(255, 255, 255) 
     */
    clearRgb: function(c) {
      if (c.split(',').length !== 3) {
        throw new Error(`Please enter the correct RGB color --- 请输入正确的 rgb 颜色`)
      }
      let str = c.split(','),
                r = str[0].split('(')[1],
                g = str[1],
                b = str[2].split(')')[0];
      return [r, g, b]
    },

    /**
     * 清洗 rgba
     * @param {string} c rgb(255, 255, 255, 1) 
     */
    clearRgba: function(c) {
      if (c.split(',').length !== 4) {
        throw new Error(`Please enter the correct RGBA color --- 请输入正确的 rgba 颜色`)
      }
      let str = c.split(','),
                r = str[0].split('(')[1],
                g = str[1],
                b = str[2],
                a = str[3].split(')')[0]
      return [r, g, b, a]
    }
  }
})