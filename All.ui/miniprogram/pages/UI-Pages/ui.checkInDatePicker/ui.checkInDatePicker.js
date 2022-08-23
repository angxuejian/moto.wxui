// pages/UI-Pages/ui.checkInDatePicker/ui.checkInDatePicker.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiple: true,
    value: [],
    valueName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const s = new Date()

    const start = new Date(this.clear(s))
    const end = new Date(start.getTime() + (6 * 86400000))
    this.data.value = [start, end].map(this.clear)
    this.setData({
      valueName: this.data.value.join('/'),
    })
  },

  clear: function(s) {
    const yy = s.getFullYear()
    const mm = s.getMonth() + 1
    const dd = s.getDate()
    return [yy, mm, dd].join('-')
  },

  open: function(event) {
    const { multiple } = event.currentTarget.dataset
    this.setData({ multiple }, () => {
      this.selectComponent('#checkInDatePicker').open()
    })
  },
  openValue: function() {
    this.setData({
      value: this.data.value,
      multiple: true
    }, () => {
      this.selectComponent('#checkInDatePicker').open()
    })
  },
  onCallbackChange: function(event) {
    const { detail } = event
    if (this.data.multiple) {
      wx.showModal({
        title: `共${detail.nightNumber}晚`,
        content: `${detail.startName} - ${detail.endName}`,
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: `${detail.startName}`,
        showCancel: false
      })
    }

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