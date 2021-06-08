// components/imgMode/imgMode.js

const DEFAULT_IMG = 'https://profile.csdnimg.cn/E/5/2/1_qq_43297527'


Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['img-class'],

  properties: {
    src: {
      type: String,
      value: DEFAULT_IMG
    },
    mode: {
      type: String,
      value: 'widthFix'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    style: '',
    styleW: 0,
    styleH: 0
  },

  lifetimes: {
    attached: function() {
      this.init()
      

      // wx.getSystemInfo().then(res => {
      //   console.log(res)
      // })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init: async function() {
      if (!this.data.mode) return
      // const { windowWidth, windowHeight }  = await wx.getSystemInfo()
      const { width, height } = await this.getImgMode()

      // const d = { windowWidth, windowHeight, width, height }

      this.data.styleW = width
      this.data.styleH = height
      console.log()
    },

    // 获取图片样式宽高
    getImgMode: function() {
      return new Promise(resolve => {
        const query = this.createSelectorQuery()
        query.select('#img-mode').boundingClientRect()
        query.exec(res => {
          resolve(res[0])
        })
      })
    },

    
    // 获取图片本身宽高
    onCallbackLoad: function(event) {

      if (this.data.mode === 'widthFix') this.getWidthFix(event.detail)

    },


    // widthFix 图片模式
    getWidthFix: function({ width, height }) {
  
      let scale = this.data.styleW / width
      let h = height * scale

      console.log(this.data.styleW, h)
      this.data.style = `height: ${h}px`
      this.setData({ style: this.data.style })
    }
  }
})
