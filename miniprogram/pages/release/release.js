const db = wx.cloud.database()



Page({
  data: {
    number: 8888
  },

  async start() {
    wx.showLoading({
      title: '正在抽取...',
    })
    /* 
     *@调用云函数从数据库抽取随机记录
     */
    const {
      result
    } = await wx.cloud.callFunction({
      name: 'SendMessage',
      data: {}
    })

    let newnumber = result
    let number = this.data.number
    let difference = newnumber - number //与原数字的差
    let absDifferent = Math.abs(difference) //差取绝对值
    let changeCount = absDifferent < 10 ? absDifferent : 10
    let changeUnit = absDifferent < 10 ? 1 : Math.floor(difference / 10)

    let that = this
    for (let i = 0; i < changeCount; i++) {

      (function(i) {
        setTimeout(() => {
          that.setData({
            number: that.data.number += changeUnit
          })
          // 差值除以变化次数时，并不都是整除的，所以最后一步要精确设置新数字
          if (i == changeCount - 1) {
            that.setData({
              number: number + difference
            })
          }
        }, 100 * (i + 1))
      })
      (i)
    }
    

    wx.hideLoading()

  },

})