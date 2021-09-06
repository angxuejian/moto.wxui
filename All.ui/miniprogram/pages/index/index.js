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
    this.setData({
      height: app.globalData.bar
    })
  },


  gotoUI: function({ currentTarget }) {
    const { url } = currentTarget.dataset
    const BASE = '/pages/UI-Pages'
    wx.navigateTo({
      url: `${BASE}/${url}/${url}`,
    })
  },

  open: function() {
    this.selectComponent('#sideBox').open()
  },

  // initFace: function() {
  //   wx.initFaceDetect({
  //     success: res => {
  //       console.log('1')
  //       wx.request({
  //         url:'https://hos.smartbit.top/img/x.jpg',
  //         responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
  //         success:res=>{
  //           console.log('2')
  //           wx.faceDetect({
  //             frameBuffer: res.data,
  //             width: 1080,
  //             height: 1438,
  //             success: suc => {
  //               console.log(suc)
  //             },
  //             fail: err => {
  //               console.log(err,'--')
  //             },
  //           })
  //         }
  //       })
  //     },
  //     fail: err => {
  //       console.log(err)
  //     }
  //   })
  // },


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
