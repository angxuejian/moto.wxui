// miniprogram/pages/UI-Pages/ui.picCrop/ui.picCrop.js
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
    touch: {
      startX: 0,
      startY: 0,
      moveX : 0,
      moveY : 0,
    },
    cropNode: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const src = 'https://images.pexels.com/photos/5002528/pexels-photo-5002528.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'

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


    // 获取图片的位置
    const diff = {
      sysX: (sys.windowWidth  - boxSize.w) / 2,
      sysY: (sys.windowHeight - boxSize.h) / 2,
      imgX: (sys.windowWidth  - imgSize.width)  / 2,
      imgY: (sys.windowHeight - imgSize.height) / 2,
    }

    imgSize.initSrc = img.path // 背景图片、使用已加载到本地的图片
    imgSize.cropSrc = src      // 裁剪时、使用线上地址图片
    imgSize.x = diff.imgX - diff.sysX
    imgSize.y = diff.imgY - diff.sysY
    imgSize.pixelRatio = sys.pixelRatio

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

  // 裁剪并预览图片
  onSaveImg: async function() {
    wx.showLoading({
      title: '裁剪中',
      mask: true
    })
    const { imgSize, boxSize } = this.data
    const d = {
      x: imgSize.x + this.data.x, 
      y: imgSize.y + this.data.y,
      src   : imgSize.cropSrc,
      width : imgSize.width,
      height: imgSize.height,
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
        ctx.drawImage(img,x,y, width, height)
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
            },
            fail: err => {
              console.log(err, '这是')
            }
          })
        }, 200)
      })
    })
  },


  // start touch
  onTouchStart: function(event) {
    const { touches } = event

    // 第二次触摸滑动时、要减去 x, y 的已移动的距离
    this.data.touch.startX = touches[0].pageX - this.data.x
    this.data.touch.startY = touches[0].pageY - this.data.y
  },

  // move touch
  onTouchMove: function(event) {
    const { touches } = event

    this.data.touch.moveX = touches[0].pageX
    this.data.touch.moveY = touches[0].pageY

    const x = this.data.touch.moveX - this.data.touch.startX
    const y = this.data.touch.moveY - this.data.touch.startY

    this.setData({ x, y })
  },

  // end touch
  onTouchEnd: function(event) {

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