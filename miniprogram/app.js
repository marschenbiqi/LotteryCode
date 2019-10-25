//app.js
App({
  async onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'issue-uydy4',
        traceUser: true,
      })
      await this.getOpenid()
    }
  },
  async getOpenid() {
    let {
      result
    } = await wx.cloud.callFunction({
      name: 'GetOpenid',
      data: {}
    })
    let key = 'openid'
    let data = result.openid
    wx.setStorage({
      key: key,
      data: data,
    })

  },
})