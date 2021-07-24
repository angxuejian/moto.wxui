// components/switch/switch.js
Component({

  options: {
    virtualHost: true // 将这个自定义组件设置为“虚拟的”
  },

  /**
   * 组件的属性列表
   */
  properties: {
    checked: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    color: {
      type: String,
      value: '#4490DB'
    },
    vibrate: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    changeSwitchBox: function() {
      if (this.data.disabled) return

      this.data.checked = !this.data.checked
      this.setData({
        checked: this.data.checked
      })

      if (this.data.vibrate && this.data.checked) {
        wx.vibrateShort({ type: 'light' })
      }

      this.triggerEvent('change', { value: this.data.checked })
    },
  } 
})
