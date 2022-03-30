// miniprogram/pages/UI-Pages/ui.datePicker/ui.datePicker.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timestamp: new Date('2050-10-01').getTime()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

   /**
   * datePicker组件--change事件回调--弹出阳历
   * @param {Object} event 
   */
  onCallbackChange: function({ detail }) {
    wx.showModal({
      title: 'Change事件',
      content: `日期：${ detail.solar.value }`,
      showCancel: false
    })
  },

   /**
   * datePicker组件--change事件回调--弹出阴历
   * @param {Object} event 
   */
  onCallbackChangeLun: function({ detail }) {
    wx.showModal({
      title: 'Change事件',
      content: `日期：${ detail.lunar.value }`,
      showCancel: false
    })
  },

  open: function() {
    this.selectComponent('#datePicker').open()
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