// index.js
// 获取应用实例
const app = getApp()
import { list } from './config'
import { changeColor } from '../../utils/util'

Page({
  data: {
    list: list,
    height: 0
  },
  onLoad() {
    wx.getSystemInfo({
      success: (result) => {
        const { statusBarHeight } = result

        // 状态栏高度 + 导航栏高度(44)
        app.globalData.statusBarHeight = statusBarHeight + 44
        this.setData({
          height: statusBarHeight
        })
      },
    })
  },


  gotoUI: function({ currentTarget }) {
    const { url } = currentTarget.dataset
    const BASE = '/pages/UI-Pages'
    wx.navigateTo({
      url: `${BASE}${url}`,
    })
  },

  open: function() {
    this.selectComponent('#sideBox').open()
  },


  onCallbackChange: function(event) {
    const { detail } = event

    if (detail.color) {
      const array = this.data.list
      const list = []
      for (let i = 0; i < array.length; i++) {
        let data = {
          title: array[i].title,
          list: array[i].list.map(s => {
            s.svg = changeColor(s.svg, detail.color)
            return s
          })
        }
        list.push(data)
      }

      this.setData({
        list
      })
    }
  }
})
