// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'issue-uydy4',
})
const db = cloud.database()
const _ = db.command
const userinfo = db.collection('userinfo')
// 云函数入口函数
exports.main = async(event) => {
  const {
    userInfo
  } = event
  const {
    OPENID
  } = cloud.getWXContext()
  try {
    const addUserinfo = await userinfo.add({
      data: {
        userInfo,
        _openid: OPENID
      }
    })

    const lotteryCode = await cloud.callFunction({
      name: 'LotteryCode',
      data: {
        openid: OPENID
      }
    })

    return {
      code: lotteryCode.errMsg === 'callFunction:ok' ? 0 : 1,
      lotteryCode: lotteryCode.lotteryCode
    }
  } catch (e) {
    console.log(e)
  }

}