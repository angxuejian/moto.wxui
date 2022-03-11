// pages/UI-Pages/ui.electronicSignature/ui.electronicSignature.js

let canvas = null
let ctx = null
let dpr = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    touchArr: [],
    isDraw: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.initCanvas()
  },

  initCanvas: function () {
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        canvas = res[0].node
        ctx = canvas.getContext('2d')
        dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)
        ctx.lineWidth = 4
        ctx.shadowColor = '#000000'
        ctx.shadowBlur = 1
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = '#000000'
        this.data.touchArr = []
        this.clearCanvas()
      })
  },

  clearCanvas: function() {
    ctx.clearRect(0, 0, canvas.width * dpr, canvas.height * dpr)
  
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width * dpr, canvas.height * dpr)
  },
  drawElSignature: function () {
    if (!this.data.touchArr.length || !this.data.isDraw) return

    this.clearCanvas()
    ctx.beginPath()
    for (let i = 0; i < this.data.touchArr.length; i++) {
      const item = this.data.touchArr[i]
      if (item.z === 0) {
        ctx.moveTo(item.x, item.y)
      } else {
        ctx.lineTo(item.x, item.y)
      }
    }
    ctx.stroke()
  },

  onTouchStart: function (event) {
    this.data.isDraw = true
    this.data.touchArr.push({
      x: event.changedTouches[0].pageX - event.target.offsetLeft,
      y: event.changedTouches[0].pageY - event.target.offsetTop,
      z: 0
    })
    this.drawElSignature()
  },

  onTouchMove: function (event) {

    this.data.touchArr.push({
      x: event.changedTouches[0].pageX - event.target.offsetLeft,
      y: event.changedTouches[0].pageY - event.target.offsetTop,
      z: 1
    })
    this.drawElSignature()
  },

  onTouchEnd: function (event) {
    this.data.isDraw = false
    this.data.touchArr.push({
      x: event.changedTouches[0].pageX - event.target.offsetLeft,
      y: event.changedTouches[0].pageY - event.target.offsetTop,
      z: 0
    })
  },
  reset: function () {
    this.initCanvas()
  },
  config: function () {

    wx.canvasToTempFilePath({
      canvas: canvas,
      width: canvas.width / dpr,
      height: canvas.height / dpr,
      destWidth: canvas.width,
      destHeight: canvas.height,
      success: res => {
        wx.previewImage({
          urls: [res.tempFilePath],
        })
      }
    })

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