// pages/Ex-Pages/myEnglish/myEnglish.js
import English from '../../../utils/english'
const app = getApp()
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

  _loadData: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })


    wx.hideLoading()
    this.data.todayEnglish = this.getEnglishList()
    this.data.swiperList = this.getTriplet(0)
    this.setData({
      swiperList: this.data.swiperList,
      todayEnglish: this.data.todayEnglish
    })
    // wx.cloud.callFunction({
    //   name: 'getRandomEnglish',
    //   complete: function({ result }) {
    //     wx.hideLoading()
    //     self.data.todayEnglish = result.data
    //     self.data.swiperList = self.getTriplet(0)
    //     self.setData({
    //       swiperList: self.data.swiperList,
    //       todayEnglish: self.data.todayEnglish
    //     })
    //   }
    // })
  },

  getEnglishList() {
    let list = []
    const storage = wx.getStorageSync('todayEnglish')
    const todayTime = new Date().getTime();

    if (storage && storage.time > todayTime) {
      list = storage.list
    } else {
      const todayList = English.filter(item => !app.globalData.english.includes(item.name))

      if (todayList.length < 10) {
        list = todayList;
        wx.setStorage({
          key: 'english',
          data: []
        })
      } else {
        const names = []
        const indexs = this.getIndex(todayList.length - 1)
        indexs.forEach(item => {
          const itemEnglish = todayList[item]
          list.push(itemEnglish)
          names.push(itemEnglish.name)
        })
        app.globalData.english.push(...names)
        wx.setStorage({
          key: 'english',
          data: app.globalData.english
        })
      }

      wx.setStorage({
        key: 'todayEnglish',
        data: {
          time: new Date().getTime() + 86400000,
          list: list
        }
      })
    }
    return list;
  },
  getIndex(max) {
    const index = []
    while (index.length < 10) {
      const i = this.getRandomInt(0, max)
      if (!index.includes(i)) {
        index.push(i)
      }
    }
    return index;
  },
  getRandomInt(min, max) {
    min = Math.ceil(min); // 最小值是向上取整  
    max = Math.floor(max); // 最大值是向下取整  
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  swiperChange: function (event) {
    const {
      current
    } = event.detail
    const {
      swiperList,
      todayEnglish
    } = this.data

    const title = swiperList[current].name
    const index = todayEnglish.findIndex(item => item.name === title)

    this.data.swiperIndex = current
    this.data.todayEnglishIndex = index
    this.data.isTouch = true
  },

  touchStart: function (event) {
    this.setData({
      startX: event.touches[0].pageX
    });
  },

  touchEnd: function (event) {
    if (!this.data.isTouch) return
    this.setData({
      endX: event.changedTouches[0].pageX
    });
    const {
      startX,
      endX
    } = this.data

    const distance = endX - startX
    const {
      todayEnglishIndex,
      todayEnglish,
      swiperIndex,
      swiperList
    } = this.data

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


  getTriplet: function (index) {
    const {
      todayEnglish
    } = this.data

    if (index < 0 || index >= todayEnglish.length) {
      console.log('索引错误')
      return
    }

    const prevIndex = this.calcPrevIndex(index, todayEnglish)
    const nextIndex = this.calcNextIndex(index, todayEnglish)

    return [todayEnglish[prevIndex], todayEnglish[index], todayEnglish[nextIndex]]
  },

  calcPrevIndex: function (index, list) {
    let prevIndex = index - 1
    return prevIndex < 0 ? list.length - 1 : prevIndex
  },

  calcNextIndex: function (index, list) {
    let nextIndex = index + 1
    return nextIndex >= list.length ? 0 : nextIndex
  },

  getCapyEnglish: function (event) {
    const {
      value
    } = event.currentTarget.dataset
    wx.setClipboardData({
      data: value
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