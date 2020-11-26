const app = getApp()

Page({
  data: {

  },
  onLoad: function () {

  },


  // 收到确认颜色 回调
  onCallBackColor: function({ detail }) {
    const { hex, rgb } = detail
    console.log('收到 bindchange回调...')
    console.log('HEX:', hex)
    console.log('RGB:', rgb)
    console.log('------------------------',)
    console.log('\n')
    wx.showModal({
      title: 'bindchange回调',
      content: hex,
      showCancel: false
    })
  }
})
