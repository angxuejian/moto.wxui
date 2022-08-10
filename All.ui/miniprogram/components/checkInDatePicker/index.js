// components/checkInDatePicker/index.js
import Calendar from '../../utils/calendar/index'
const Calen = new Calendar()

Component({

  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    weeks: Calen.weeks,
    nightNumber: 0,
    startName: '',
    endName: '',
    months: [
      { month: '2022年08月', days: [1, 2, 3, 4, 5, 6, 7 ,8, 9] },
      { month: '2022年09月', days: [1, 2, 3, 4, 5, 6, 7 ,8] },
      { month: '2022年010月', days: [1, 2, 3, 4, 5, 6, 7 ,8] },
      { month: '2022年01月', days: [1, 2, 3, 4, 5, 6, 7 ,8] },
      { month: '2022年02月', days: [1, 2, 3, 4, 5, 6, 7 ,8] },
      { month: '2022年03月', days: [1, 2, 3, 4, 5, 6, 7 ,8] },
      { month: '2022年04月', days: [1, 2, 3, 4, 5, 6, 7 ,8] },
      { month: '2022年04月', days: [1, 2, 3, 4, 5, 6, 7 ,8] },

      { month: '2022年04月', days: [1, 2, 3, 4, 5, 6, 7 ,8] },
      { month: '2022年04月', days: [1, 2, 3, 4, 5, 6, 7 ,8] },
      { month: '2022年04月', days: [1, 2, 3, 4, 5, 6, 7 ,8] },
      { month: '2022年04月', days: [1, 2, 3, 4, 5, 6, 7 ,8] },
      { month: '2022年04月', days: [1, 2, 3, 4, 5, 6, 7 ,8] },

    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    open: function() {
      this.selectComponent('#drawerMoto').open()
    }
  }
})
