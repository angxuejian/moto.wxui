// pages/UI-Pages/ui.nprogress/ui.nprogress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * nprogress组件--开始加载 不会加载到100% 
   */
  nprStart: function() {
    this.selectComponent('#nprogress').setting({
      bColor: '#438EDB'
    })
    this.selectComponent('#nprogress').start()
  },

  /**
   * nprogress组件--结束加载 会加载到100%
   */
  nprDone: function() {
    this.selectComponent('#nprogress').done()
  },

  /**
   * nprogress组件--自定义样式
   */
  nprSetting: function() {
    this.selectComponent('#nprogress').setting({
      bColor: 'black'
    })
    this.selectComponent('#nprogress').start()

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