// miniprogram/pages/UI-Pages/ui.drawer/ui.drawer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { name: '默认位置与大小' },
      { name: '顶部打开', type: 'top', width: '100vw', height: '200px' },
      { name: '底部打开', type: 'bottom', width: '100vw', height: '500px' },
      { name: '左边打开', type: 'left', width: '200px', height: '100vh' },
      { name: '右边打开', type: 'right', width: '80vw', height: '100vh' },
      { name: '中间打开', type: 'center', width: '85vw', height: '300px' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 
  openDrawer: function(event) {
    const { id } = event.currentTarget.dataset

    this.selectComponent(`#${id}`).open()
  },

  closeDrawer: function() {
    this.selectComponent('#drawer').close()
  },

  onCallbackOPEN: function(event) {
    const { position } = event.currentTarget.dataset
    if (position === 'top') {
      wx.showToast({
        title: '打开弹窗了',
        icon: 'none'
      })
    }
  },
  onCallbackCLOSE: function(event) {
    const { position } = event.currentTarget.dataset
    if (position === 'right') {
      wx.showToast({
        title: '关闭弹窗了',
        icon: 'none'
      })
    }
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