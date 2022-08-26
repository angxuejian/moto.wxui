// components/recorder/index.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true
  },
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    timerName: '00:00',
    timer: 0,
    isStart: false,
    isAuth: false, // 是否授权录音
    recorderManage: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    open: function() {
      this.selectComponent('#drawerMoto').open()
    },
    onCallbackOpen: function() {
      this.data.recorderManage = wx.getRecorderManager()
      console.log('创建录音管理器')
    },
    onCallbackClose: function() {
      this.stop()
    },

    control: function() {
      if (!this.data.isAuth) {
        this.checkAuthRecord()
        return
      }

      this.data.isStart = !this.data.isStart
      this.setData({ isStart: this.data.isStart, timer: this.data.timer })

      if (this.data.isStart && !this.data.timer) this.start()
      else if (this.data.isStart && this.data.timer) this.resume()
      else if (!this.data.isStart) this.pause()
    },
    start: function() {
      
      this.timerStart()

      this.data.recorderManage.start({
        duration: 600000,
        format: 'mp3',
      })
      this.data.recorderManage.onStart(() => { console.log('录音开始了') })
    },

    pause: function() {
      this.data.recorderManage.pause()
      this.data.recorderManage.onPause(() => { console.log('录音暂停了') })
    },

    resume: function() {
      this.timerStart()
      this.data.recorderManage.resume()
      this.data.recorderManage.onResume(() => { console.log('录音继续了') })
    },

    stop: function() {
      // 遮罩层关闭的，就不执行定时关闭

      this.data.recorderManage.stop()
      this.data.recorderManage.onStop(res => {
        console.log('录音结束了')

        res.timerName = this.data.timerName
        this.triggerEvent('change', res)
        this.data.timerName = '00:00'
        this.data.isStart = false
        this.data.timer = 0
        this.setData({
          timerName: this.data.timerName,
          timer: this.data.timer,
          isStart: this.data.isStart
        })

        // if (!isTapClose) return
        // setTimeout(() => {
        //   this.selectComponent('#drawerMoto').close()
        // }, 800);
      })
    },

    timerStart: function() {
      if (!this.data.isStart) return

      if (this.data.timer >= 600) {
        this.showModal({
          title: '提示',
          content: '最多只能录制 10分钟',
          showCancel: false,
          success: () => this.stop()
        })
        return
      }

      this.data.timer++

      const hours = `${parseInt(this.data.timer / 60 / 60)}`
      const hoursSecond = hours ? this.data.timer - (hours * 60 * 60) : this.data.timer
      
      const minute = `${parseInt(hoursSecond / 60)}`
      const minuteSecond = minute * 60

      const second = `${ minute ? hoursSecond - minuteSecond : hoursSecond }`
      const name = [minute, second].map(s => s.padStart(2, 0)).join(":")

      this.setData({ timerName: name })

      setTimeout(() => {
        this.timerStart()
      }, 1000);
    },

    checkAuthRecord: async function() {
      const { authSetting } = await wx.getSetting()

      if (authSetting['scope.record']) {
        this.authorizeSuccess()
        return
      }
      wx.authorize({
        scope: 'scope.record',
        success: res => {
          this.authorizeSuccess()
        },
        fail: err => {
          this.authorizeError(err)
        }
      })
    },

    authorizeSuccess: function() {
      this.data.isAuth = true
      this.control()
    },
    authorizeError: async function(err) {
      this.data.isAuth = false

      if (/auth deny/ig.test(err.errMsg)) {
        wx.showModal({ 
          title: '提示', 
          content: '请先授权麦克风权限，才能继续操作',
          success: res => {
            if (!res.confirm) return
            wx.openSetting({
              success: setting => {
                if (setting.authSetting['scope.record']) {
                  this.authorizeSuccess()
                } else {
                  wx.showToast({
                    title: '您未授权',
                    icon: 'none'
                  })
                }
              },
            })
          }
        })
      }
    }
  }
})
