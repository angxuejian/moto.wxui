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
    console.log('- v0.1')
    console.log('\n')


    this.globalData = {
      statusBarHeight: 0
    }
  }
})
