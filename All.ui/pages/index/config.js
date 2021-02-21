import { SVG } from '../../utils/config-svg'
import { changeColor } from '../../utils/util'

const BASE = '/pages/UI-Pages'
export const list = [
  {
    title: 'UI组件',
    list: [
      {
        svg: SVG.nprogress,
        name: '顶部加载',
        url: `${BASE}/ui.calendar/ui.calendar`
      },
      {
        svg: SVG.calendar,
        name: '日历',
        url: `${BASE}/ui.calendar/ui.calendar`
      },
      {
        svg: SVG.colorPicker,
        name: '颜色选择器'
      }
    ]
  }

]
