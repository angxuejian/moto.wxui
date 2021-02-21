// index.js
// 获取应用实例
const app = getApp()
import { list } from './config'
Page({
  data: {
    list: list
  },
  onLoad() {
  },

  gotoUI: function({ currentTarget }) {
    const { url } = currentTarget.dataset
    wx.navigateTo({
      url,
    })
  }
})
