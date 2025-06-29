import {
  WEEK, MONTH,
  LANR_ARR,
  BASIS, LUNAR_MONTH, LUNAR_DAY, SHENGXIAO, TIANGAN,
  DIZHI, SOLAR_TERMS_MIN, SOLAR_TERMS_CN,
  LUNAR_FESTIVAL, SOLAR_FESTIVAL
} from './config'
const d = new Date()

// 阴历js
class Lunar {
  constructor() {
    this.SOLAR_TERMS = [] // 24节气 对应时间表
    this.TIMESTAMP   = new Date(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`).getTime()

    this.months  = MONTH // 阳历月份
    this.weeks   = WEEK  // 周
    this.isLunar = false  // 是否获取阴历
  }

  setLunar(isl = false) {
    this.isLunar = isl
  }


  /**
   * 阳历 转 阴历
   * @param {number} sy 阳历年
   * @param {number} sm 阳历月 0-11
   * @param {number} sd 阳历日
   */
  solar_to_lunar(sy, sm, sd, week) {

    this.getSolarTerms(sy) 
    console.log('来到这里！')
    sm -= 1
    let ly, lm, ld = 0;
    console.log(sy, sm, sd)
    let day_diff = (Date.UTC(sy, sm, sd) - Date.UTC(1949, 0, 29)) / (24 * 60 * 60 * 1000) + 1;

    // 阴历年
    for (let i = 0; i < LANR_ARR.length; i++) {
      let bly = this.decimal_to_binary(LANR_ARR[i])
      day_diff -= this.getLunarYearNumber(bly)
      if (day_diff <= 0) {
        ly = BASIS + i
        day_diff += this.getLunarYearNumber(bly)
        break;
      }
    }

    // 阴历月
    const blm = this.decimal_to_binary(LANR_ARR[ly - BASIS])
    const monthDay = this.getLunarMonthNumber(blm)
    for (let i = 0; i < monthDay.length; i++) {
      day_diff -= monthDay[i]
      if (day_diff <= 0) {
        if (monthDay.length === 13) {
          let m = this.isLunarLeapMonth(blm)
          if (m < i) lm = i
          else if (m === i) lm = `闰${m}`
          else lm = i + 1
        } else {
          lm = i + 1
        }
        ld = day_diff += monthDay[i]
        break
      }
    }
    return this.getLunarDay(ly, lm, ld, { sy, sm:sm + 1, sd}, week)
  }

  /**
   * 10进制 转 2进制
   * @param {string} ly 10进制阴历年
   */
  decimal_to_binary(ly) {
    return ly.toString(2).padStart(16, 0)
  }

  /**
   * 换算 24 节气
   * @param {number} year 阳历年份
   */
  getSolarTerms(year) {

    const seconds = 31556925974.7 //31556925974.7为地球公转周期，是毫秒
    const baseYear = 1890 // 1890年为基准点
    const baseDate = Date.UTC(1890, 0, 5, 16, 2, 31) // 1890年的正小寒点：01-05 16:02:31

    const getDate = (y, i) => {
      /**
       * @param {number} y 阳历年份
       * @param {number} i 0-23节气 分钟时间索引
       */
      let date = new Date((seconds * (y - baseYear) + SOLAR_TERMS_MIN[i] * 60000) + baseDate);
      return date.getUTCDate()
    }

    let TERMS = {}
    let m = 0,
      d = 0;
    for (let i = 0; i < 24; i++) {
      d = getDate(year, i);

      if (i % 2 == 0) m++

      TERMS[`${this.padStart(m)}${this.padStart(d)}`] = SOLAR_TERMS_CN[i]
    }
    
    this.SOLAR_TERMS = TERMS
  }

  /**
   * 计算 阴历每一年的天数
   * @param {string} ly  2进制阴历年
   */
  getLunarYearNumber(ly) {
    let day = 0
    const yearDay = this.getLunarMonthNumber(ly)

    for (let i = 0; i < yearDay.length; i++) {
      day += yearDay[i]
    }
    return day
  }

  /**
   * 计算 阴历每个月的天数
   * @param {string} ly 2进制阴历年
   */
  getLunarMonthNumber(ly) {
    let monthArr = []

    const arr = Array.from(ly.slice(ly.length - 16, ly.length - 4))
    for (let i = 0; i < arr.length; i++) {
      monthArr.push(Number(arr[i]) ? 30 : 29)
    }

    // 是否有闰月
    if (this.isLunarLeapMonth(ly)) {
      monthArr.splice(this.isLunarLeapMonth(ly), 0, this.getLeapMonthNumber(ly))
    }
    return monthArr
  }

  /**
   * 阴历 确认是否闰月
   * @param {string} ly 2进制阴历年
   */
  isLunarLeapMonth(ly) {
    const monthDay = ly.slice(ly.length - 4)
    return parseInt(monthDay, 2)
  }

  /**
   * 阴历 获取闰月天数 大月(30天)还是小月(29天) 
   * @param {string} ly 2进制阴历年
   */
  getLeapMonthNumber(ly) {
    return ly.length > 16 ? 30 : 29
  }

 
  /**
   * 清洗阴历日期 将数字日期转为汉字
   * @param {number}          ly 阴历年
   * @param {number | string} lm 阴历月 1-12 | 1-13
   * @param {number}          ld 阴历日
   * @param {object}          sd 阳历年月日
   */
  getLunarDay(ly, lm, ld, sd, week) {
    let cy, cm, cd;
    ld = ld.toString()
    // if (ld == 1) {
    //   cd = `${LUNAR_DAY[10]}${LUNAR_DAY[ld - 1]}`

    // } else 
    if (ld >= 1 && ld <= 10) {
      cd = `${LUNAR_DAY[10]}${LUNAR_DAY[ld - 1]}`

    } else if (ld >= 11 && ld <= 19) {
      cd = `${LUNAR_DAY[9]}${LUNAR_DAY[ld[1] - 1]}`

    } else if (ld == 20 || ld == 30) {
      cd = `${LUNAR_DAY[ld[0] - 1]}${LUNAR_DAY[9]}`

    } else if (ld >= 21 && ld <= 29) {
      cd = `${LUNAR_DAY[11]}${LUNAR_DAY[ld[1] - 1]}`
    }

    cm = this.getLunarMonthCnName(lm)

    let tg, dz, sx;
    tg = TIANGAN[ly % 10]
    dz = DIZHI[ly % 12]
    sx = SHENGXIAO[ly % 12]
    cy = `${tg}${dz}${sx}年`

    let m = lm
    if (/闰/g.test(lm)) m = lm.split('闰')[1]
    
    const fes = [this.padStart(m), this.padStart(ld)]
    const l_fes = fes.join(' ').replace(/\s*/ig, '')

    return {
      year: cy,
      month: cm,
      day: cd,
      value: `${cy} ${cm}${cd}`,
      week: `周${this.weeks[week]}`,
      festival: [
        LUNAR_FESTIVAL[l_fes],  // 阴历节日
      ].filter(s => s),
    }
  }

  /**
   * 获取中文月份
   * @param {number} lm 阴历月
   * @param {number} ld 阴历日
   */
  getLunarMonthCnName(lm, ld) {
    lm = lm.toString()
    let m = ''

    if (/^闰/ig.test(lm)) {
      lm = lm.substring(1)
      m = `闰${LUNAR_MONTH[lm - 1]}月`
    } else {
      m = `${LUNAR_MONTH[lm - 1]}月`
    }

    return m
  }

  /**
   *  将日期统一转为2位数
   * @param {number | string} n 
   */
  padStart = function (n) {
    n = n.toString()
    return n.padStart(2, 0)
  }
}

export default Lunar