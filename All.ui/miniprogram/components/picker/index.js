// components/picker/picker.js
// import REGION from './region'
Component({
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
    value: {
      type: String,
      optionalTypes: [Array],
      value: []
    },
    mask: {
      type:Boolean,
      value: true
    },
    mode: {
      type: String,
      value: 'selector'
    },
    date: {
      type: Number,
      value: 0
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
    HEIGHT_MAX : 45,  // .item-scroll > view 的高度
    RANGE_INDEX: [],  // range列表的索引
    TOUCH_INDEX: [],  // 触摸事件中的索引
    COLUMN_INDEX: 0,  // 列的索引
    REGION_LIST: [],  //  省市区数据
    isChange: false,   // 是否点击过确认按钮
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
      } 
    
      // 日期时间
      else if (/date|time/ig.test(this.data.mode) && (this.data.date || this.data.isChange ? show === 0 : show !== 1)) {

        let mode = 'dateTime'
        if (this.data.mode === 'dateSelector') mode = 'date'
        else if (this.data.mode === 'timeSelector') mode = 'time'

        const { list, value } = this.getDateTime(mode, this.data.date)
        this.data.range = list
        this.data.index = value
        this.filterRange()
      } 
      
      // 省市区
      else if (this.data.mode === 'region' && show === 0) {
        const reg = require('./region')
        this.data.REGION_LIST = reg.list
        
        const list = this.data.REGION_LIST
        this.data.index    = this.getCodeName(this.data.value)
        const [d1, d2] = this.data.index

        const array = [list, list[d1].children, list[d1].children[d2].children]
        
        this.data.range = array
        this.data.range_key = 'name'
        data.range_key = this.data.range_key
      }

      if (show === 0 && !/date|time/ig.test(this.data.mode)) this.filterRange()

    
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
     * 省市区 将 code 或 name 转换为 index
     */
    getCodeName: function([n1 = '110000', n2 = '110100', n3 = '110101']) {
      const data = { n1, n2, n3 }
      const list = []

      const getlist = function(array, value) {
        for (let i = 0; i < array.length; i++) {
          const el = array[i];
          if (el.code === value || el.name === value) {
            list.push(i)
            if (el.children) getlist(el.children, data['n' + (list.length + 1)])
            else {
              break
            }
          }
        }
      }
      getlist(this.data.REGION_LIST, data.n1)

      if (list.length !== 3) throw new Error('请输入对应省市区名称或区域代码')
      return list
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
      if (this.data.mode === 'region') this.regColum()
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
    
    
    getDateTime: function(mode = 'dateTime', timestamp) {
      const date = timestamp ? new Date(timestamp) : new Date()

      let list  = []
      let value = []

      if (mode === 'date' || mode === 'dateTime') {
        const d = this.getDate(date)
        list  = list.concat(d.list)
        value = value.concat(d.value)
      }

      if (mode === 'time' || mode === 'dateTime') {
        const t = this.getTime(date)
        list  = list.concat(t.list)
        value = value.concat(t.value)
      }
      
      return { list, value }
    },

    getDate: function(d) {
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

      return {
        list: [yearList, monthList, dayList],
        value: [yearValue, monthValue, dayValue]
      }
    },


    getTime: function(d) {
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
        list: [hourList, minuteList, secondsList],
        value: [hourValue, minuteValue, secondsValue]
      }
    },


    // 切换省市区列
    regColum: function() {
      const colum = this.data.COLUMN_INDEX
      const index = this.data.TOUCH_INDEX
      const list  = this.data.REGION_LIST

      const itemTouch = {
        startY: 0,
        transY: 0
      }

      if (colum === 0) {
        this.data.range.splice(1, 1, list[index[0]].children)
        this.data.range.splice(2, 1, list[index[0]].children[index[1]].children)
        this.data.touch[1] = Object.assign({}, itemTouch)
        this.data.touch[2] = Object.assign({}, itemTouch)
        this.data.TOUCH_INDEX.splice(1, 1, 0)
        this.data.TOUCH_INDEX.splice(2, 1, 0)

      } else if (colum === 1) {
        this.data.range.splice(2, 1, list[index[0]].children[index[1]].children)
        this.data.touch[2] = Object.assign({}, itemTouch)
        this.data.TOUCH_INDEX.splice(2, 1, 0)
      }

      this.setData({
        range: this.data.range,
        touch: this.data.touch,
      })
    },
 
    // 是否开启遮罩层关闭
    maskShowPicker: function() {
      if (!this.data.mask) return

      this.cancel()
    },

    onCallbackEnd: function() {
      if (this.data.isShow === 2) {
        this.data.isShow = 3
        this.setData({
          isShow: this.data.isShow
        })
      }
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
        index: this.data.TOUCH_INDEX[this.data.COLUMN_INDEX],
        indexs: this.data.TOUCH_INDEX
       })
    },


    // 确认事件
    confirm: function() {
      /**
       * bindchange: 点击确认
       */
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
      else if (/date|time/ig.test(this.data.mode)) {
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

      else if (this.data.mode === 'region') {
        const list = this.data.REGION_LIST

        const [i, ind, index] = this.data.RANGE_INDEX
        const d1 = list[i]
        const d2 = list[i].children[ind]
        const d3 = list[i].children[ind].children[index]

        data.codes = [d1.code, d2.code, d3.code]
        data.items = [d1.name, d2.name, d3.name]

        data.code  = data.codes.join(' ')
        data.item  = data.items.join(' ')
        data.index = [i, ind, index]
      }

      this.showPicker()
      this.data.isChange = true
      this.triggerEvent('change', data)
    },
  }
})
