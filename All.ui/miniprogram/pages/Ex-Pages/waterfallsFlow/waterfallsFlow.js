// pages/Ex-Pages/waterfallsFlow/waterfallsFlow.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { img: 'https://cdn.pixabay.com/photo/2022/08/09/09/24/boho-art-7374559__340.jpg', },
      { img: 'https://cdn.pixabay.com/photo/2023/02/10/08/00/woman-7780330__340.png', },
      { img: 'https://cdn.pixabay.com/photo/2023/03/07/11/58/woman-7835587_960_720.jpg', },
      { img: 'https://cdn.pixabay.com/photo/2023/02/02/17/11/chickens-7763394__340.jpg', },
      { img: 'https://cdn.pixabay.com/photo/2023/01/30/06/43/village-7754827__340.jpg', },
      { img: 'https://cdn.pixabay.com/photo/2023/01/21/13/39/trees-7733877__340.jpg', },
      { img: 'https://cdn.pixabay.com/photo/2022/12/14/15/08/darling-7655568__340.jpg', },

    ],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this._loadData()
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
    // if (this.data.page) {
    //   this.data.page++
    //   this._loadData()
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})