// pages/UI-Pages/ui.recorder/ui.recorder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audioSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  open: function() {
    this.selectComponent('#recorder').open()
  },

  onCallbackChange: function(event) {
    this.data.audioSrc = event.detail.tempFilePath
    this.setData({ audioSrc: this.data.audioSrc })
  },

  play: function() {
    if (!this.data.audioSrc) return
    const audio = wx.createInnerAudioContext()
    audio.src = this.data.audioSrc
    audio.autoplay = true
    // audio.play()

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