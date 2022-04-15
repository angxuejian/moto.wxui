// pages/UI-Pages/ui.lottery/ui.lottery.js
let canvas = null
let ctx = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prizes: [
      { name: '一等奖', percent: 0.01, count: 1 },
      { name: '二等奖', percent: 0.05, count: 3 },
      { name: '三等奖', percent: 0.14, count: 10 },
      { name: '未中奖', percent: 0.80, count: -1 },
      { name: '未中奖', percent: 0.80, count: -1 },
      { name: '未中奖', percent: 0.80, count: -1 },
    ],
    nameArr: [],
    weightSum: 0,
    weightArr: [],
    turntable: {},
    turntable_src: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.initPrize()
  },

  initPrize: function() {
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
  


  gameStart: function() {
    const index = Math.floor(Math.random() * this.data.prizes.length)
    // const index= 5
    console.log(`本次抽奖结果：` + index + this.data.prizes[index].name)

    /**
     * 240 => this.data.prizes 对应 0 的旋转度数
     * 6 * 360 => 多转6圈
     */
    const deg = (index) * (360 / this.data.prizes.length)
    const arc = 6 * 360
    const rotate = (deg > 240 ? deg : deg <= 240 ? 240 - deg : (240 + deg)) + arc

    const animation = wx.createAnimation({
      duration: 3000,
      timingFunction: 'ease'
    })
 
    animation.rotate(rotate).step()
    this.setData({
      gameAnimation: animation.export()
    })
 

    // 初始化动画
    setTimeout(() => {
      wx.showModal({
        title: '本次抽奖结果',
        content: this.data.prizes[index].name,
        showCancel: false,
        })
      setTimeout(() => {
        animation.rotate(0).step({duration:10})
        this.setData({
          gameAnimation: animation.export()
        })
      }, 1000);
    }, 4000);
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    this.initTurntable()
  },

  initTurntable: function() {
    const query = wx.createSelectorQuery()
    query.select('#turntable')
      .fields({ node: true, size: true })
      .exec((res) => {
        canvas = res[0].node
        ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        this.data.turntable = {
          angle: Math.PI * 2 / this.data.prizes.length,
          x: res[0].width / 2,
          y: res[0].height / 2,
          dpr,
          deg: 0
        }
        this.render()
      })
  },
  render: function() {
    this.drawArc()
    this.drawText()
    // this.drawBtn()
  },


  drawArc: function() {
    const { angle, x, y } = this.data.turntable
    for (let i = 0; i < this.data.prizes.length; i++) {
      const start = i * angle
      const end = (i + 1) * angle
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.arc(x, y, 125, start, end, false)   // 125 => 圆的半径
      ctx.fillStyle = i % 2 === 1 ? 'white' : 'blue'
      ctx.fill()
      ctx.closePath()
      ctx.restore()
    }
  },

  drawText: function() {
    const { angle, x, y, dpr } = this.data.turntable
    for (let i = 0; i < this.data.prizes.length; i++) {
      ctx.save()
      ctx.beginPath()
      ctx.translate(x, y)
      ctx.rotate(i * angle + angle / 2 + Math.PI / 2)
      ctx.fillStyle = 'red'
      ctx.font = '18px Microsoft YaHei'

      /**
       * 字体换行
       * 90 => 扇形顶部最大宽度，字体宽度最多可放 90
       * -90 => 扇形底部与顶部的距离, 越大距离底部越近
       * -20 => 每个字体的高度
       */
      const list = this.getTextWidth(ctx, this.data.prizes[i].name, 90)
      list.forEach((text, index) => {
        ctx.fillText(i + text, -ctx.measureText(text).width / 2, -90 - (-20 * index))
      })
      ctx.closePath()
      ctx.restore()
    }
    // ctx.save()
    // ctx.beginPath()
    // ctx.translate(x, y)
    // ctx.rotate(Math.PI / 6)
    // ctx.closePath()

    this.exportImage(canvas, 'turntable_src')
  },

  drawBtn: function() {
    const { x, y } = this.data.turntable
    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = 'red'
    ctx.arc(x, y, 35, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = 'white'
    ctx.font = '20px Microsoft YaHei'
    ctx.translate(x, y)
    ctx.fillText('开始', -ctx.measureText('开始').width / 2, 7)
    ctx.restore()

    ctx.save()
    ctx.beginPath()
    ctx.fillStyle = 'red'
    ctx.moveTo(100, 100)
    ctx.lineTo(125, 80)
    ctx.lineTo(150, 100)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  },

  exportImage: function(canvas, key) {
    const { dpr } = this.data.turntable
    wx.canvasToTempFilePath({
      canvas: canvas,
      width: canvas.width / dpr,
      height: canvas.height / dpr,
      destWidth: canvas.width,
      destHeight: canvas.height,
      success: res => {
        this.setData({
          [key]: res.tempFilePath
        })
      }
    })
  },

  /**
   * canvas 自动换行
   * @param {object} ctx canvas
   * @param {string} text fillText的内容
   * @param {number} maxWidth 每一行的最大宽度
   */
  getTextWidth: function(ctx, text, maxWidth) {
    const textList = text.split('')
    const list = []
    let str = ''

    for (let i = 0; i < textList.length; i++) {
      const el = textList[i];

      if (ctx.measureText(str).width >= maxWidth) {
        list.push(str)
        maxWidth -= ctx.measureText(text[0]).width
        str = ''
      }
      str += el
    }
    list.push(str)
    return list
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