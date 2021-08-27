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
    listBottom: 0, // 从顶部到 .list底部的高度
    listHeight: 0, // .list 的高度
    selectIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  onTouchMover: function(event) {

    const y = event.touches[0].clientY
    const itemBottom = this.data.listBottom - y // 剩余 .list的高度
    const itemHeight = this.data.listHeight / this.data.list.length // 获取单个 .item的高度
    const index = this.data.list.length - parseInt((itemBottom / itemHeight)) - 1

    if (index < 0 || index >= this.data.list.length) return
    if (this.data.selectIndex === index) return

    this.data.selectIndex = index

    this.setData({
      selectIndex: this.data.selectIndex,
    })

    /**
     * 顶部到 .list底部的高度 - 顶部到 .item底部高度 = 剩余 .list的高度
     * 
     * 剩余 .list的高度 / .item的高度 = .item的数量
     * （整体数量 - 1） - .item的数量 = 当前 .item的索引
     * 
     * 
     */
  },

  onTap: function(event) {
    const { index } = event.currentTarget.dataset
    this.data.selectIndex = index
    this.setData({
      selectIndex: this.data.selectIndex
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const domc = wx.createSelectorQuery();//创建节点选择器
    const self = this
    domc.select('.list').boundingClientRect()
    domc.exec(function (res) {
      self.data.listBottom  = res[0].bottom
      self.data.listHeight = res[0].height
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