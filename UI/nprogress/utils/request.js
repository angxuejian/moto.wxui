

// 模拟 get 请求
function get (data, _this, iswxload) {
      /*
            data     : object  => 请求需要的参数
            _this    : object  => 调用方法页面的 this 对象
            iswxload : boolean => 是否使用 wx.showloading
      */

      _this.selectComponent('#nprogress').start()
      if (iswxload) {wx.showLoading({ title: '加载中...', mask: true })}

      return new Promise((reslove, reject) => {
            setTimeout(() => {
                  _this.selectComponent('#nprogress').done()
                  if (iswxload) wx.hideLoading()

                  return reslove('成功')
            }, 1000)
      })
}

module.exports = {
      get
}