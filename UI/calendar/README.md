

# calendar

### 目标
弄懂日历！+ 日历Ui ？

### 历

#### 1. 阳历

- 阳历 每月日期都为固定，把**闰年**问题解决即可
- 闰年又分 “普通闰年” 和 “世纪闰年”
    - 普通闰年：公历年份是4的倍数的，且不是100的倍数，为普通闰年（如2004年、2020年就是闰年）。
    - 世纪闰年：公历年份是整百数的，必须是400的倍数才是世纪闰年（如1900年不是世纪闰年，2000年是世纪闰年）。


#### 2. 阴阳历（农历）

##### 2.1. 阴阳历怎么来的？

- 农历是中国传统历法，也有干支历、华历、夏历、中历等名称。**农历是阴阳历的一种，在民间通常被错误地称作阴历。** 农历取月相的变化周期即朔望月为月的长度，加入干支历“二十四节气”成分，参考太阳回归年为年的长度，通过设置闰月以使平均历年与回归年相适应。农历是以华历（阴历）为基础，融合阳历成分而成的一种历法。所以我国的农历从严格意义上说不应该叫阴历，而是阴阳合历；[详看百度百科](https://baike.baidu.com/item/%E5%86%9C%E5%8E%86/67925)

- 所以平常我们说的阴历其实是**阴阳历或农历。** 那阴阳历是怎么来的？主要是天文台夜观天象得来的，并非向阳历那般有固定日期。现有农历数据只有1949年-2100年 200年的数据 

    Ps: 在[中国科学院紫金山天文台官网](http://www.pmo.ac.cn/)上没找到数据源，如有大佬熟知，望告知，issues解小弟疑惑；

    例：

    ```
    // 1949年 - 2100年 农历年份

    const lunarYearArr = [
      0x0b557, //1949
      0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
      .....,
      0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
      0x0d520 //2100
    ]
    ```
    [关于这些年份的解释- 3.1 农历年份数组怎么用？怎么看？](#threeone)


##### 2.2 如何计算农历日期

**（输入的阳历日期 − 阳历基准 + 1）=（输出的农历日期 − 农历基准 + 1）= 相差天数**

- 先计算输入的阳历日期与阳历基准之间相差天数，**计算出的相差天数是固定的。** 

- 之后在根据 **相差天数反推出农历日期**


##### 2.3 确认阳历基准与农历基准
基准可以是日历上的任意一天，但是**阳历基准和农历基准必须是同一天。** 要注意的是设置基准后，基准以前的日期将计算错误，只能计算基准以后的。

基准年份要与农历年份数组第一个值相对应，要不然也会出现计算误差。

例：
```
const solarYear = 2019 // 阳历年份基准

const lunarYearArr = [
    0x0a930, //2019
    ......,
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
    0x0d520 //2100
] // 农历年份 数组，第一个必须为 2019; 也就是阳历年份基准

```

##### 2.4 计算农历年份
- 使用 相差天数 依次减去 农历数组中每一年的天数
- 当 相差天数 <= 0 时 **即确认当前农历年份**

##### 2.5 计算农历月份
- 确认农历年份后，最后一次减去的年份 + 相差天数 = 农历年份的天数

- 使用 农历年份的天数 依次减去 农历年份中的每月的天数
- 当 农历年份的天数 <= 0 时 **即确认当前农历月份**

##### 2.6 计算农历日份
- 确认农历月份后，最后一次减去的月份 + 农历年份的天数 = **当前农历日份**


#### 3. 阴阳历（农历）扩展

##### 3.1 <span id="threeone">农历年份数组怎么用？怎么看？</span>
```
const lunarYearArr = [
    0x0b557, //1949
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
    .....,
]
```
将 0x0b557 除 0x 外的 0b557(16进制) 转为 二进制，会得到以下数据：

0000 1011 0101 0101 0111

分别表示：

xxxx | xxxx | xxxx | xxxx | xxxx
---  | ---  | ---  | ---  | ---
20-17| 16-12| 12-9 | 8-5  |	4-1

1-4位： 表示是否为闰年，是 则为闰年的月份； 否 为 0；

5-16位： 除闰年外的正常月份，1为 30天大月；0为 29天小月；**(1月-12月的对应顺序为16位-5位)**

17-20位：表示闰月为 大月还是小月，有闰月时才有意义

例：
```
>> 无闰月版
2019年的 16进制为0x0a930 二进制为 1010100100110000

1010 1001 0011 0000; 可以看到 17-20位是没有的，因为2019年没有闰月

2019年全年月份1-12月
30,29,30,29,  30,29,29,30,  29,29,30,30


------
>> 有闰月-小月版
2020年的 16进制为0x07954 二进制为111100101010100 //这里的二进制只有15位, 手动添0，添置到16位

0111 1001 0101 0100; 1-4位 0100 转成 十进制为 4 所以是闰4月; 17-20位不存在则为小月29天

2020年全年月份 1-12月 + 闰4月 = 13月
1-12月: 29,30,30,30,        30,29,29,30  29,30,29,30
闰4月:                 29,
1-13月: 29,30,30,30,   29,  30,29,29,30  29,30,29,30


------
>> 有闰月-大月版
2036年的 16进制为0x1d0b6 二进制为11101000010110110 //这里的二进制只有17位，手动添0，添置到20位

0001 1101 0000 1011 0110; 1-4位 0110 转成 十进制为 6 所以是闰6月; 17-20位存在则为大月30天

2036年全年月份 1-12月 + 闰6月 = 13月
1-12月: 30,30,29,30, 29,29,       29,29  30,29,30,30
闰6月:                       30,
1-13月: 30,30,29,30, 29,29,  30,  29,29  30,29,30,30
```

##### 3.2 如何计算农历年份天数
看完[3.1 农历年份数组怎么用？怎么看？](#threeone)之后就应该可以明白

知道 每月天数后相加即可 得出一年总天数; 如当前年有闰月，别忘了加闰月月份。

##### 3.3 天干地支
天干=（公历年份）/10，所得余数

地支=（公历年份）/12，所得余数

生肖与地支公式一样

天干 |甲 | 乙 | 丙 | 丁  | 戊  | 己  | 庚 | 辛  | 壬  | 癸
--- | ---| ---| ---| --- | --- | --- | ---| ---| --- | ---
余数 | 4  | 5  | 6  | 7   | 8   | 9   | 0  | 1  | 2   | 3


地支 |子 |丑 | 寅 | 卯 | 辰 | 巳 | 午 | 未 | 申 | 酉 | 戌 | 亥 
--- | ---| ---| ---| ---| ---| ---| ---| ---| --- | ---| ---| ---
余数   | 4  | 5  | 6  | 7  |  8 | 9  | 10 | 11 | 12  | 1  | 2  | 3 


生肖 |鼠 |牛 | 虎 | 兔 | 龙 | 蛇 | 马 | 羊 | 猴 | 鸡 | 狗 | 猪 
--- | ---| ---| ---| ---| ---| ---| ---| ---| --- | ---| ---| ---
余数   | 4  | 5  | 6  | 7  |  8 | 9  | 10 | 11 | 12  | 1  | 2  | 3 

### 具体实现

github: https://github.com/angxuejian/moto.wxui/tree/main/UI/calendar



### 参考文献
[limengwe-关于日历实现代码里0x04bd8, 0x04ae0, 0x0a570的解释](https://blog.csdn.net/onlyonecoder/article/details/8484118)

[xm2by-日历的公历转农历](https://blog.csdn.net/XuM222222/article/details/82012802)

[xm2by-原生js实现公历转农历](https://blog.csdn.net/XuM222222/article/details/82022345)

[天干地支-百度百科](https://baike.baidu.com/item/%E5%A4%A9%E5%B9%B2%E5%9C%B0%E6%94%AF)


**本文农历知识均为以上文章提供**

[闰年-百度百科](https://baike.baidu.com/item/%E9%97%B0%E5%B9%B4/27098)