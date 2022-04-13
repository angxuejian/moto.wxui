// pages/UI-Pages/ui.lottery/ui.lottery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prizes: [],
    nameArr: [],
    weightSum: 0,
    weightArr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.initPrize()
  },

  initPrize: function() {
    this.data.prizes = [
      { name: '一等奖', percent: 0.01, count: 1 },
      { name: '二等奖', percent: 0.05, count: 3 },
      { name: '三等奖', percent: 0.14, count: 10 },
      { name: '未中奖', percent: 0.80, count: -1 }
    ]
    this.data.nameArr = []
    this.data.weightSum = 0
    this.data.weightArr = []

    this.data.prizes.forEach(item => {
      const weight = item.percent
      this.data.weightSum += weight
      this.data.weightArr.push(weight)
      this.data.nameArr.push(item.name)
    })
  },
  getLottery: function() {
    const { prizes, weightArr, nameArr, weightSum } = this.data
    
    const random = Math.random() * weightSum
    weightArr.push(random)

    const sortWeightArr = weightArr.sort((a, b) => a - b )
    const index = Math.min(sortWeightArr.indexOf(random), prizes.length - 1)

    const itemPrize = prizes[index]
    let tip = nameArr[index]

    if (itemPrize.count >= 1) itemPrize.count--
    else if (itemPrize.count === 0) { 
      tip += '已被领取完 - 未中奖'
    }

    console.log(tip)
  },

  testWhile: function() {
    this.initPrize()

    for (let i = 0; i < 100; i++) {
      this.getLottery()
    }
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        canvas.width = res[0].width
        canvas.height = res[0].height

        const part = 6
        const angle = Math.PI * 2 / part
        const x = canvas.width / 2
        const y = canvas.height / 2

        for (let i = 0; i < part; i++) {
          const start = i * angle
          const end = (i + 1) * angle
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.arc(x, y, 125, start, end)
          ctx.fillStyle = i % 2 === 1 ? '#fff' : 'blue'
          ctx.fill()
          ctx.fillStyle = 'red'
          ctx.fillText('123', canvas.width / 2 - 3, 20)

        }

        // ctx.fillText('123', 50, 20)
        // ctx.rotate(angle)
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