// pages/UI-Pages/ui.timePicker/ui.timePicker.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  
  },

  open: function(timer = '') {
    this.data.timer = timer
    this.setData({
      timer: this.data.timer
    }, () => {
        this.selectComponent('#timePicker').open()
    })
  },
  timeOpen: function() {
    this.open()
  },
  setTimeOpen: function() {
    this.open(new Date('2022-08-16 08:30').getTime())
  },

  

  onCallbackChange: function(event) {
    const { value } = event.detail

    wx.showModal({
      title: '提示',
      content: `${value}`,
      showCancel: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})