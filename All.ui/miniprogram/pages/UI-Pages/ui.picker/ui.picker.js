// miniprogram/pages/UI-Pages/ui.picker/ui.picker.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
    result: [
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
    onlyArr: [
      { value: '北京' },
      { value: '上海' },
      { value: '广州' },
      { value: '深圳' },
      { value: '杭州' },
      { value: '重庆' }
    ],
    moreArr1: [],
    moreArr2: [],
    show: {
      value1: '', //单列选择器
      value2: '', //多列选择器
      value3: '', //日期时间
      value4: '', //实例方法
      value5: '', //默认值
      value6: '', //日期
      value7: '', //时间
    },
    listIndex2: [0, 1],
    dateVa: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
    this.data.dateVa = new Date('2022-09-15 15:00:00').getTime()

    this.data.moreArr1 = [this.data.result, this.data.result[0].child]
    this.data.moreArr2 = [this.data.result, this.data.result[0].child]

    this.setData({
      moreArr1: this.data.moreArr1,
      moreArr2: this.data.moreArr2,
      dateVa: this.data.dateVa
    })
  },



  onCallbackChange: function(event) {
    const { index, item } = event.detail
    const { key } = event.currentTarget.dataset

    if (item.length) {
      const list = []
      item.forEach(el => {
        list.push(el.name)
      })

      this.data.show[key] = list.join('-')
    } else {
      this.data.show[key] = `${item.value}`
    }
   
    this.setData({
      ['show.' + key]: this.data.show[key]
    })
  },


  onCallbackColumnChange: function(event) {
    const { column, index} = event.detail
    const key = event.currentTarget.dataset.list

    if (!column) {
      this.data[key].splice(1, 1, this.data.result[index].child)
    }
    this.setData({
      [key]: this.data[key]
    })
  },


  onCallbackDateTimeChange: function(event) {
    const { value, list_cn } = event.detail
    const { key } = event.currentTarget.dataset
    let val = value

    if (key !== 'value3') val = list_cn.join('')

    this.data.show[key] = val
    
    this.setData({
      ['show.' + key]: this.data.show[key]
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