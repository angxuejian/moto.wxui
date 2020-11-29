import { get } from '../../utils/request'
Page({
  data: {

  },

  // 开始加载
  onStart: function() {
    this.selectComponent('#nprogress').start()
  },

  // 结束加载
  onDone: function() {
    this.selectComponent('#nprogress').done()
  },

  // 配置
  onSetSetting: function() {
    this.selectComponent('#nprogress').setting({
      mask  : false ,
      bColor: '#000',
    })
    this._loadData()
  },

  // 默认颜色
  onSetDefaults: function() {
    this.selectComponent('#nprogress').setting({
      bColor: '#4EC520',
      mask  : true     ,
      // 更多配置.....
    })
    this._loadData()
  },

  // 顶部加载
  _loadData: function() {
    get({}, this).then(res => {
      this.showSuccess(res)
    })
  },

  // 顶部加载 + loading框加载
  _loadDatawx: function() {
    get({}, this, true).then(res => {
      this.showSuccess(res)
    })
  },

  showSuccess: function(title) {
    wx.showToast({ title })
  }
})
