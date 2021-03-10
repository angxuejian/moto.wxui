import { SVG } from '../../utils/config-svg'
import { changeColor } from '../../utils/util'

const BASE = '/pages/UI-Pages'
export const list = [
  {
    title: '小功能',
    list: [
      {
        svg: SVG.calendar,
        name: '日历',
        url: `${BASE}/ui.calendar/ui.calendar`
      },
      {
        svg: SVG.removeBG,
        name: '消除背景',
        url: `${BASE}/ui.removeBG/ui.removeBG`
      },
    ]
  },
  {
    title: 'UI组件',
    list: [
      
      {
        svg: SVG.datePicker,
        name: '日期选择器',
        url: `${BASE}/ui.datePicker/ui.datePicker`
      },
      {
        svg: SVG.nprogress,
        name: '顶部加载',
        url: `${BASE}/ui.nprogress/ui.nprogress`
      },
      {
        svg: SVG.colorPicker,
        name: '颜色选择器',
        url: `${BASE}/ui.colorPicker/ui.colorPicker`
      },
    ]
  },

]
