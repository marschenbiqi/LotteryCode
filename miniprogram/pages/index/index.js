const db = wx.cloud.database()
const userinfo = db.collection('userinfo')
const lotteryCode = db.collection('lotteryCode')
const tmplIds = ['vdpGFeV0TvKKRWRTNMXT3lKlXqf8VKRzLSdSMW92NxQ']
var openid = wx.getStorageSync('openid')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    title: '请领取您的幸运号码'
  },


  onShow() {
    this.queryUserCode()
  },
  Receive(e) {

    if (e.detail.errMsg !== 'getUserInfo:fail auth deny') {
      let {
        userInfo
      } = e.detail
      this.addUser(userInfo)
    } else {

      wx.showModal({
        content: '需要您的授权才可以领取抽奖券',
        confirmText: '授权',
        cancelText: '拒绝',
        success: res => {
          if (res.confirm) {
            wx.openSetting({
              success: res => {
                let {
                  authSetting
                } = res

                if (!authSetting["scope.userInfo"]) {
                  wx.showToast({
                    title: '授权失败',
                    duration: 1000,
                    icon: 'none'
                  })
                }

              }
            })
          }
        }
      })
    }
  },
  async addUser(userInfo) {
    console.log(openid)
    wx.showLoading({
      title: '正在领取...',
    })

    let query = await userinfo.where({
      _openid: openid
    }).get()
    /* 
      判断数据库中是否有相同用户
     */
    if (query.data.length == 0) {
      const {
        result
      } = await wx.cloud.callFunction({
        name: 'Login',
        data: {
          userInfo
        }
      })
      this.queryUserCode()
      wx.hideLoading()
    }
  },
  /* 
   *@function 查询用户是否拥有幸运号码
   */
  async queryUserCode() {

    await lotteryCode.where({
      _openid: openid
    }).get().then(res => {
      let {
        data
      } = res
      // console.log(data)
      this.setData({
        lotteryCode: data
      })
    })
  },

  /* 
   *@function 获取用户订阅消息授权
   */
  Subscribe() {
    wx.requestSubscribeMessage({
      tmplIds: tmplIds,
      success: res => {
        console.log(res)
      },
      fail: err => {
        // console.log(err)
      }
    })
  }
})