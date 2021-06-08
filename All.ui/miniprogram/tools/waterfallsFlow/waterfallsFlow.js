// tools/waterfallsFlow/waterfallsFlow.js
const DEFAULT_IMG = 'https://profile.csdnimg.cn/E/5/2/1_qq_43297527'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgArr: [],
    imgLen: 0,

    leftArr: [],
    rightArr: [],

    windowWidth: 0,
  },

  observers: {
    list: function(params) {
      this.data.imgArr = params
      this.data.imgLen += params.length

      this.init()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    init: function() {
      this.wxFalls()  // 微信瀑布流
      // this.diyFalls() // DIY 瀑布流
    },

    /**
     * 微信提供的 瀑布流
     */
     wxFalls: function () {
      let { leftArr, rightArr, imgArr } = this.data

      for (let i = 0; i < imgArr.length; i++) {
        this.clearFlowArr(leftArr, rightArr, imgArr[i])
      }

      this.setData({ leftArr, rightArr })
    },


    /**
     * 动手做 瀑布流
     */
    diyFalls: function () {
      this.setData({ imgArr:this.data.imgArr })

      wx.getSystemInfo({
        success: (res) => {
          // 0.48: view的宽度为 48%
          this.data.windowWidth = res.windowWidth * 0.48
        },
      })
    },

    // 图片加载完成
    onCallbackLoad: function (event) {
      const { width, height } = event.detail
      const { index } = event.currentTarget.dataset
      const { windowWidth, imgArr, imgLen } = this.data

      const scale = windowWidth / width
      const item = {
        height: height * scale,
        src   : imgArr[index].img
      }

      let { leftArr, rightArr } = this.data
      this.clearFlowArr(leftArr, rightArr, item)

      let length = leftArr.length + rightArr.length

      if (length === imgLen) {
        this.setData({ leftArr, rightArr })
      }
    },

    // 清洗瀑布流 先左后右
    clearFlowArr: function (left, right, current) {
      if (left.length <= right.length) {
        left.push(current)
      } else {
        right.push(current)
      }

    },

    // 图片加载失败
    onCallbackErr: function(event) {
      const { index, type } = event.currentTarget.dataset
      this.data[type][index].img = DEFAULT_IMG

      this.setData({
        [type + '[' + index + '].img']: this.data[type][index].img
      })
    },

    // 预览图片
    onPreviewImg: function(event) {
      const { src } = event.currentTarget.dataset
      wx.previewImage({
        urls: [src],
        current: src
      })
    }
  }
})