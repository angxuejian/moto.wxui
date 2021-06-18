// components/imgMode/imgMode.js

const DEFAULT_IMG = 'https://profile.csdnimg.cn/E/5/2/1_qq_43297527'

Component({
  /**
   * 组件的属性列表
   */
  options: {
    virtualHost: true // 将这个自定义组件设置为“虚拟的”
  },
  externalClasses: ['img-class'],

  properties: {
    src: {
      type: String,
      value: DEFAULT_IMG
    },
    mode: {
      type: String,
      value: 'scaleToFill'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    style: '', // image样式
    styleW: 0, // image 宽
    styleH: 0, // image 高

    imgW: 0, // canvas 的宽
    imgH: 0, // canvas 的高

    isDestroyImg: false, // 是否销毁 带onload的image标签
    isDestroyCan: false, // 是否销毁 canvas 组件
  },

  lifetimes: {
    attached: function() {
      this.init()
     
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init: async function() {
      if (!this.data.mode) return

      const { width, height } = await this.getImgMode()

      this.data.styleW = width
      this.data.styleH = height
    },

    // 获取图片样式宽高
    getImgMode: function() {
      return new Promise(resolve => {
        const query = this.createSelectorQuery()
        query.select('#img-mode').boundingClientRect()
        query.exec(res => {
          resolve(res[0])
        })
      })
    },

    
    // 获取图片本身宽高
    onCallbackLoad: function(event) {
      const { mode } = this.data
      const d = event.detail

      if (mode === 'scaleToFill') return
      
      else if (mode === 'aspectFit' ) this.getAspectFit (d)
      else if (mode === 'aspectFill') this.getAspectFill(d) 
      else if (mode === 'widthFix'  ) this.getWidthFix  (d)
      else if (mode === 'heightFix' ) this.getheightFix (d)

      else if (mode === 'top'   ) this.getTop(d)
      else if (mode === 'bottom') this.getBottom(d)
      else if (mode === 'center') this.getCenter(d)
      else if (mode === 'left'  ) this.getLeft(d)
      else if (mode === 'right' ) this.getRight(d)
      else if (mode === 'top left' )    this.getTopLeft(d)
      else if (mode === 'top right' )   this.getTopRight(d)
      else if (mode === 'bottom left')  this.getBottomLeft(d)
      else if (mode === 'bottom right') this.getBottomRight(d)
      this.setData({
        isDestroyImg: true
      })
    },


    // aspectFit
    getAspectFit: function({ width, height }) {

      const { styleH, styleW, src } = this.data

      this.setData({ imgH: styleH, imgW: styleW })

      let [x, y, w, h] = []
      const scale = width / height // 宽高比例

      if (width < height) {
        h = styleH
        w = h * scale
      } else {
        w = styleW
        h = w / scale
      }
      x = (styleW - w) / 2
      y = (styleH - h) / 2

      this.drawCanvas({ src, x, y, w, h })
    },

    // aspectFill
    getAspectFill: function({ width, height }) {
      const { styleH, styleW, src } = this.data

      this.setData({ imgH: styleH, imgW: styleW })

      let [x, y, w, h] = []
      const scale = width / height // 宽高比例
      
      if (width < height) {
        w = styleW 
        h = styleW / scale
        x = 0
        y = (styleH - h) / 2
        
      } else {
        w = styleH * scale
        h = styleH
        x = (styleW - w) / 2
        y = 0
       
      }

      this.drawCanvas({ src, x, y, w, h })
    },
    
    // widthFix
    getWidthFix: function({ width, height }) {
      let scale = this.data.styleW / width
      let h = height * scale

      this.data.style = `height: ${h}px`
      this.setData({ style: this.data.style })
    },

    // heightFix
    getheightFix: function({ width, height }) {
      let scale = this.data.styleH / height
      let w = width * scale

      this.data.style = `width: ${w}px`
      this.setData({ style: this.data.style })
    },

    // top
    getTop: function({ width, height }) {

      const { styleH, styleW, src } = this.data

      this.setData({ imgH: styleH, imgW: styleW })

      let [sx, sy, sw, sh] = []

      sw = styleW
      sh = styleH
      sx = (width - sw) / 2
      sy = 0

      this.drawCanvas({ src, sx, sy, sw, sh }, true)
    },

    // bottom
    getBottom: function({ width, height }) {

      const { styleH, styleW, src } = this.data

      this.setData({ imgH: styleH, imgW: styleW })

      let [sx, sy, sw, sh] = []

      sw = styleW
      sh = styleH
      sx = (width - sw) / 2
      sy = height - sh

      this.drawCanvas({ src, sx, sy, sw, sh }, true)
    },

    // center
    getCenter: function({ width, height }) {

      const { styleH, styleW, src } = this.data

      this.setData({ imgH: styleH, imgW: styleW })

      let [sx, sy, sw, sh] = []

      sw = styleW
      sh = styleH
      sx = (width - sw) / 2
      sy = (height - sh) / 2

      this.drawCanvas({ src, sx, sy, sw, sh }, true)
    },

    // left
    getLeft: function({ width, height }) {
      const { styleH, styleW, src } = this.data

      this.setData({ imgH: styleH, imgW: styleW })

      let [sx, sy, sw, sh] = []

      sw = styleW
      sh = styleH
      sx = 0
      sy = (height - sh) / 2

      this.drawCanvas({ src, sx, sy, sw, sh }, true)
    },

    // right
    getRight: function({ width, height }) {
      const { styleH, styleW, src } = this.data

      this.setData({ imgH: styleH, imgW: styleW })

      let [sx, sy, sw, sh] = []

      sw = styleW
      sh = styleH
      sx = (width - sw)
      sy = (height - sh) / 2

      this.drawCanvas({ src, sx, sy, sw, sh }, true)
    },

    // top left 
    getTopLeft: function({ width, height }) {
      const { styleH, styleW, src } = this.data

      this.setData({ imgH: styleH, imgW: styleW })

      let [sx, sy, sw, sh] = []

      sw = styleW
      sh = styleH
      sx = 0
      sy = 0

      this.drawCanvas({ src, sx, sy, sw, sh }, true)
    },

    // top right
    getTopRight: function({ width, height }) {
      const { styleH, styleW, src } = this.data

      this.setData({ imgH: styleH, imgW: styleW })

      let [sx, sy, sw, sh] = []

      sw = styleW
      sh = styleH
      sx = width - styleW
      sy = 0

      this.drawCanvas({ src, sx, sy, sw, sh }, true)
    },

    // bottom left 
    getBottomLeft: function({ width, height }) {
      const { styleH, styleW, src } = this.data

      this.setData({ imgH: styleH, imgW: styleW })

      let [sx, sy, sw, sh] = []

      sw = styleW
      sh = styleH
      sx = 0
      sy = height - styleH

      this.drawCanvas({ src, sx, sy, sw, sh }, true)
    },

    // bottom right
    getBottomRight: function({ width, height }) {
      const { styleH, styleW, src } = this.data

      this.setData({ imgH: styleH, imgW: styleW })

      let [sx, sy, sw, sh] = []

      sw = styleW
      sh = styleH
      sx = width - styleW
      sy = height - styleH

      this.drawCanvas({ src, sx, sy, sw, sh }, true)
    },

   
    // 导出图片
    drawCanvas: function(data, isCrop) {
      const ctx = wx.createCanvasContext('canvas', this)
      const { styleW:width, styleH: height } = this.data
      const { src, sx, sy, sw, sh, x = 0, y = 0, w = width, h = height } = data

      wx.getImageInfo({
        src,
        success: res => {
          if (isCrop) ctx.drawImage(src, sx, sy, sw, sh, x, y, w, h)
          else ctx.drawImage(src, x, y, w, h)

          ctx.draw(false, () => {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width,
              height,
              canvasId: 'canvas',
              success: res => {
                this.setData({
                  src: res.tempFilePath,
                  isDestroyCan: true
                })
              },
              fail: err => {
                console.log(err, 'canvas 导出失败')
              }
            }, this)
          })
        },
        fail: err => {
          console.log(err, '')
        }
      })
    },
  }
})
