// miniprogram/pages/UI-Pages/ui.picCrop/ui.picCrop.js

const throttle = function(func, wait) {
  var timeout;

  return function() {
      var context = this;
      var args = arguments;
      if (!timeout) {
          timeout = setTimeout(function(){
              timeout = null;
              func.apply(context, args)
          }, wait)
      }

      }
  }
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '', // 图片地址
    boxSize: { w: 340, h: 340, top: 0, left: 0 },
    imgSize: { width: 0, height: 0, x: 0, y: 0, src: '' },
    x: 0,
    y: 0,
    scale: 1,
    touch: {
      startX: 0,
      startY: 0,
      moveX : 0,
      moveY : 0,
      startS: 0,
      moveS: 0,
    },
    cropNode: null,
    diff: null,
    sysInfo: {},
    isScale: false,
    isTouch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const src = 'https://cdn.pixabay.com/photo/2021/09/02/02/50/old-man-6592565_960_720.jpg'

    this.initImgSrc(src)

  },

  // 初始化图片的宽高比例
  initImgSrc: async function(src) {

    const img = await wx.getImageInfo({ src })

    const sys = await wx.getSystemInfo()

    const wh = sys.windowWidth * 0.8
    const boxd = {}

    if (wh < this.data.boxSize.w) {
      this.data.boxSize.w = wh
      this.data.boxSize.h = wh
      boxd.boxSize = this.data.boxSize
    }
    const { boxSize, imgSize } = this.data

    // 获取图片的宽高
    let list = []

    if (img.width < img.height) {
      list = this.getWidthFix(img.width, img.height, boxSize.w, img.height)
    } else {
      list = this.getHeightFix(img.width, img.height, img.width, boxSize.h)
    }
    imgSize.width  = list[0]
    imgSize.height = list[1]


    // 先将图片大小、绘制canvas标签上
    this.setData({ imgSize, ...boxd })

    imgSize.initSrc = img.path // 背景图片、使用已加载到本地的图片
    imgSize.cropSrc = src      // 裁剪时、使用线上地址图片

    this.data.sysInfo = sys
    this.setImgSize()

    // 初始化 - 按照比例缩放图片
    // 将图片缩放至裁剪区域
    const d = {
      x: 0, y: 0,
      src   : imgSize.initSrc,
      width : imgSize.width,
      height: imgSize.height,
      dpr   : imgSize.pixelRatio
    }
 
    const imgSrc = await this.drawInitImgSrc(d)
    this.setData({ imgSrc })
  },

  setImgSize: function() {
    const { boxSize, imgSize, sysInfo, scale } = this.data

    // 获取图片的位置
    const diff = {
      sysX: (sysInfo.windowWidth  - boxSize.w) / 2,
      sysY: (sysInfo.windowHeight - boxSize.h) / 2,
      imgX: (sysInfo.windowWidth  - (imgSize.width * scale)) / 2,
      imgY: (sysInfo.windowHeight - (imgSize.height * scale)) / 2,
    }

    imgSize.x = diff.imgX - diff.sysX
    imgSize.y = diff.imgY - diff.sysY
    imgSize.pixelRatio = sysInfo.pixelRatio

    this.data.diff = diff
    this.data.imgSize = imgSize
  },


  // 裁剪并预览图片
  onSaveImg: async function() {
    wx.showLoading({
      title: '裁剪中',
      mask: true
    })
    const { imgSize, scale } = this.data
    
    const d = {
      x: imgSize.x + this.data.x * scale, 
      y: imgSize.y + this.data.y * scale,
      src   : imgSize.cropSrc,
      width : imgSize.width * scale,
      height: imgSize.height * scale,
      dpr   : imgSize.pixelRatio
    }
    
    const src = await this.drawCropImgSrc(d)
    wx.previewImage({ urls: [src] })
    wx.hideLoading()
  },


  // 裁剪图片
  // 裁剪图片时没办法使用本地缓存图片
  drawCropImgSrc: async function(data) {
    const { dpr, x, y, width, height, src } = data
    let crop = this.data.cropNode

    if (!crop) {
      crop = await this.getCanvasNode()
      this.data.cropNode = crop
    }
    
    return new Promise((resolve) => {
      const canvas = crop.node
      const ctx = canvas.getContext('2d')

      canvas.width = crop.width * dpr
      canvas.height = crop.height * dpr
      ctx.scale(dpr, dpr)

      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const img = canvas.createImage()
      img.onload = () => {
        ctx.drawImage(img,x, y, width , height)
        resolve(canvas.toDataURL('image/png', 1))
      }
      img.src = src
    })

  },

  // 绘制待裁剪背景图片
  drawInitImgSrc: function(data, id = 'init') {
    return new Promise((resolve) => {
      const { x, y, width, height, src, dpr } = data
      const ctx = wx.createCanvasContext(id)
      ctx.drawImage(src, x, y, width, height)

      ctx.draw(false, () => {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            x,  y, width, height, 
            canvasId: id,
            destWidth: width * dpr,
            destHeight: height * dpr,
            success: res => {
              resolve(res.tempFilePath)
            }
          })
        }, 200)
      })
    })
  },


  // start touch
  onTouchStart: function(event) {
    const { touches } = event

    this.data.isTouch = true
    if (touches.length === 1) {
      // 第二次触摸滑动时、要减去 x, y 的已移动的距离
      this.data.touch.startX = touches[0].pageX - this.data.x
      this.data.touch.startY = touches[0].pageY - this.data.y
      this.data.isScale = false
    } else if (touches.length === 2) {
      this.data.touch.startS = this.getDistance(touches[0], touches[1])
      this.data.isScale = true
    }
  },

  // move touch
  onTouchMove: throttle(function(event) {

    if (!this.data.isTouch) return
    const { touches } = event

    if (touches.length === 1 && !this.data.isScale) {
      this.data.touch.moveX = touches[0].pageX
      this.data.touch.moveY = touches[0].pageY

      const x = this.data.touch.moveX - this.data.touch.startX
      const y = this.data.touch.moveY - this.data.touch.startY

      this.setData({ x, y })
    } else if (touches.length === 2 && this.data.isScale) {

      this.data.touch.moveS = this.getDistance(touches[0], touches[1])

      let zoom = this.data.touch.moveS / this.data.touch.startS
      let scale = this.data.scale * zoom

      if (scale > 3) scale = 3
      else if (scale < 0.5) scale = 0.5

      this.onSaveImgFon(scale)
    }
  }, 50),

  // end touch
  onTouchEnd: function(event) {

    if (!event.touches.length) {
      if (this.data.scale < 1) {
        this.data.scale = 1
        this.onSaveImgFon(this.data.scale)
      }
  
      this.data.isScale = false
    }
  },

  

  onSaveImgFon: function(scale) {
    this.data.scale = scale
    this.setImgSize()
    this.setData({ scale })
  },

  
  /**
   * 
   * @param {Object} start touches[0]
   * @param {Object} end   touches[1]
   * @returns 两指的距离
   */
  getDistance: function(start, end) {
    let s = Math.abs(end.pageX - start.pageX) * 2
    let e = Math.abs(end.pageY - start.pageY) * 2

    return Math.sqrt(s + e)
  },


  getCanvasNode: function(id = 'crop') {
    return new Promise((resolve) => {
      wx.createSelectorQuery()
        .select('#' + id)
        .fields({
          node: true,
          size: true,
        })
        .exec(res => {
          resolve(res[0])
        })
    })
  },

  getWidthFix: function(width, height, styleW, styleH) {

    let [w, h, s] = []
  
    // 获取图片本身宽高 与 样式宽高的比例
    s = styleW / width 
  
    w = styleW
    h = styleH * s
  
    return [w, h] 
  },
  
  getHeightFix: function(width, height, styleW, styleH) {
  
    let [w, h, s] = []
  
    // 获取图片本身宽高 与 样式宽高的比例
    s = styleH / height 
  
    w = styleW * s
    h = styleH
  
    return [w, h] 
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})