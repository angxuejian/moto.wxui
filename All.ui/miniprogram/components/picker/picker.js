// components/picker/picker.js
Component({

  options:{
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    range: {
      type: Array,
      value: []
    },
    range_key: {
      type: String,
      value: 'value'
    },
    mask: {
      type:Boolean,
      value: true
    },
    mode: {
      type: String,
      value: 'selector'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: 0, // 是否打开 colorPicker 组件 0:真关闭 1:打开 2:伪关闭
    default: {
      startY: 0, // 手指触摸开始 y轴
      transY: 0, // 计算要 translateY 的值
    },
    touch: [],
    HEIGHT_MAX : 45, // .item-scroll > view 的高度
    RANGE_INDEX: 0,  // range列表的索引
    TOUCH_INDEX: 0,  // touch列表的索引

  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 对外实例方法 - 调用实例打开组件
    open: function() {
      this.showPicker()
    },


    /**
     * -------------------------------
     * -------------------------------
     * -------------------------------
     * -------------------------------
     * 分割线 - 分割线
     * 
     * 下面是 私有方法！ 不要随意调用哦！！！
     */

    // 打开 或 关闭 Picker 组件
    showPicker: function () {
      let show = this.data.isShow
      if (!show) this.data.isShow = 1
      else if (show === 1) this.data.isShow = 2
      else if (show === 2) this.data.isShow = 1

      let el = ''
      if (this.data.range.length && this.data.mode === 'selector') {
        this.data.range = [this.data.range]
      } 

      if (this.data.range.length && this.data.range[0].length) {
        el = this.data.range[0][0]
        this.data.range.forEach(() => {
          this.data.touch.push(JSON.parse(JSON.stringify(this.data.default)))
        })
      }

      if (typeof el === 'object') this.data.isShowKey = true
      else this.data.isShowKey = false

      this.setData({
        range : this.data.range, 
        isShow: this.data.isShow,
        isShowKey: this.data.isShowKey
      })
    },

    // 是否开启遮罩层关闭
    maskShowPicker: function() {
      if (!this.data.mask) return

      this.showPicker()
    },

    /**
     *  手指触摸 - 开始
     * @param {object}} event 触摸参数
     */
    touchStart: function(event) {
      const { touch }   = this.data
      const { touches } = event
      const { index }   = event.currentTarget.dataset

      const item = touch[index]
      item.startY = -(item.transY) + touches[0].pageY

      this.data.TOUCH_INDEX = index
    },

    /**
     *  手指触摸 - 移动
     * @param {object}} event 触摸参数
     */
    touchMove: function(event) {
      const { touch, HEIGHT_MAX, range } = this.data
      const { touches } = event
      const { index }   = event.currentTarget.dataset

      const leng = range[index].length      
      const item = touch[index]

      const y    = item.startY - touches[0].pageY


      if (y < -HEIGHT_MAX) {
        item.transY = 0;
        return
      }

      if (y >= (HEIGHT_MAX * leng)) {
        item.transY = HEIGHT_MAX * (leng - 1);
        return
      } 

      item.transY = -y

      this.data.TOUCH_INDEX = index
      this.setData({
        ['touch['+ index + '].transY']: item.transY
      })
    },


    /**
     *  手指触摸 - 结束
     */
    touchEnd: function(event) {

      const { touch, HEIGHT_MAX, range } = this.data
      const { index }  = event.currentTarget.dataset

      const leng = range[index].length
      const item = touch[index]
  
      this.data.RANGE_INDEX = Math.round(Math.abs(item.transY) / HEIGHT_MAX)

      if (this.data.RANGE_INDEX > (leng - 1)) this.data.RANGE_INDEX = leng - 1
      if (this.data.RANGE_INDEX < 0) this.data.RANGE_INDEX = 0

      item.transY = -(HEIGHT_MAX * this.data.RANGE_INDEX)

      this.data.TOUCH_INDEX = index

      this.setData({
        ['touch[' + index + '].transY']: item.transY
      })

      this.column()
    },

    // 清空事件
    cancel: function() {
      /**
       * bindcancel: 点击取消
       */
      this.showPicker()
      this.triggerEvent('cancel')
    },

    // 选择列事件
    column: function() {
      /**
       * bindcolumnchange: 列改变时触发
       */

       this.triggerEvent('columnchange', {
        column: this.data.TOUCH_INDEX,
        index: this.data.RANGE_INDEX
       })
    },


    // 确认事件
    confirm: function() {
      /**
       * bindchange: 点击确认
       */
      this.showPicker()

      const data = {
        index: this.data.RANGE_INDEX,
        item : this.data.range[this.data.TOUCH_INDEX][this.data.RANGE_INDEX]
      }

      if (this.data.mode === 'multiSelector') {
        data.column = this.data.TOUCH_INDEX
        delete data.name
      }
      this.triggerEvent('change', data)
    },
  }
})
