// miniprogram/pages/UI-Pages/ui.picker/ui.picker.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { value: '北京' },
      { value: '上海' },
      { value: '广州' },
      { value: '深圳' },
      { value: '杭州' },
      { value: '重庆' }
    ],
    list2: [],
    backupArr: [
      {
        name: '北京',
        child: [
          { name: '豆汁', child: [
            { name: '1' },
            { name: '2' }
          ] },
          { name: '炸酱面' }
        ]
      },
      {
        name: '杭州',
        child: [
          { name: '酱鸭' },
          { name: '爆炒小龙虾' }
        ]
      },
      {
        name: '上海',
        child: [
          { name: '外滩' },
          { name: '东方明珠' }
        ]
      }
    ],
    name: '',
    name2: '',
    name3: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.list2 = [this.data.backupArr, this.data.backupArr[0].child]
    this.setData({
      list2: this.data.list2
    })
  },



  onCallbackChange: function(event) {
    const { item } = event.detail
    this.data.name = `${item.value}`
    this.setData({
      name: this.data.name
    })
  },

  onCallbackChange2: function(event) {
    this.data.name2 = event.detail.item.value
    this.setData({
      name2: this.data.name2
    })
  },

  onCallbackChange3: function(event) {
    const { index, item } = event.detail
    const list = []
    item.forEach(el => {
      list.push(el.name)
    })

    this.setData({
      name3: list.join('-')
    })
  },
  onCallbackColumnChange3: function(event) {
    const { column, index} = event.detail

    if (!column) {
      this.data.list2.splice(1, 1, this.data.backupArr[index].child)
    }
    this.setData({
      list2: this.data.list2
    })
  },


  open: function() {
    this.selectComponent('#picker').open()
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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