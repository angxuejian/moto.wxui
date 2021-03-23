// index.js
// 获取应用实例
const app = getApp()
import { list } from './config'
Page({
  data: {
    list: list,
    height: 0
  },
  onLoad() {
    wx.getSystemInfo({
      success: (result) => {
        const { statusBarHeight } = result
        this.setData({
          height: statusBarHeight
        })
      },
    })
  },

  gotoUI: function({ currentTarget }) {
    const { url } = currentTarget.dataset
    wx.navigateTo({
      url,
    })
  }
})
