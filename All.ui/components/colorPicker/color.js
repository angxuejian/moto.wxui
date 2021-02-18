
// hsv 转 rgb
const hsv_rgb = (h, s, v) => {
      /*
            h: number => 色调 0 - 360
            s: number => 饱和度 0 - 100
            v: number => 明度 0 - 100
      */

      // 将 坐标值 转换为 百分比 0% - 100%
      s = s / 100
      v = v / 100
      
      const i = parseInt(h / 60), // 将 坐标值 转换为 角度 0° - 360°
          f = h / 60 - i,
          p = v * (1 - s),
          q = v * (1 - f * s),
          t = v * (1 - (1 - f) * s);
      
      const list = [
            [v, t, p],
            [q, v, p],
            [p, v, t],
            [p, q, v],
            [t, p, v],
            [v, p, q]
      ]

      return rgb_hex(list[i % 6].map(hr_round)) // i mod 6: 是因为有六种可能性
}

// rgb 转 hsv
const rgb_hsv = (r, g, b) => {
       /*
            r: number => red 0 - 255
            g: number => green 0 - 255
            b: number => blue 0 - 255
      */

      const [red, green, blue] = [r, g, b].map(rh_range)

      let h = 0,
          s = 0,
          v = 0;

      const max = Math.max(red, green, blue),
            min = Math.min(red, green, blue);

      const l = max - min
      
      v = max
      s = l / max

      const data = {
            [red]  : (green - blue) / l % 6,
            [green]: 2 + (blue - red) / l,
            [blue] : 4 + (red - green) / l,
      }

      h = data[max] / 6
      if (h < 0) h + 360

      return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
      }
}

// rgb 转 hex
const rgb_hex = rgb => {
      /*
            rgb: array => [0-255,0-255,0-255]
      */

      return {
            hex: `#${rgb.map(rh_string).join(' ').replace(/\s*/g, '')}`,
            rgb: `rgb(${rgb.join()})`
      }
}

// hex 转 rgb
const hex_rgb = hex => {
      /*
            hex: array => [0-9a-fA-F,0-9a-fA-F,0-9a-fA-F]
      */
     return hex.map(hr_number)
}


// hsv 转 rgb | 转为rgb范围
const hr_round = n => {
      // list[i % 6] 取出值范围均为 [0-1, 0-1, 0-1] 
      // 依次 * 255 后 转为rgb 0-255 的范围 [0-255, 0-255, 0-255]
      return Math.round(n * 255)
}

// rgb 转 hsv | 转为hsv范围
const rh_range = n => {
      // n 的范围为 0-1
      // 依次 / 255 后 转为hsv 的范围 [0-360, 0-100, 0-100]
      return n / 255
}

// rgb 转 hex | 转为hex范围
const rh_string = s => {
      // 将 0-255 转为 [0-9a-fA-F]
      let str = s.toString(16)
      return str.padStart(2, '0').toUpperCase()
}

// hex 转 rgb | 转为rgb范围
const hr_number = s => {
      // 将 [0-9a-fA-F] 转为 0-255
      return parseInt(s, 16)
}


module.exports = {
      hsv_rgb,
      rgb_hsv,

      rgb_hex,
      hex_rgb
}
