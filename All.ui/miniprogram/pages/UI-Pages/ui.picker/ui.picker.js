// miniprogram/pages/UI-Pages/ui.picker/ui.picker.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { value: '北京' },
      { value: '上海' },
      { value: '广州' },
      { value: '深圳' },
      { value: '杭州' },
      { value: '重庆' }
    ],
    list2: [
     '羊肉泡馍', '爆炒小龙虾', '请蒸羊羔'
    ],
    name: '',
    name2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },



  onCallbackChange: function(event) {

    this.data.name = event.detail.item.value
    this.setData({
      name: this.data.name
    })
    // wx.showModal({
    //   title: '提示',
    //   showCancel: false,
    //   content: `第 ${event.detail.index + 1} 项`
    // })
  },


  open: function() {
    this.selectComponent('#picker').open()
  },

  onCallbackChange2: function(event) {
    this.data.name2 = event.detail.item
    this.setData({
      name2: this.data.name2
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

  }
})