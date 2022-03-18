import { SVG } from '../../utils/config-svg'

const funcArr = [
  { name: '日历', value: 'calendar' },
  { name: '消除背景', value: 'removeBG' },
  { name: '瀑布流', value: 'waterfallsFlow' },
  { name: '触摸滑动列表', value: 'touchlist' },
  { name: '图片裁剪', value: 'picCrop' },
  { name: '电子签名', value: 'electronicSignature' },
  { name: '抽奖', value: 'lottery' }
]

const compArr = [
  { name: '日期选择器', value: 'datePicker' },
  { name: '图片模式', value: 'imgMode' },
  { name: '顶部加载', value: 'nprogress' },
  { name: '颜色选择器', value: 'colorPicker' },
  { name: '选择器', value: 'picker' },
  { name: '开关选择器', value: 'switch' },
  { name: '抽屉', value: 'drawer' },
]

const cleanArr = (list) => {
  return list.map(item => {
    return {
      svg: SVG[item.value],
      url: `ui.${item.value}`,
      name: item.name
    }
  })
}
export const list = [
  {
    title: '小功能',
    list: cleanArr(funcArr)
  },
  {
    title: 'UI组件',
    list: cleanArr(compArr)
  },
]
