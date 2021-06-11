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

        // 0.75 和 67 分别是 .share-poster 的 75% 和 67vh
        // 1vh = 屏幕高度 / 100 = 900 / 100 = 9px
        this.data.pixel  = result.pixelRatio
        // this.data.width  = result.windowWidth * 0.75
        // this.data.height = result.windowHeight / 100 * 67

        // 替换成固定宽高
        this.data.width  = 375
        this.data.height = 600
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


  checkSaveAlbum: function() {
    wx.authorize({
      scope:'scope.writePhotosAlbum',
      success: res => {
        this.drawPoster()
      },
      fail: err => {
        if (/auth deny/ig.test(err.errMsg)) {
          wx.showModal({
            title: '提示',
            content: '您需要授权后才可以保存到相册',
            success: res => {
              if (res.confirm) {
                this.openSetting()
              }
            }
          })
        }
      }
    })
  },

  openSetting: function() {
    wx.openSetting({
      success: res => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          this.drawPoster()
        } else {
          wx.showToast({
            title: '您未授权',
            icon:'none'
          })
        }
      }
    })
  },

  drawPoster: function() {
    
    wx.showLoading({
      title: '绘制中',
      mask: true
    })
    let width = this.data.width
    let height = this.data.height
    const ctx = wx.createCanvasContext('canvas')

    // 绘制背景颜色
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0,0, width, height)

    // 绘制顶部图片
    wx.getImageInfo({
      src: '/assets/poster.jpeg',
      success: res => {
        // 0.05 为 左右边距
        // 0.95 为 实际宽度
        let x = width * 0.05 / 2
        let p_width = width * 0.95
        let p_heigth = (p_width / res.width) * res.height

        ctx.drawImage('/assets/poster.jpeg', x, 10, p_width, p_heigth)
        

        // 绘制 小程序二维码和 文字
        // 90、60、110 都均为计算位置而设置的、可以改
        ctx.fillStyle = '#333333'
        ctx.font = 'normal bold 15px sans-serif'
        ctx.fillText('唯有头顶之上一片晴空',x, height - 90)

        ctx.fillStyle = '#666666'
        ctx.font = 'normal 500 12px sans-serif'
        ctx.fillText('angxuejian', x, height - 60)

        // 60 为 图片宽高大小
        let right_x = p_width - 60
        ctx.drawImage('/assets/a.jpg',right_x, height-110, 60, 60)


        // 底部logo
        ctx.fillStyle = '#666666'
        ctx.font = 'normal 500 12px sans-serif'
        ctx.fillText('Moto UI示例', right_x / 2, height - 10)

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
        wx.hideLoading()
        this.saveAlbum(res.tempFilePath)
      }
    })
  },

  saveAlbum: function(file) {
    wx.saveImageToPhotosAlbum({
      filePath: file,
      success: res => {
        wx.showToast({
          title: '保存成功',
        })
      },
      fail: err => {
        wx.showModal({
          title: '提示',
          content: '系统错误、请稍后再试',
          showCancel: false
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