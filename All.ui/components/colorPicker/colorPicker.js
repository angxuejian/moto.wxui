// components/colorPicker/colorPicker.js

import Color from './color'

const svRange = 100 // S、V 取值范围为 0.0 - 1.0(转为百分制)
const deColor = '#438EDB' // 默认颜色

const app = {
      h: 0, // 0 - 360
      s: 0, // 0 - 100
      v: 0  // 0 - 100
} // 全局变量 hsv 的值

Component({
      /**
       * 组件的属性列表
       */
      properties: {
            width: {
                  type : Number,
                  value: 35
            },
            height: {
                  type : Number,
                  value: 35
            },
            predefined: {
                  type : String,
                  value: deColor
            }

      },

      /**
       * 组件的初始数据
       */
      data: {
            default: deColor, // 默认颜色

            isShow : 0,  // 是否打开 colorPicker 组件 0:真关闭 1:打开 2:伪关闭

            ouColor: {
                  hex: '',
                  rgb: ''
            }, // rgb与hex 颜色 | 最后输出的颜色

            bcColor: '',      // 颜色面板 背景颜色
            // seColor: deColor, // 选择颜色

            hValue : 0,  // slider标签 的 value值 取值范围 0-360

            wSpeed : 0,  // 宽度步长
            hSpeed : 0,  // 高度步长

            x      : 0,  // 坐标x
            y      : 0,  // 坐标y 
      },


      /**
       * 组件的方法列表
       */
      methods: {

            // 打开 或 关闭 colorPicker 组件
            showColorPicker: function() {
                  let show = this.data.isShow
                  if (!show) this.data.isShow = 1
                  else if(show === 1) this.data.isShow = 2
                  else if(show === 2) this.data.isShow = 1

                 
                  this.setData({ isShow: this.data.isShow }, () => {
                        if (this.data.isShow === 1) this.init()
                  })
            },

            // 初始化 坐标系
            init: function() {

                  const dom = this.createSelectorQuery()
                  dom.select('.movable').boundingClientRect()
                  dom.select('.circle').boundingClientRect().exec((rect => {

                        const { height, width } = rect[0]
                        const { width:circle }  = rect[1] // .circle 标签为正方形, 只取其中一个值。

                        this.data.wSpeed = (width - circle) / svRange
                        this.data.hSpeed = (height - circle) / svRange

                        this.onPredfinedColor()
                  }))
                       
                        
                  
            },

            // 设置预定颜色
            onPredfinedColor: function() {
                  let c = this.data.predefined
                  c = c.replace(/\s*/g,"")

                  if (/^#[0-9a-fA-F]{6}/g.test(c)) {
                        const h = c.substring(1, 3),
                              e = c.substring(3, 5),
                              x = c.substring(5, 7);

                        this.setRGB_XY(Color.hex_rgb([h, e, x]))

                  } else if (c.match(/^[rR][gG][Bb][\(]([\d+,]*?)[\)]$/ig) !== null){
                        let str = c.split(','),
                              r = str[0].split('(')[1],
                              g = str[1],
                              b = str[2].split(')')[0];
                        
                        this.setRGB_XY([r, g, b].map(this.checkRGB))

                  } else {
                        throw new Error(`The color type is wrong, it should be hex or rgb --- 颜色类型错误， 它应该是 16进制 或 RGB
                        `)
                  }

            },

            // 校验 rgb的合法值
            checkRGB: function(n) {
                  n = parseInt(n)
                  if (n > 255) throw new Error(`The value of rgb is wrong, it should be 0-255 --- rgb的值是错误的，范围0-255`)
                  else return n
            },

            // setData x 和 y 的坐标
            setRGB_XY: function([r, g, b]) {
                  
                  const {h, s, v} = Color.rgb_hsv(r, g, b)

                  app.h = h

                  this.setData({
                        hValue : app.h,
                        bcColor: Color.hsv_rgb(app.h, svRange, svRange).hex,
                        x      : Math.round(s * this.data.wSpeed),
                        y      : Math.round((svRange - v) * this.data.hSpeed)
                  })
            },


            // 获取 移动 S、V 的坐标
            onTouchMoveSV: function({ detail }) {
                  const { x, y } = detail

                  // 将 x, y 坐标 转为 s, v 坐标
                  app.s = Math.round(x / this.data.wSpeed)
                  app.v = svRange - Math.round(y / this.data.hSpeed)

                  this.setData({
                        ouColor: Color.hsv_rgb(app.h, app.s, app.v)
                  })
                  
            },

            // 获取 移动 H 的坐标
            onTouchMoveH: function({ detail }) {
                  const { value } = detail
                  app.h = value

                  this.setData({
                        bcColor: Color.hsv_rgb(app.h, svRange, svRange).hex,
                        ouColor: Color.hsv_rgb(app.h, app.s, app.v)
                  })
            },

            // 复制 hex 的值
            onCopyHex: function() {
                  wx.setClipboardData({
                        data: this.data.ouColor.hex || this.data.default
                  })
            },

            // 确认颜色，传出回调
            onConfirm: function() {
                  /*
                        bindchange: 当颜色值改变时触发
                  */
                  this.setData({ predefined: this.data.ouColor.hex })
                  this.triggerEvent('change', this.data.ouColor)
                  this.showColorPicker()
            }
      }
})
