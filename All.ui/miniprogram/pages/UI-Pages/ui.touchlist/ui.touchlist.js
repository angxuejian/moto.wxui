// miniprogram/pages/UI-Pages/ui.touchlist/ui.touchlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
      'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 
      'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'
    ],
    offsetTop: 0,
    listHeight: 0,
    selectIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  onTouchMover: function(event) {
    // const { index, item } = event.currentTarget.dataset
    const y = event.touches[0].clientY
    const t = this.data.offsetTop - y
    const h = this.data.listHeight / this.data.list.length
    const d = this.data.list.length - parseInt((t / h)) - 1

    if (d < 0 || d >= this.data.list.length) return
    if (this.data.selectIndex === d) return

    this.setData({
      selectIndex: d,
    })

    /**
     * 整个.list的高度 - 单个.item的高度 = 当前.item到底部的高度
     * 当前.item到底部的高度 / .item的高 = .item的数量
     * （整体数量 - 1） - .item的数量 = 单个.item的索引
     * 
     * 
     */
  },

  onTap: function(event) {
    console.log(event)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const domc = wx.createSelectorQuery();//创建节点选择器
    const self = this
    domc.select('.list').boundingClientRect()
    domc.exec(function (res) {
      console.log(res);
      self.data.offsetTop  = res[0].bottom
      self.data.listHeight = res[0].height
    })

    domc.select('.frist-item').boundingClientRect()
    domc.exec(function (res) {
      console.log(res);
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