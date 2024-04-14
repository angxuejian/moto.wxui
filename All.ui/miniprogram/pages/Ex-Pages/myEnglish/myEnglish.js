// pages/Ex-Pages/myEnglish/myEnglish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayEnglish: [],
    todayEnglishIndex: 0,

    swiperList: [],
    swiperIndex: 0,
    
    startX: 0,  
    endX: 0,
    isTouch: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  
    
    this._loadData()
  },

  _loadData: function() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const self = this
    wx.cloud.callFunction({
      name: 'getRandomEnglish',
      complete: function({ result }) {
        wx.hideLoading()
        self.data.todayEnglish = result.data
        self.data.swiperList = self.getTriplet(0)
        self.setData({
          swiperList: self.data.swiperList,
          todayEnglish: self.data.todayEnglish
        })
      }
    })
  },

  swiperChange: function(event) {
    const { current } = event.detail
    const { swiperList, todayEnglish } = this.data

    const title = swiperList[current].name
    const index = todayEnglish.findIndex(item => item.name === title)

    this.data.swiperIndex = current
    this.data.todayEnglishIndex = index
    this.data.isTouch = true
  },

  touchStart: function(event) {
    this.setData({  
      startX: event.touches[0].pageX  
    }); 
  },

  touchEnd: function(event) {
    if (!this.data.isTouch) return
    this.setData({  
      endX: event.changedTouches[0].pageX  
    }); 
    const { startX, endX } = this.data

    const distance = endX - startX
    const { todayEnglishIndex, todayEnglish, swiperIndex, swiperList } =  this.data

    let tIndex = null
    let sIndex = null

    if (distance > 0) {
      tIndex = this.calcPrevIndex(todayEnglishIndex, todayEnglish)
      sIndex = this.calcPrevIndex(swiperIndex, swiperList)
    } else if (distance < 0) {
      tIndex = this.calcNextIndex(todayEnglishIndex, todayEnglish)
      sIndex = this.calcNextIndex(swiperIndex, swiperList)  
    }
    this.data.isTouch = false
    this.setData({
      [`swiperList[${sIndex}]`]: todayEnglish[tIndex],
      todayEnglishIndex: this.data.todayEnglishIndex
    })
  },


  getTriplet: function(index) {
    const { todayEnglish } = this.data
  
    if (index < 0 || index >= todayEnglish.length) {
      console.log('索引错误')
      return
    }

    const prevIndex = this.calcPrevIndex(index, todayEnglish)
    const nextIndex = this.calcNextIndex(index, todayEnglish)

    return [todayEnglish[prevIndex], todayEnglish[index], todayEnglish[nextIndex]]
  },

  calcPrevIndex: function(index, list) {
    let prevIndex = index  - 1
    return prevIndex < 0 ? list.length - 1 : prevIndex
  },

  calcNextIndex: function(index, list) {
    let nextIndex = index + 1
    return nextIndex >= list.length ? 0 : nextIndex
  },

  getCapyEnglish: function(event) {
    const { value } = event.currentTarget.dataset
    wx.setClipboardData({ data: value })
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