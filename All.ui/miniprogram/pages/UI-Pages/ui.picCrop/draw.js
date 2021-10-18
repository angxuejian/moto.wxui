

/**
 * 裁剪新版 canvas标签图片
 * @param {object} data 裁剪图片信息
 * @param {object} crop 新版canvas标签 实例
 * @returns 裁剪完的图片地址
 * 
 * 使用旧版canvas 绘制时超出图片大小时、不会绘制背景
 * 裁剪图片时没办法使用本地缓存图片
 */
export const drawCropImgSrc = async function(data, crop) {
  const { rotate, dpr, x, y, width, height, src } = data

  return new Promise((resolve) => {
    const canvas = crop.node
    const ctx = canvas.getContext('2d')

    canvas.width  = crop.width * dpr
    canvas.height = crop.height * dpr
    ctx.scale(dpr, dpr)

    // 绘制背景
    ctx.fillStyle = '#ededed'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 旋转
    if (rotate === 90) {
      ctx.translate(crop.width, 0)
    } else if (rotate === 180) {
      ctx.translate(crop.width, crop.height)
    } else if (rotate === 270) {
      ctx.translate(0, crop.height)
    }
    
    ctx.rotate(rotate * Math.PI / 180)
    const img = canvas.createImage()
    img.onload = () => {
      console.log(x, y)
      ctx.drawImage(img, x, y, width, height)
      resolve(canvas.toDataURL('image/png', 1))
    }
    img.src = src
  })
}






/**
 * 绘制旧版 canvas标签图片
 * @param {object} data 绘制的图片的大小信息
 * @param {string} id 旧版 canvas 标签id
 * @returns 绘制好的 本地图片地址
 * 
 * 因使用 新版canvas 绘制图片为 base64图片、
 * 而touch事件拖动base64图片太过卡顿、
 * 而使用旧版canvas绘制
 */
export const drawInitImgSrc = function(data, id = 'init') {
  return new Promise((resolve) => {
    const { x, y, width, height, src, dpr } = data
    const ctx = wx.createCanvasContext(id)
    ctx.drawImage(src, x, y, width, height)

    ctx.draw(false, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x,  y, width, height, 
          canvasId: id,
          destWidth: width * dpr,
          destHeight: height * dpr,
          success: res => {
            resolve(res.tempFilePath)
          }
        })
      }, 200)
    })
  })
}