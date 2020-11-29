
import { LANR_ARR, BASIS, LUNAR_MONTH, LUNAR_DAY, SHENGXIAO, TIANGAN, DIZHI, SOLAR_TERMS_MIN, SOLAR_TERMS_CN  } from './config'


class Canlendar {

    // 阳历 转 农历
    solar_to_lunar = function (sy, sm, sd, done) {
      /*
        sy  : number  => 阳历年
        sm  : number  => 阳历月 0-11
        sd  : number  => 阳历日
        done: boolear => 是否 return 年月日
      */
      sm -= 1
      let ly, lm, ld;
      let day_diff = (Date.UTC(sy, sm, sd) - Date.UTC(1949, 0, 29)) / (24 * 60 * 60 * 1000) + 1;

      // 农历年
      for (let i = 0; i < LANR_ARR.length; i++) {
        let bly = this.clear_binary(LANR_ARR[i])

        day_diff -= this.lunar_year(bly)
        if (day_diff <= 0) {
          ly = BASIS + i
          day_diff += this.lunar_year(bly)
          break;
        }
      }

      // 农历月
      const blm = this.clear_binary(LANR_ARR[ly - BASIS])
      const monthDay = this.month_day(blm)
      for (let i = 0; i < monthDay.length; i++) {
        day_diff -= monthDay[i]
        if (day_diff <= 0) {
          if (monthDay.length === 13) {
            let m = this.leap_month(blm)
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
      return this.clear_day(ly, lm, ld, done)
    }

    // 计算 农历每一年的天数
    lunar_year = function (ly) {
      /*
        ly: string => 2进制农历年
      */
      let day = 0
      const yearDay = this.month_day(ly)

      for (let i = 0; i < yearDay.length; i++) {
        day += yearDay[i]
      }
      return day
    }

    // 农历 确认每个月的天数
    month_day = function (ly) {
      /*
        ly: string => 2进制农历年
      */
      let monthArr = []

      const arr = Array.from(ly.slice(ly.length - 16, ly.length - 4))
      for (let i = 0; i < arr.length; i++) {
        monthArr.push(Number(arr[i]) ? 30 : 29)
      }

      // 是否有闰月
      if (this.leap_month(ly)) {
        monthArr.splice(this.leap_month(ly), 0, this.leap_day(ly))
      }
      return monthArr
    }

    // 农历 确认是否闰月
    leap_month = function (ly) {
      /*
        ly: string => 2进制农历年
      */
      const monthDay = ly.slice(ly.length - 4)
      return parseInt(monthDay, 2)
    }

    // 农历 确认闰月是 大月(30天)还是小月(29天) 
    leap_day = function (ly) {
      /*
        ly: string => 2进制农历年
      */
      return ly.length > 16 ? 30 : 29
    }

    // 10进制 转 2进制
    clear_binary = function (ly) {
      /*
        ly: string => 10进制农历年
      */
      return ly.toString(2).padStart(16, 0)
    }

    // 清洗农历日期 将数字日期转为汉字
    clear_day = function(ly, lm, ld, done) {
      /*
        ly  : number          => 农历年
        lm  : number | string => 农历月 1-12 | 1-13
        ld  : number          => 农历日
        done: boolear         => 是否return 年月日
      */
      let cy, cm, cd;
      ld = ld.toString()
      if (ld == 1) { 
        cd = this.clear_cn_month(lm)

      } else if (ld >= 2 && ld <= 10) {
        cd = `${LUNAR_DAY[10]}${LUNAR_DAY[ld - 1]}`

      } else if (ld >= 11 && ld <= 19) {
        cd = `${LUNAR_DAY[9]}${LUNAR_DAY[ld[1] - 1]}`

      } else if (ld == 20 || ld == 30) {
        cd = `${LUNAR_DAY[ld[0] - 1]}${LUNAR_DAY[9]}`
        
      } else if (ld >= 21 && ld <= 29){
        cd = `${LUNAR_DAY[11]}${LUNAR_DAY[ld[1] - 1]}`
      }

      cm = this.clear_cn_month(lm)

      let tg, dz, sx;
      tg = TIANGAN[ly % 10]
      dz = DIZHI[ly % 12]
      sx = SHENGXIAO[ly % 12]
      cy = `${tg}${dz}${sx}年`



      if (!done) return cd
      else return `${cy} ${cm}${cd}`
    }

    // 获取中文月份
    clear_cn_month = function(lm, ld) {
      /*
        lm: number => 农历月
        ld: number => 农历日
      */
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

    // 换算 24 节气
    getSolarTerms = (year) => {

      /*
        year: number => 阳历年份
      */

      const seconds  = 31556925974.7 //31556925974.7为地球公转周期，是毫秒
      const baseYear = 1890 // 1890年为基准点
      const baseDate = Date.UTC(1890, 0, 5, 16, 2, 31) // 1890年的正小寒点：01-05 16:02:31

      const getDate = (y, i) => {
        /*
          y: number => 阳历年份
          i: number => 0-23节气 分钟时间索引
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

      return TERMS
      }

    // 将日期统一转为2位数
    padStart = function(n) {
      n = n.toString()
      return n.padStart(2, 0)
    }
}


export { Canlendar }
