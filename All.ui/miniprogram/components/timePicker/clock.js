

export function getClockNumbers(radius, index) {
  
  const deg = (index - 3) * 30
  const angle = deg * (Math.PI / 180)

  const x = radius + radius * Math.cos(angle)
  const y = radius + radius * Math.sin(angle)

  return { left: x, top: y, angle }
  /**
   * 角度转弧度公式: deg * (Math.PI / 180)
   * 30: 圆等于360度，一共12个小时，360 / 12
   * index - 3: 默认坐标起点为 3点，减3将起点设置为 1点
   * index从0开始时 = 减2，index从1开始时 = 减3
   */


  /**
   * 已知圆心和半径，求圆某一坐标点公式：
   * x1 = x0 + radius * cos
   * y1 = y0 + radius * sin
   * 
   * x0 y0: 圆心坐标
   * radius：圆的半径和圆心点坐标
   */
} 