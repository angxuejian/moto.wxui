// miniprogram/pages/UI-Pages/ui.imgMode/ui.imgMode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '/assets/b.jpg',

    imgArr: [
      {
        info: '缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素',
        mode: 'scaleToFill'
      },
      {
        info: '缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。',
        mode: 'aspectFit'
      },
      {
        info: '缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。',
        mode: 'aspectFill'
      },
      {
        info: '缩放模式，宽度不变，高度自动变化，保持原图宽高比不变',
        mode: 'widthFix'
      },
      {
        info: '缩放模式，高度不变，宽度自动变化，保持原图宽高比不变',
        mode: 'heightFix',
        isVer: true
      },
      {
        info: '裁剪模式，不缩放图片，只显示图片的顶部区域',
        mode: 'top'
      },
      {
        info: '裁剪模式，不缩放图片，只显示图片的底部区域',
        mode: 'bottom'
      },
      {
        info: '裁剪模式，不缩放图片，只显示图片的中间区域',
        mode: 'center'
      },
      {
        info: '裁剪模式，不缩放图片，只显示图片的左边区域',
        mode: 'left'
      },
      {
        info: '裁剪模式，不缩放图片，只显示图片的右边区域',
        mode: 'right'
      },
      {
        info: '裁剪模式，不缩放图片，只显示图片的左上边区域',
        mode: 'top left'
      },
      {
        info: '裁剪模式，不缩放图片，只显示图片的右上边区域',
        mode: 'top right'
      },
      {
        info: '裁剪模式，不缩放图片，只显示图片的左下边区域',
        mode: 'bottom left'
      },
      {
        info: '裁剪模式，不缩放图片，只显示图片的右下边区域',
        mode: 'bottom right'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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