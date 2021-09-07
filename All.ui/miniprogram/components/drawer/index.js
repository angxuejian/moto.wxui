// components/drawer/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    position: {
      type: String,
      value: '',
      observer: function(value) {
        const list = ['top', 'bottom', 'left', 'right', 'center']
        if (!list.includes(value) && value) {
          throw new Error('"position" attribute error')
        } else {
          this.setDataType(value)
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
    },
    touch: {
      type:Boolean,
      value: false
    }
  },


 
  /**
   * 组件的初始数据
   */
  data: {
    isShow: 0,   // 0:真关闭 1:打开 2:伪关闭
    type  : '',  // 显示位置
    left  : {},
    right : {},
    top   : {},
    bottom: {},
    boxWidth: 0,
    boxHeight: 0
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
    close: function(isTouchClose) {
      this.triggerEvent('close')
      this.showDrawer(isTouchClose)
    },

    showDrawer: function (isTouchClose = false) {
      let show = this.data.isShow

      if (!show) this.data.isShow = 1
      else if (show === 1) this.data.isShow = 2
      else if (show === 2) this.data.isShow = 1

      const data = {
        isShow: this.data.isShow
      }

      if (isTouchClose) this.setData(data)
      else this.clearData(data)
      
    },

    clearData: function(data){

      if (!this.data.type) {
        this.data.position = 'bottom'
      }

      if (this.data.type === 'none' || !this.data.type) {
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

      data.style = style
      this.setData(data, () => {
        this.getBoxDom()
      })
    },

    maskShowDrawer: function() {
      if (!this.data.mask) return

      this.close()
    },
    

    onCallbackEnd: function(event) {
      if (this.data.isShow === 2) {
        this.setType('none')
      }
    },

    setType: function(t) {
      this.data.type = t
      this.setData({ type: this.data.type })
    },

    setDataType(t) {
      const dataX = {
        startX: 0,
        moveX : 0,
        endX  : 0,
      }
      const dataY = {
        startY: 0,
        moveY : 0,
        endY  : 0,
      }
      const x = ['left', 'right']
      const y = ['top', 'bottom']

      if (x.includes(t)) this.data[t] = Object.assign({}, dataX)
      else if (y.includes(t)) this.data[t] = Object.assign({}, dataY)
    },

    setDateTypeValue: function(key, xx, yy) {
      const x = ['left', 'right']
      const y = ['top', 'bottom']

      if (x.includes(this.data.type)) this.data[this.data.type][`${key}X`] = xx;
      else if (y.includes(this.data.type)) this.data[this.data.type][`${key}Y`] = yy;
    },

    setDataTypeNum: function() {
      const x = ['left', 'right']
      const y = ['top', 'bottom']
      
      if (x.includes(this.data.type)) {
        return this.data[this.data.type].startX - this.data[this.data.type].moveX
      } else if (y.includes(this.data.type)) {
        return this.data[this.data.type].startY - this.data[this.data.type].moveY
      }
    },

    getBoxDom: function() {
      const domc = this.createSelectorQuery();//创建节点选择器
      const self = this
      domc.select('.drawer-box').boundingClientRect()
      domc.exec(function (res) {
        self.data.boxWidth  = res[0].width
        self.data.boxHeight = res[0].height
      })
    },

    isBreak: function() {
      return this.data.type === 'center' || !this.data.touch
    },

    // -----------------
    // 触摸事件
    
    onTouchStart: function(event) {
      if (this.isBreak()) return false;

      const xx = event.touches[0].clientX
      const yy = event.touches[0].clientY

      this.setDateTypeValue('start', xx, yy)
    },
    onTouchMove: function(event) {

      if (this.isBreak()) return false;

      const xx = event.touches[0].clientX
      const yy = event.touches[0].clientY
      
      this.setDateTypeValue('move', xx, yy)
      let num = this.setDataTypeNum()
      this.setDateTypeValue('end', num, num)

      let style = `width: ${this.data.width}; height: ${this.data.height};`
      let str   = ''
      
      const { type } = this.data

      if (type === 'left' || type === 'top') str = `${type}: -${num}px;`
      else if (type === 'right' || type === 'bottom') {
        num = num >= 0 ? 0 : num
        str = `${type}: ${num}px;`
      }

      this.setData({ style: style + str })

      
    },
    onTouchEnd: function() {

      if (this.isBreak()) return false;

      let style = `width: ${this.data.width}; height: ${this.data.height};`

      const d = {
        XWidth : this.data.boxWidth * 0.35,
        YHeight: this.data.boxHeight * 0.35,
        endX: this.data[this.data.type].endX,
        endY: this.data[this.data.type].endY
      }

      const { type } = this.data
      const x = ['left', 'right']
      const t = x.includes(type) ? 'X' : 'Y'
      const tn = x.includes(type) ? 'XWidth' : 'YHeight'
      let str1 = ''
      let str2 = ''

      if (type === 'left' || type === 'top') {
        if (d[`end${t}`] < d[tn]) str1 = `${type}: 0px;` 
        else  str2 = `${type}: -${d[`end${t}`]}px;`

      } else if (type === 'right' || type === 'bottom') {

        if (d[`end${t}`] > -d[tn]) str1 = `${type}: 0px;` 
        else str2 = `${type}: ${d[`end${t}`]}px;`
      }

      
      if (str1) this.setData({ style: style + str1 })
      else if (str2) this.endClose(style + str2 )
    },

    endClose: function(style) {
      this.setData({ style }, () => {
        this.close(true)
      })
    }
  }
})
