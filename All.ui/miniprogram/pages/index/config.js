import { SVG } from '../../utils/config-svg'

export const list = [
  {
    title: '小功能',
    list: [
      {
        svg: SVG.calendar,
        name: '日历',
        url: `/ui.calendar/ui.calendar`
      },
      {
        svg: SVG.removeBG,
        name: '消除背景',
        url: `/ui.removeBG/ui.removeBG`
      },
      {
        svg: SVG.waterfallsFlow,
        name: '瀑布流',
        url: `/ui.waterfallsFlow/ui.waterfallsFlow`
      }
    ]
  },
  {
    title: 'UI组件',
    list: [
      {
        svg: SVG.datePicker,
        name: '日期选择器',
        url: `/ui.datePicker/ui.datePicker`
      },
      {
        svg: SVG.imgMode,
        name: '图片模式',
        url: `/ui.imgMode/ui.imgMode`
      },
      {
        svg: SVG.nprogress,
        name: '顶部加载',
        url: `/ui.nprogress/ui.nprogress`
      },
      {
        svg: SVG.colorPicker,
        name: '颜色选择器',
        url: `/ui.colorPicker/ui.colorPicker`
      },
      {
        svg: SVG.picker,
        name: '选择器',
        url: `/ui.picker/ui.picker`
      },
      {
        svg: SVG.switch,
        name: '开关选择器',
        url: '/ui.switch/ui.switch'
      }
    ]
  },

]
