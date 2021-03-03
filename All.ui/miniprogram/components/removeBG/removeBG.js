// components/removeBG/removeBG.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isRBG: false, // 是否开始消除背景
    deColor: '#438EDB', // 默认颜色
  },

  attached() {
   
  },
  /**
   * 组件的方法列表
   */
  methods: {


    /**
     * 选择颜色
     */
    selectColor: function() {
      this.selectComponent('#colorPicker').open()
    },

    /**
     * 选择颜色的回调
     */
    onCallbackChange: function({ detail }) {
      const { hex } = detail

      this.data.deColor = hex
      this.setData({
        deColor: this.data.deColor
      })
       setTimeout(() => {
        this.setData({
          isRBG: true
        })
    }, 2000)
    }
  }
})
