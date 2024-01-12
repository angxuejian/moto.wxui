// components/lazy-loadimage/index.js

Component({

  externalClasses: ['custom-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: '',
      observer: function(newV, oldV) {
        
        // 防止接口延迟，图片未获取到情况
        if (newV && !this.data.isLoadImg) this.handleScroll()
      }
    }
  },
  lifetimes : {
    attached() {
      this.data.uid = 'uid-' + this.generateUUID()
      this.setData({ uid: this.data.uid })
    },
    ready() {
      this.handleScroll()
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    uid: '',
    isShow: false, // src图片加载完成，是否显示图片
    isLoadImg: false, // src图片是否开始加载
    isShowErr: false, // src图片加载失败时显示图片失败占位符
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleScroll: function() {
      const intersection = wx.createIntersectionObserver(this)
      intersection.relativeToViewport().observe('#' + this.data.uid, rect => {
        if (this.data.isLoadImg || this.data.isShowErr) return

        if (rect.intersectionRatio > 0) {
          this.data.isLoadImg = !!this.data.src
          this.setData({ 
            isLoadImg: this.data.isLoadImg,
          })
          intersection.disconnect()
        }
      })
    },
    onLoadingSuccess: function(event) {
      this.data.isShow = true
      this.setData({
        isShow: this.data.isShow
      })
    },
    onLoadingError: function(event) {
      this.data.isShowErr = true
      this.setData({
        isShowErr: this.data.isShowErr
      })
    },

    generateUUID: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      })
    }
  }
})
