// pages/Ex-Pages/removeBG/removeBG.js
import {
  BASE_IMG
} from './config'

Page({


  /**
   * 组件的初始数据
   */
  data: {
    isRBG: false, // 是否开始消除背景
    isMask: false, // 是否开启透明蒙版
    isAnim: true, // 动画是否结束

    deColor: '#438EDB', // 默认颜色

    photo: BASE_IMG,
    predPhoto: '', // 最后消除背景后的 图片

    isShowLoading: true,
    timer: null
  },


  /**
   * 选择颜色
   */
  selectColor: function () {
    return;
    this.selectComponent('#colorPicker').open()
  },

  /**
   * 选择颜色的回调
   */
  onCallbackChange: function ({
    detail
  }) {
    const {
      hex
    } = detail

    this.data.deColor = hex
    this.setData({
      deColor: this.data.deColor
    })
  },

  /**
   * 动画结束的回调
   */
  onCallbackAnimEnd: function () {
  
    if (!this.data.timer) {
      wx.showLoading({
        title: '消除中...',
        mask: true
      })
    }
    const setPhoto = () => {
      if (this.data.isShowLoading && this.data.predPhoto) {
        wx.hideLoading()
        this.data.timer = null
        clearTimeout(this.data.timer)
        this.data.isShowLoading = true
        this.data.isAnim = true
        this.setData({
          isAnim: this.data.isAnim,
          predPhoto: this.data.predPhoto,
          isRBG: this.data.isRBG,
          isMask: this.data.isMask
        })
        return
      }
      this.data.timer = setTimeout(() => {
        setPhoto()
      }, 500);
    }

    setPhoto()

  },


  /**
   * 选择图片
   */
  selectPhoto: function () {
    return;
    wx.chooseMedia({
      mediaType: ['image'],
      count: 1,
      sizeType: [],
      success: ({
        tempFiles
      }) => {
        const file = tempFiles[0].tempFilePath

        this.data.photo = file
        this.setData({
          photo: this.data.photo
        })
      }
    })
  },

  /**
   * 请求 remove-bg api 获取图片
   */
  getPhotoBG: function () {
    const {
      deColor,
      photo,
      predPhoto
    } = this.data
    let {
      isRBG,
      isMask,
      isAnim
    } = this.data

    if (predPhoto) return false

    isRBG = true
    isMask = true
    isAnim = false
    this.setData({
      isRBG,
      isMask,
      isAnim
    })

    this.data.predPhoto = '/assets/avatar-done.jpg'
    this.data.isMask = false
    this.data.isRBG = false
    return
    let d = {}
    if (photo === BASE_IMG) {
      d.image_file_b64 = photo
    } else {
      d.image_url = wx.cloud.CDN({
        type: 'filePath',
        filePath: photo,
      })
    }
    wx.cloud.callFunction({
      name: 'getNewPhoto',
      data: {
        data: {
          bg_color: deColor,
          ...d
        }
      },
      success: ({
        result
      }) => {
        if (result.status === 200) {
          this.data.predPhoto = result.data
          this.data.isMask = false
          this.data.isRBG = false
        } else {
          this.onErrorModel(result.message)
        }

      },
      fail: err => {
        this.onErrorModel()
      }
    })
  },

  /**
   * 错误提示
   */

  onErrorModel: function (content) {
    this.data.isShowLoading = false
    wx.hideLoading()
    wx.showModal({
      title: '提示',
      content: content || '服务器错误、请稍后再试',
      showCancel: false,
      success: () => {
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },

  /**
   * 重置操作
   */
  resetPhotoBG: function () {
    let {
      predPhoto
    } = this.data
    predPhoto = ''
    this.setData({
      predPhoto
    })
  },

  /**
   * 预览图片
   */
  onPredPhoto: function () {
    return;
    wx.previewImage({
      urls: [this.data.predPhoto],
    })
  }

})