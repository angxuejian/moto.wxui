


/**
 * 已知圆心和半径，求圆内的某一点的xy坐标
 * 公式：
 * cx cy：圆心坐标
 * x = cx + radius * cos
 * y = cy + radius * sin
 * 
 * @param {number} radius 圆的半径和圆心点坐标
 * @param {number} index 时钟索引, 为了计算时钟数字位置，与公式无关
 * @returns { left: x, top: y }
 */
export function getClockNumbers(radius, index) {
  
  /**
   * 角度转弧度公式：deg * (Math.PI / 180)
   * 
   * 30：圆等于360度，一共12个小时，360 / 12
   * index - 3：默认坐标起点为 3点，减3将起点设置为 1点
   * index从0开始时 = 减2，index从1开始时 = 减3
   */
  const deg = (index - 3) * 30
  const angle = deg * (Math.PI / 180)

  const cx = radius
  const cy = radius

  const x = cx + radius * Math.cos(angle)
  const y = cy + radius * Math.sin(angle)

  return { left: x, top: y }
} 


/**
 * 已知xy坐标，求圆内旋转角度
 * 公式：
 * xy = 触摸位置 - dom位置 - 半径 = 圆内的xy坐标
 * atan2 = 计算原点(0,0)到坐标(x,y)的弧度
 * 
 * @param {*} touch event.touches 数组中的其中一个对象
 * @param {*} rect  dom.boundingClientRect() 的值
 * @param {*} radius 圆的半径
 * @returns 
 */
export function getClockAngle(touch, rect, radius, step = 30) {
  const { clientX, clientY } = touch
  const y = clientY - rect.top - radius
  const x = clientX - rect.left - radius
  const angle = Math.atan2(y, x)

  /**
   * 弧度转角度公式：angle * (180 / Math.PI)
   * step：每次旋转步长。小时：30度。分秒：6度
   * +90：默认坐标起点为 3点，+90将起点设置为 12点
   */
  let deg = angle * (180 / Math.PI)
  deg = Math.round(deg / step) * step;
  deg += 90
  deg = (deg + 360) % 360 // 解决第二象限为负数情况
  
  return deg
}
