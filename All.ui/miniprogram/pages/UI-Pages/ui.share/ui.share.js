// miniprogram/pages/UI-Pages/ui.share/ui.share.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 0,
    height: 0,
    pixel: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (result) => {
        // console.log(result)
        this.data.pixel  = result.pixelRatio
        this.data.width  = result.windowWidth
        this.data.height = result.windowHeight
        this.setData({
          width: this.data.width,
          height: this.data.height
        })
      },
    })
  },

  onShow() {
    this.drawPoster()
  },

  open: function() {
    this.selectComponent('#showImage').open()
  },

  drawPoster: function() {
    let width = this.data.width
    let height = this.data.height
    const ctx = wx.createCanvasContext('canvas')

    // 绘制背景颜色
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0,0, width, height)

    // 绘制顶部图片
    wx.getImageInfo({
      src: '/assets/poster.jpg',
      success: res => {
        let x = width * 0.05 / 2
        let p_width = width * 0.95
        let p_heigth = (p_width / res.width) * res.height - 180
        
        // console.log(p_width, p_heigth)
        ctx.drawImage('../../../assets/poster.jpg', x, 10, p_width, p_heigth)

        // ctx.draw()
        ctx.draw(false, this.onCallbackSave)
      }
    })
  },

  onCallbackSave: function() {
    const { width, height, pixel } = this.data
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width,
      height,
      destWidth: width * pixel,
      destHeight: height * pixel,
      canvasId: 'canvas',
      success: res => {
        wx.previewImage({
          urls: [res.tempFilePath]
        })
      }
    })
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
    console.log('要分享了')
    return  {
      title: 'Moto UI示例',
      path: '/pages/index/index',
    }
  },

  /**
   * 用户分享朋友圈
   */
  onShareTimeline: function () {
    return {
      title: 'Moto UI示例',
    }
  }
})