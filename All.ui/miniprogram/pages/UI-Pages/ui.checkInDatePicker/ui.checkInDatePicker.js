// pages/UI-Pages/ui.checkInDatePicker/ui.checkInDatePicker.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multipleValue: [],
    multipleName: '',
    singleName: '',
    singleValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const s = new Date()

    const start = new Date(this.clear(s))
    const end = new Date(start.getTime() + (6 * 86400000))
    this.data.multipleValue = [start, end].map(this.clear)
    this.setData({
      multipleName: this.data.multipleValue.join('/'),
      multipleValue: this.data.multipleValue
    })
  },

  clear: function (s) {
    const yy = s.getFullYear()
    const mm = s.getMonth() + 1
    const dd = s.getDate()
    return [yy, mm, dd].join('-')
  },

  openSingle: function (event) {
    this.selectComponent('#checkInDateSinglePicker').open()
  },
  openMultiple: function () {
    this.selectComponent('#checkInDateMultipePicker').open()
  },
  onCallbackChangeMultipe: function (event) {
    const {
      detail
    } = event
    const start = this.cleanName(detail.start)
    const end = this.cleanName(detail.end)
    wx.showModal({
      title: `共${detail.nightNumber}晚`,
      content: `${start} - ${end}`,
      showCancel: false
    })
    this.data.multipleValue = [start, end]
    this.setData({
      multipleName: [start, end].join('/')
    })
  },

  onCallbackChangeSingle: function (event) {
    const {
      detail
    } = event
    const start = detail.start
    const value = this.cleanName(detail.start)
    const name = `${value} ${start.lunar.week}`
    wx.showModal({
      title: '提示',
      content: name,
      showCancel: false
    })
    this.data.singleValue = name
    this.setData({
      singleName: name
    })
  },

  cleanName: function (d) {
    let date = d.solar.value
    return date
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