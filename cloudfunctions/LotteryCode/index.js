// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'issue-uydy4',
})
const db = cloud.database()
const _ = db.command
const lotteryCode = db.collection('lotteryCode')

// 云函数入口函数
exports.main = async(event, context) => {

  const {
    OPENID
  } = cloud.getWXContext()

  const {
    openid
  } = event
  try {
    // 生成随机码
    const code = () => {
      let result = Math.random().toFixed(4).slice(-4)
      return parseInt(result)
    }
    /* 
     * @function  判断随机码是否与数据库内重复、重复继续生成新的随机码
     * @param { number } newcode - 随机码
     */
    async function queryCode(newcode) {
      const query = await lotteryCode.where({
        code: newcode,
      }).get()
      let {
        length,
      } = query.data
      if (length > 0) {
        if (newcode == res.data[0].code) {
          queryCode(code())
        }
      } else {
        const addCode = await lotteryCode.add({
          data: {
            _openid: openid,
            code: newcode
          }
        })
        return {
          lotteryCode: newcode,
          code: addCode.errMsg === 'collection.add:ok' ? 0 : 1
        }
      }
    }

    let result = await queryCode(code())

    return {
      code: result.code
    }
  } catch (e) {
    console.log(e)
  }
}