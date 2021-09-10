// miniprogram/pages/UI-Pages/ui.picCrop/ui.picCrop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '', // 图片地址
    boxSize: { w: 340, h: 340 },
    imgSize: { width: 0, height: 0, x: 0, y: 0, src: '' }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.initImgSrc('../../../assets/c.jpg')

  },

  // 初始化图片的宽高比例
  initImgSrc: async function(src) {

    const img = await wx.getImageInfo({ src })
    const sys = await wx.getSystemInfo()

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
    this.setData({ imgSize })

    // 获取图片的位置
    const diff = {
      sysX: (sys.windowWidth  - boxSize.w)  / 2,
      sysY: (sys.windowHeight - boxSize.h)  / 2,
      imgX: (sys.windowWidth  - imgSize.width)  / 2,
      imgY: (sys.windowHeight - imgSize.height)  / 2,
    }

    imgSize.src = src
    imgSize.x = diff.imgX - diff.sysX
    imgSize.y = diff.imgY - diff.sysY
    imgSize.pixelRatio = sys.pixelRatio

  

    // 初始化 - 按照比例缩放图片
    // 将图片缩放至裁剪区域
    const d = {
      x: 0, y: 0,
      src   : imgSize.src,
      width : imgSize.width,
      height: imgSize.height
    }
 
    const imgSrc = await this.drawImgSrc(d, 'init')
    this.setData({ imgSrc })
  },

  // 裁剪并预览图片
  onSaveImg: async function() {
    wx.showLoading({
      title: '裁剪中',
      mask: true
    })
    const { imgSize, boxSize } = this.data
    // const d = {
    //   x: 0, y: 0,
    //   src   : imgSize.src,
    //   width : 50,
    //   height: 50
    // }
 
    const src = await this.drawImgSrc(imgSize, 'crop')
    wx.previewImage({ urls: [src] })
    wx.hideLoading()
  },



  // 绘制图片
  drawImgSrc: function(data, canvasId) {

    return new Promise((resolve) => {
      const { x, y, width, height, src } = data

      const ctx = wx.createCanvasContext(canvasId)
      ctx.drawImage(src, x, y, width, height)

      ctx.draw(false, () => {
        wx.canvasToTempFilePath({
          x,  y, width, height, canvasId,
          success: res => {
            resolve(res.tempFilePath)
          },
          fail: err => {
            console.log(err, 'canvas 导出失败')
          }
        })
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