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
    index: {
      type: Number,
      optionalTypes: [Array],
      value: [0]
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
    RANGE_INDEX: [],  // range列表的索引
    TOUCH_INDEX: [],  // 触摸事件中的索引
    COLUMN_INDEX: 0,  // 列的索引

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

      let data = {
        isShow: this.data.isShow,
      }

   
      this.filterMode(show, data)


    },


    filterMode: function(show, data) {
    
      // 单列 or 多列
      if ((this.data.mode === 'selector' || this.data.mode === 'multiSelector') && show === 0) {
        if (this.data.range.length && this.data.mode === 'selector' && !this.data.range[0][0]) {
          this.data.range = [this.data.range]
        } 

        this.filterRange()
      } 
    
      // 日期时间
      else if (this.data.mode === 'dateTimeSelector' && show !== 1) {
        const { list, value } = this.getDateTime()
        this.data.range = list
        this.data.index = value

        this.filterRange()
      }

    
      data.range       = this.data.range
      data.isShowKey   = this.data.isShowKey

      this.setData(data)
    },


    filterRange: function() {
      let el = ''

      if (this.data.range.length && this.data.range[0].length) {
        el = this.data.range[0][0]

        const list = typeof this.data.index === 'number' ? [this.data.index] : this.data.index
        
        this.data.TOUCH_INDEX = []
        this.data.range.forEach((item, index) => {
          this.data.touch.push(JSON.parse(JSON.stringify(this.data.default)))
          this.data.TOUCH_INDEX.push(list[index] || 0)
        })
      }

      this.setIndex()

      if (typeof el === 'object') this.data.isShowKey = true
      else this.data.isShowKey = false
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

      this.data.COLUMN_INDEX = index
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

      this.data.COLUMN_INDEX = index
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
      
      let i = Math.round(Math.abs(item.transY) / HEIGHT_MAX)
 
      if (i > (leng - 1)) i = leng - 1
      if (i < 0) i = 0

      item.transY = -(HEIGHT_MAX * i)

      this.data.COLUMN_INDEX = index
      this.data.TOUCH_INDEX.splice(index, 1, i)
      this.setData({
        ['touch[' + index + '].transY']: item.transY,
      })

      if (this.data.mode === 'multiSelector') this.column();
     
    },

    /**
     * 默认选择 range 的第几个(下标)
     */
    setIndex: function() {
      const { range, HEIGHT_MAX, touch } = this.data
   
      const data = {}

      this.data.TOUCH_INDEX =  this.data.TOUCH_INDEX.map((item, index) => {
        const leng = range[index].length

        if (item > (leng - 1)) item = leng - 1
        if (item < 0) item = 0

        return item
      })

      this.data.TOUCH_INDEX.forEach((item, index) => {
        if (item === 0) return;

        touch[index].transY = -(HEIGHT_MAX * item)
        data['touch[' + index + '].transY'] = touch[index].transY
      })

      if (Object.keys(data).length) {
        this.setData(data)
      }
    },

    formatNumber: function (n) {
      n = n.toString()
      return n[1] ? n : `0${n}`
    },
    
    
    getDateTime: function() {
      const d = new Date()
    
      const year = d.getFullYear() - 21
      const yearValue = d.getFullYear() - year
      const yearList = []
      for (let i = 0; i < 50; i++) {
        yearList.push(year + i + '年')
      }
    
      const monthList = []
      const monthValue = d.getMonth()
      for (let i = 0; i < 12; i++) {
        monthList.push(this.formatNumber(i + 1) + '月')
      }
    
      const dayList = []
      const dayValue = d.getDate() - 1
      for (let i = 0; i < 31; i++) {
        dayList.push(this.formatNumber(i + 1) + '日')
      }
    
      const hourList = []
      const hourValue = d.getHours()
      for (let i = 0; i < 24; i++) {
        hourList.push(this.formatNumber(i) + '时')
      }
    
      const minuteList = []
      const minuteValue = d.getMinutes()
      const secondsList = []
      const secondsValue = d.getSeconds()
      for (let i = 0; i < 60; i++) {
        i = this.formatNumber(i)
        minuteList.push(i + '分')
        secondsList.push(i + '秒')
      }
    
      return {
        list: [yearList, monthList, dayList, hourList, minuteList, secondsList],
        value: [yearValue, monthValue, dayValue, hourValue, minuteValue, secondsValue]
      }
    },


    // 是否开启遮罩层关闭
    maskShowPicker: function() {
      if (!this.data.mask) return

      this.cancel()
    },

    // 清空事件
    cancel: function() {
      /**
       * bindcancel: 点击取消
       */
      if (this.data.mode === 'selector') {
        this.data.TOUCH_INDEX = JSON.parse(JSON.stringify(this.data.RANGE_INDEX))
        this.setIndex()
      }
      this.showPicker()
   
      this.triggerEvent('cancel')
    },

    // 选择列事件
    column: function() {
      /**
       * bindcolumnchange: 列改变时触发
       */
       this.triggerEvent('columnchange', {
        column: this.data.COLUMN_INDEX,
        index: this.data.TOUCH_INDEX[this.data.COLUMN_INDEX]
       })
    },


    // 确认事件
    confirm: function() {
      /**
       * bindchange: 点击确认
       */
      this.showPicker()
      const { COLUMN_INDEX: i } = this.data
      let data = {}
 
      this.data.RANGE_INDEX = JSON.parse(JSON.stringify(this.data.TOUCH_INDEX))

      // 多列
      if (this.data.mode === 'multiSelector') {
        const list = []
        data.index = this.data.RANGE_INDEX

        this.data.RANGE_INDEX.forEach((item, index) => {
          list.push(this.data.range[index][item])
        })
        data.item = list
      
      
      // 单列
      } else if (this.data.mode === 'selector') {
        const index = this.data.RANGE_INDEX[i]
        data = {
          index,
          item : this.data.range[i][index]
        }
      } 
      
      // 日期时间
      else if (this.data.mode === 'dateTimeSelector') {
        const list_cn = []
        const list = []

        this.data.RANGE_INDEX.forEach((item, index) => {
          const va = this.data.range[index][item]
          list_cn.push(va)
          list.push(va.substr(0, va.length - 1))
        })

        const date = list.slice(0, 3).join('-')
        const time = list.slice(3).join(':')
    
        data.list_cn = list_cn
        data.list = list
        data.value = `${date} ${time}`
      }
      
      this.triggerEvent('change', data)
    },
  }
})
