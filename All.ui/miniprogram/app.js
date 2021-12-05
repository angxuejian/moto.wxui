//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({

        env: 'mt-develop-6g6cszyd02a5bf13',
        // env: 'mt-produce-8g711n3jaf11de66',
        traceUser: true,
      })
    }
    console.log('- github: https://github.com/angxuejian/moto.wxui')
    console.log('- 如何使用  详看 README.md')
    console.log('- 有问题可以  issues  或者 QQ: 1251537708 找我哦!')
    console.log('- v0.3.1')
    console.log('\n')


    this.globalData = {
      bar: 0,
      DEFAULT_IMG: 'https://profile.csdnimg.cn/E/5/2/1_qq_43297527',
      calendar: {}
    }

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
