import { SVG } from '../../utils/config-svg'

const funcArr = [
  // { name: '日历', value: 'calendar' },
  { name: '消除背景', value: 'removeBG' },
  { name: '瀑布流', value: 'waterfallsFlow' },
  { name: '触摸滑动列表', value: 'touchlist' },
  // { name: '图片裁剪', value: 'drawImage' },
  { name: '电子签名', value: 'electronicSignature' },
  { name: '抽奖', value: 'lottery' },
  { name: '图片模式', value: 'imgMode' },
  { name: '图片懒加载', value: 'lazyLoadimage' },
  // { name: '英语', value: 'myEnglish' },

]

const compArr = [
  // { name: '日期选择器', value: 'datePicker' },
  { name: '顶部加载', value: 'nprogress' },
  { name: '颜色选择器', value: 'colorPicker' },
  { name: '选择器', value: 'picker' },
  { name: '开关选择器', value: 'switch' },
  { name: '抽屉', value: 'drawer' },
  { name: '录音', value : 'recorder' },
  // { name: '入住日期选择器', value: 'checkInDatePicker' },
  { name: '时间选择器', value: 'timePicker' },
]

const cleanArr = (list, isUI = false) => {
  return list.map(item => {
    return {
      svg: SVG[item.value],
      url: `${isUI ? 'ui.' : ''}${item.value}`,
      name: item.name
    }
  })
}
export const list = [
  {
    title: '小功能',
    list: cleanArr(funcArr),
    page: 'Ex-Pages'
  },
  {
    title: 'UI组件',
    list: cleanArr(compArr, true),
    page: 'Ui-Pages'
  },
]
