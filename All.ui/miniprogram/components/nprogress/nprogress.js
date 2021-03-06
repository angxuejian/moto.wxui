// components/nprogress/nprogress.js

const MAX = 95 // start状态下 进度最大值
const BIG = 4 // 步长 >= 0  && 步长 < 30 自增的值
const LARGER = 3 // 步长 >= 30 && 步长 < 60 自增的值
const SMALL = 2 // 步长 >= 60 && 步长 < 80 自增的值
const LITTLE = 1 // 步长 >= 80 && 步长 < 95 自增的值
const SETTING = {
  bColor         : '#438EDB', // 进度条的颜色
  height         : 2        , // 进度条的高度
  duration       : 300      , // 动画完成时间
  timingFunction : 'linear' , // 动画的效果
  speed          : 10       , // 起始步长
}
Component({
  /**
   * 组件的属性列表S
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    AData: '', // document上的动画样式
    speed: 0, // 进度步长
    setting: {}, // 配置信息
    isShowView: true, // 是否显示 view; 用于刷新document节点
  },

  lifetimes: {
    attached: function () {
      this.init(SETTING)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 初始化 配置信息
    init: function (data) {
      for (let key in data) {
        this.data.setting[key] = data[key]
      }
      this.setData({
        setting: this.data.setting
      })
    },

    // 配置信息 及 setData
    setting: function (data) {
      if (!data) this.init(SETTING)
      else if (Object.prototype.toString.call(data) !== '[object Object]') this.showTypeError(data, {})
      else {
        for (let key in data) {
          const newKey = Object.prototype.toString.call(data[key])
          const oldKey = Object.prototype.toString.call(SETTING[key])
          if (newKey !== oldKey) {
            this.showTypeError(data[key], SETTING[key])
          }
        }
        this.init(data)
      }
    },

    // 开始加载进度条
    start: function () {
      const { speed } = this.data.setting
      this.data.speed = speed
      this.setData({
        isShowView: true,
      })

      // 等待 dom渲染完成后 执行动画
      setTimeout(() => {
        this.setAnimation(1, this.data.speed)
      }, 100);
    },

    // 自增进度条
    inc: function () {
      this.data.speed = this.incSpeed(this.data.speed)
      this.setAnimation(1, this.data.speed)
    },

    // 进度条100%
    done: function () {
      this.data.speed = 100
      this.setAnimation(0.6, this.data.speed, 100)
    },


    /**
     * 清洗步长, 步长越大自增越小
     * @param {number} n 步长
     */
    incSpeed: function (n) {
      if (n >= 0 && n < 30) return n + BIG
      else if (n >= 30 && n < 60) return n + LARGER
      else if (n >= 60 && n < 80) return n + SMALL
      else if (n >= 80 && n < 95) return n + LITTLE
      else if (n >= 95) return MAX
    },

    /**
     * 渲染document节点动画
     * @param {number} opacity  透明度
     * @param {number} width    进度步长
     * @param {number} duration done成功后的 执行动画时间
     */
    setAnimation: function (opacity, width, duration) {
      const animation = wx.createAnimation({
        duration: duration || this.data.setting.duration,
        timingFunction: this.data.setting.timingFunction,
      })
      animation.opacity(opacity).width(`${width}%`).step()
      this.setData({
        AData: animation.export(),
      })


    },

    // 监听动画完成事件
    onTransition: function () {
      if (this.data.speed > MAX) {
        // 刷新document
        this.setData({
          AData: null,
          isShowView: false,
        })
      } else {
        // 需要自增，小于 最大值 需要自增到步长最大值
        this.inc()
      }
    },

    /**
     * 类型错误
     * @param {any} errValue 错误类型
     * @param {any} corValue 正确类型
     */
    showTypeError: function (errValue, corValue) {
      const err = Object.prototype.toString.call(errValue)
      const cor = Object.prototype.toString.call(corValue)
      const error = `The type should be an "${cor}" instead of a "${err}"  -  类型应该是 ${cor}, 而不应该是 ${err}`
      throw new Error(error)
    }
  }
})