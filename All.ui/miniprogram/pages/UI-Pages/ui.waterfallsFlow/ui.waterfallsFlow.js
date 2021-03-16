// miniprogram/pages/UI-Pages/ui.waterfallsFlow/ui.waterfallsFlow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData()
  }, 

  // 获取图片列表
  _loadData: function() {
    wx.showLoading({
      title: '加载中',
      mask : true
    })
    wx.cloud.callFunction({
      name: 'getWFallsImg',
      data: {
        page: this.data.page
      },
      success: ({ result }) => {
        const { data } = result

        if (!data.length) {
          this.data.page = 0
          return false
        }
        this.data.list = data
        this.setData({
          list: this.data.list
        })
      },
      fail: err => {
        wx.showModal({
          title: '提示',
          content: '服务器错误',
          showCancel: false
        })
      },
      complete: () => {
        wx.hideLoading()
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
    if (this.data.page) {
      this.data.page++
      this._loadData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})