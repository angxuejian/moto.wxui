//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'study-0ggdjcyz9c4a99bf',
        traceUser: true
      })
    }
    console.log('- github: https://github.com/angxuejian/moto.wxui')
    console.log('- 如何使用  详看 README.md')
    console.log('- 有问题可以  issues  或者 QQ: 1251537708 找我哦!')
    console.log('- v0.3.5')
    console.log('\n')


    this.globalData = {
      bar: 0,
      DEFAULT_IMG: 'https://profile.csdnimg.cn/E/5/2/1_qq_43297527',
      calendar: {},
      english: []
    }
    wx.getStorage({
      key: 'english',
      success: res => {
        this.globalData.english = res.data
      }
    })
    wx.getStorage({
      key: 'calendar',
      success: res => {
        this.globalData.calendar = res.data
      }
    })

    wx.getSystemInfo({
      success: (result) => {
        const { statusBarHeight } = result
        // 状态栏高度 + 导航栏高度(44)

        this.globalData.bar = statusBarHeight + 44
      },
    })
  }
})
