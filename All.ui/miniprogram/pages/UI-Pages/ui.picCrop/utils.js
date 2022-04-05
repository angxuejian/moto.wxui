

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
        x: (imgSize.x - data.x),
        y: (imgSize.y - data.y),
      }
    case 270:
      return {
        x: imgSize.x + (data.y * -1),
        y: imgSize.y + data.x
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
  console.log(start, end, '---')
  let s = end.pageX - start.pageX
  let e = end.pageY - start.pageY

  return Math.sqrt(s * s + e * e)
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

export function getAspectFill(width, height, styleW, styleH) {

  let [x, y, w, h] = []
  const scale = width / height // 宽高比例
  
  if (width < height) {
    w = styleW 
    h = styleW / scale
    x = 0
    y = (styleH - h) / 2
    
  } else {
    w = styleH * scale
    h = styleH
    x = (styleW - w) / 2
    y = 0
  }
  return [w, h]
}
