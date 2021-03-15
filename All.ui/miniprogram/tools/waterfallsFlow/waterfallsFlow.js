// tools/waterfallsFlow/waterfallsFlow.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    images: [
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201606%2F27%2F20160627232611_FrVUd.thumb.700_0.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1618403657&t=0b94299daee59396de8e8301cc938cd8',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic4.zhimg.com%2F50%2Fv2-2deb2169ad36b57dbd745e1c354cc5fb_hd.jpg&refer=http%3A%2F%2Fpic4.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1618403680&t=c743228015234316ff3393bc00f63d13',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic3.zhimg.com%2F50%2Fv2-11a0cdeca998dd7c32292dec5d8aa88a_hd.jpg&refer=http%3A%2F%2Fpic3.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1618403696&t=7d7c5760dd55c5a6d25a047a1c79f863',
      
      'https://t7.baidu.com/it/u=2890384270,3204798551&fm=193&f=GIF',
      'http://n.sinaimg.cn/ent/4_img/upload/a57892fc/125/w690h1035/20201213/7481-kffctca7087176.jpg',
      'https://i04picsos.sogoucdn.com/0c0004d4deba0e63',
      
      'https://ww3.sinaimg.cn/bmiddle/007cqfA0gy1gokwwveiiij30u013z4qp.jpg',
      'https://ww2.sinaimg.cn/bmiddle/005OXwbzgy1gokwyr4r1nj327z280e4f.jpg',
      'https://ww2.sinaimg.cn/bmiddle/005OXwbzgy1gokwypookoj333v3404qu.jpg',
      'https://ww3.sinaimg.cn/bmiddle/005OXwbzgy1gokwymvplgj318f1uoahb.jpg'
    ],

    left : {
      height: 0,
      list  : [],
    },
    right: {
      height: 0,
      list  : []
    },

    windowWidth: 0,
  },

  lifetimes: {
    attached: function() {
      this.wxFalls()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 动手做 瀑布流
     */
    diyFalls: function() {
      wx.getSystemInfo({
        success: (res) => {
          // 0.48: view的宽度为 48%
          this.data.windowWidth = res.windowWidth * 0.48
        },
      })
    },

    /**
     * 微信提供的 瀑布流
     */
    wxFalls: function() {
      let { left, right, images } = this.data

      for (let i = 0; i < images.length; i++) {
        if (left.list.length <= right.list.length) {
          left.list.push(images[i])
        } else {
          right.list.push(images[i])
        }        
      }
      

        this.setData({
          left,
          right
        })
    },


    // 图片加载完成
    onCallbackLoad: function(event) {
      const { width, height } = event.detail
      const { index }         = event.currentTarget.dataset

      const { windowWidth, images } = this.data

      const scale = windowWidth / width
      const h     = height * scale

      const item = {
        height: h,
        src   : images[index]
      }

      let { left, right } = this.data

      if (left.height <= right.height) {
        left.height += h
        left.list.push(item)
      } else {
        right.height += h
        right.list.push(item)
      }

      if (index === images.length - 1) {
        this.setData({
          left,
          right
        })
      }
    }
  }
})
