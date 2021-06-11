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
    style: '',
    styleW: 0,
    styleH: 0,
    imgW: 0,
    imgH: 0
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
      // const { windowWidth, windowHeight }  = await wx.getSystemInfo()
      const { width, height } = await this.getImgMode()

      // const d = { windowWidth, windowHeight, width, height }

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
      if (mode === 'scaleToFill') return
      else if (mode === 'widthFix') this.getWidthFix(event.detail)
      else if (mode === 'heightFix') this.getheightFix(event.detail)
      else if (mode === 'top') this.getTop(event.detail)
    },

    // top
    getTop: function({ width, height }) {

      const x = 0
      const y = 0
      const w = width
      const h = height
      const dx = (width - this.data.styleW) / 2
      const dy = 0
      const dw = this.data.styleW
      const dh = this.data.styleH
      this.setData({
        imgH: height,
        imgW: width
      })
      const ctx = wx.createCanvasContext('canvas', this)
      wx.getImageInfo({
        src: this.data.src,
        success: res => {
          console.log(ctx, x, y, w, h)

          ctx.drawImage(this.data.src, dx, dy, dw, dh)
          // ctx.draw()
          ctx.draw(false, function() {
            console.log('这里？')
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width,
              height,
              canvasId: 'canvas',
              success: res => {
                console.log(res.tempFilePath)
              },
              complete: com => {
                console.log(com)
              }
            }, this)
          })
        }
      })
      // this.setData({
      //   style: `position: absolute; clip:rect(${y1}px ${x1}px ${y2}px ${x2}px)`
      // })
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
    }
  }
})
