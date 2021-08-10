// components/drawer/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    position: {
      type: String,
      value: 'bottom',
      observer: function(value) {
        const list = ['top', 'bottom', 'left', 'right', 'center']
        if (!list.includes(value) && value) {
          throw new Error('"position" attribute error')
        } else {
          this.setType(value)
        }
      }
    },
    width: {
      type: String,
      value: ''
    },
    height: {
      type: String,
      value: ''
    },
    mask: {
      type:Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: 0,       // 0:真关闭 1:打开 2:伪关闭
    type: '',  // 显示位置
  }, 

  /**
   * 组件的方法列表
   */
  methods: {
    // 对外实例方法 - 调用实例打开组件
    open: function() {
      this.triggerEvent('open')
      this.showDrawer()
    },
    close: function() {
      this.triggerEvent('close')
      this.showDrawer()
    },

    showDrawer: function () {
      let show = this.data.isShow

      if (!show) this.data.isShow = 1
      else if (show === 1) this.data.isShow = 2
      else if (show === 2) this.data.isShow = 1

      const data = {
        isShow: this.data.isShow
      }
      this.clearData(data)
    },

    clearData: function(data){
      if (!this.data.type) {
        throw new Error('"position" attribute error')
        return
      }

      if (this.data.type === 'none') {
        this.data.type = this.data.position
        data.type = this.data.type
      } 

      let style = ''
      if (this.data.width) {
        style += `width: ${this.data.width};`
      } 
      if (this.data.height) {
        style += `height: ${this.data.height};`
      }
      if (this.data.type === 'center' && this.data.height) {
        style += `top: calc((100% - ${this.data.height}) / 2);`
      }
      if (this.data.type === 'center' && this.data.width) {
        style += `left: calc((100% - ${this.data.width}) / 2);`
      }

      if (this.data.isShow === 2) {
        data.width = ''
        data.height = ''
      }
  
      data.style = style
      this.setData(data)
    },

    maskShowDrawer: function() {
      if (!this.data.mask) return

      this.showDrawer()
    },

    onCallbackEnd: function(event) {
      if (this.data.isShow === 2) {
        this.setType('none')
      }
    },

    setType: function(t) {
      this.data.type = t
      this.setData({ type: this.data.type })
    }
  }
})
