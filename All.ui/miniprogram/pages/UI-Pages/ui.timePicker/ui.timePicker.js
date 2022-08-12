// pages/UI-Pages/ui.timePicker/ui.timePicker.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log()
    const myAngle = ((1 - 3) / 6) * Math.PI
    const a = ((1 % 12) / 12) * Math.PI * 2 - Math.PI / 2;

    console.log(myAngle, a)
    return
    const radius = 100
    const myX = radius + radius * Math.cos(myAngle);
    const myY = radius + radius * Math.sin(myAngle);

    console.log(myX, myY)
  },

  open: function() {
    this.selectComponent('#timePicker').open()
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