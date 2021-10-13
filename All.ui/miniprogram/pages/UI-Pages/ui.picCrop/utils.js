

/**
 * 根据不同 旋转度数 求出canvas中 x, y 坐标
 * @param {number} deg 旋转度数
 * @param {*} imgSize  图片大小与裁剪框的差值
 * @param {*} data     图片的 x, y 坐标
 * @returns {object} {x, y} -> 
 */
export const getRotateAxis = function(deg, imgSize, data) {
  switch (deg) {

    case 0:
      return {
        x: imgSize.x + data.x,
        y: imgSize.y + data.y
      }
    case 90:
      return {
        x: imgSize.x + data.y, 
        y: imgSize.y + (data.x * -1),
      }
    case 180:
      return {
        x: (imgSize.x + data.x) * -1,
        y: imgSize.y - data.y,
      }
    case 270:
      return {
        x: (imgSize.x + data.y) * -1,
        y: 0
      }
    default:
      break;
  }
}

/**
 * 
 * @param {Object} start touches[0]
 * @param {Object} end   touches[1]
 * @returns 两指的距离
 */
export const getDistance = function (start, end) {
  let s = Math.abs(end.pageX - start.pageX) * 2
  let e = Math.abs(end.pageY - start.pageY) * 2

  return Math.sqrt(s + e)
}


/**
 * 获取 新版canvas标签 实例对象
 * @param {string} id  新版canvas 标签的id 
 * @returns canvas标签对象
 */
export const getCanvasNode =  function (id = 'crop') {
  return new Promise((resolve) => {
    wx.createSelectorQuery()
      .select('#' + id)
      .fields({
        node: true,
        size: true,
      })
      .exec(res => {
        resolve(res[0])
      })
  })
}

/**
 * 获取图片以宽 缩放比率后的宽高大小
 * @returns 缩放比率后的宽高大小
 */
export const getWidthFix = function (width, height, styleW, styleH) {
  let [w, h, s] = []

  // 获取图片本身宽高 与 样式宽高的比例
  s = styleW / width

  w = styleW
  h = styleH * s

  return [w, h]
}

/**
 * 获取图片以高 缩放比率后的宽高大小
 * @returns 缩放比率后的宽高大小
 */
export const getHeightFix = function (width, height, styleW, styleH) {

  let [w, h, s] = []

  // 获取图片本身宽高 与 样式宽高的比例
  s = styleH / height

  w = styleW * s
  h = styleH

  return [w, h]
}