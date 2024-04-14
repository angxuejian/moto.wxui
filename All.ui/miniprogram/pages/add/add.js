// pages/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myEnglish: {
      name: '',
      desc: ''
    },
    resetFormView: true,
    isShowAnimation: true,
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  onCallbackSubmit: function(event ) {
    const { name, desc } = event.detail.value
    if (name && desc) {
      this.data.myEnglish = { name, desc }
      wx.showLoading({
        title: '提交中...',
        mask: true
      })
      this.addMyEnglish()
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入内容',
        showCancel: false,
        confirmText: '知道啦！'
      })
    }   
  },

  addMyEnglish: function() {
    const { myEnglish } = this.data
    const self = this
    wx.cloud.callFunction({
      name: 'updateMyEnglish',
      data: {
        data: myEnglish
      },
      success: function() {
        wx.hideLoading()
        setTimeout(() => {
          wx.showToast({
            title: '提交成功！',
            icon: 'success',
          })
          self.resetForm()
        }, 0);
        
      },
      fail: function(err) {
        wx.hideLoading()
        setTimeout(() => {
          wx.showToast({
            title: err.errMsg,
            icon: 'error'
          })
        }, 0);
      },
    })
  },

  resetForm: function () {
    // 执行结束动画
    this.setData({
      isShowAnimation: false
    })

    // 动画结束后 将form表单情况
    setTimeout(() => {
      this.setData({
        resetFormView: false
      })
    }, 600);

    // 清空后, 重新执行显示form
    setTimeout(() => {
      this.setData({
        resetFormView: true,
        isShowAnimation: true
      })
    }, 700);

    // this.animate('#form', [
    //   {ease: 'ease', opacity: 0},
    //   {ease: 'ease', opacity: 1},
    // ], 500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})