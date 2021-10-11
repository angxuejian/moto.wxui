// miniprogram/pages/UI-Pages/ui.picCrop/ui.picCrop.js
import { throttle } from '../../../utils/util'
import {
  getDistance,
  getCanvasNode,
  getWidthFix,
  getHeightFix
} from './utils'
import { drawInitImgSrc, drawCropImgSrc } from './draw'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '', // 图片地址
    boxSize: { w: 340, h: 340, top: 0, left: 0 }, // 裁剪框大小
    imgSize: { width: 0, height: 0, x: 0, y: 0, src: '' }, // canvas需要裁剪的大小

    x: 0,
    y: 0,
    scale: 1,
    touch: {
      startX: 0,
      startY: 0,
      moveX : 0,
      moveY : 0,
      startS: 0,
      moveS: 0,
    },
    cropNode: null,// id为 crop的canvas标签的 实例对象
    diff: null,  // 裁剪框 与 设备宽高的差值
    sysInfo: {}, // 设备信息
    isScale: false, // 是否为手势缩放操作
    isTouch: false, // 是否为手势动作
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const src = 'https://images.pexels.com/photos/9750382/pexels-photo-9750382.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'

    this.initImgSrc(src)
  },

  // -----------------
  // 1、绘制裁剪框内的 图片

  // 初始化图片的宽高比例
  initImgSrc: async function(src) {

    const img = await wx.getImageInfo({ src })
    const sys = await wx.getSystemInfo()
    const boxd = {}


    // 计算裁剪框的最小宽度
    if (this.data.boxSize.w > sys.windowWidth) {
      const wh = sys.windowWidth * 0.8
      this.data.boxSize.w = wh
      this.data.boxSize.h = wh
      boxd.boxSize = this.data.boxSize
    }

    const { boxSize, imgSize } = this.data


    // 获取图片的信息、并先图片的宽高绘制canvas标签上
    let list = []
    if (img.width < img.height) {
      list = getWidthFix(img.width, img.height, boxSize.w, img.height)
    } else {
      list = getHeightFix(img.width, img.height, img.width, boxSize.h)
    }
    imgSize.width  = list[0]
    imgSize.height = list[1]
    this.setData({ imgSize, ...boxd })

    imgSize.initSrc = img.path // 背景图片、使用已加载到本地的图片
    imgSize.cropSrc = src      // 裁剪时、使用线上地址图片
    this.data.sysInfo = sys
    this.setImgSize()


    // 初始化 - 按照比例缩放图片
    // 将图片缩放至裁剪区域
    const d = {
      x: 0, y: 0,
      src   : imgSize.initSrc,
      width : imgSize.width,
      height: imgSize.height,
      dpr   : imgSize.pixelRatio
    }
 
    const imgSrc = await drawInitImgSrc(d)
    this.setData({ imgSrc })
  },


  // ---------------------
  // 2、手势拖动图片移动、缩放


  // start touch
  onTouchStart: function(event) {
    const { touches } = event
    this.data.isTouch = true


    if (touches.length === 1) {
      // 第二次触摸滑动时、要减去 x, y 的已移动的距离
      this.data.touch.startX = touches[0].pageX - this.data.x
      this.data.touch.startY = touches[0].pageY - this.data.y
      this.data.isScale = false
    } 
    
    else if (touches.length === 2) {
      this.data.touch.startS = getDistance(touches[0], touches[1])
      this.data.isScale = true
    }
  },

  // move touch
  onTouchMove: throttle(function(event) {

    if (!this.data.isTouch) return
    const { touches } = event

    // 单指图片移动操作
    if (touches.length === 1 && !this.data.isScale) {
      this.data.touch.moveX = touches[0].pageX
      this.data.touch.moveY = touches[0].pageY

      const x = this.data.touch.moveX - this.data.touch.startX
      const y = this.data.touch.moveY - this.data.touch.startY
      this.setData({ x, y })
    }

    // 双指图片缩放操作
    else if (touches.length === 2 && this.data.isScale) {

      this.data.touch.moveS = getDistance(touches[0], touches[1])

      let zoom = this.data.touch.moveS / this.data.touch.startS
      let scale = this.data.scale * zoom

      if (scale > 3) scale = 3
      else if (scale < 0.5) scale = 0.5

      this.setImgScale(scale)
    }
  }, 15),

  // end touch
  onTouchEnd: function(event) {

    if (!event.touches.length) {
      if (this.data.scale < 1) {
        this.data.scale = 1
        this.setImgScale(this.data.scale)
      }
  
      this.data.isScale = false
    }
  },


  // ---------------------
  // 3、裁剪canvas图片


  // 裁剪并预览图片
  onSaveImg: async function() {
    wx.showLoading({
      title: '裁剪中',
      mask: true
    })
    const { imgSize, scale } = this.data
    
    const d = {
      x: (imgSize.x + this.data.x), 
      y: (imgSize.y + this.data.y),
      src   : imgSize.cropSrc,
      width : imgSize.width * scale,
      height: imgSize.height * scale,
      dpr   : imgSize.pixelRatio
    }

    if (!this.data.cropNode) this.data.cropNode = await getCanvasNode()
    const src = await drawCropImgSrc(d, this.data.cropNode)
    wx.previewImage({ urls: [src] })
    wx.hideLoading()
  },


  // ---------------------
  // 缩放及旋转 裁剪框的公共方法


  setImgRotate: function() {

  },

  // 缩放后、重新计算裁剪框与设备的 差值
  setImgScale: function(scale) {
    this.data.scale = scale
    this.setImgSize()
    this.setData({ scale })
  },

  // 计算裁剪框与设备的 差值
  setImgSize: function() {
    const { boxSize, imgSize, sysInfo, scale } = this.data

    // 获取图片的位置
    const diff = {
      sysX: (sysInfo.windowWidth  - boxSize.w) / 2,
      sysY: (sysInfo.windowHeight - boxSize.h) / 2,
      imgX: (sysInfo.windowWidth  - (imgSize.width * scale)) / 2,
      imgY: (sysInfo.windowHeight - (imgSize.height * scale)) / 2,
    }

    imgSize.x = diff.imgX - diff.sysX
    imgSize.y = diff.imgY - diff.sysY
    imgSize.pixelRatio = sysInfo.pixelRatio

    this.data.diff = diff
    this.data.imgSize = imgSize

    if (!this.data.boxSize.top) {
      this.data.boxSize.top = diff.sysY
      this.data.boxSize.left = diff.sysX
      this.setData({ boxSize: this.data.boxSize })
    }
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})