// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'issue-uydy4',
})

const db = cloud.database()
const _ = db.command
const formId = db.collection('formid')
const userinfo = db.collection('userinfo')
const lotteryCode = db.collection('lotteryCode')
// 云函数入口函数



async function queryAllUser() {
  const MAX_LIMIT = 100
  const countResult = await db.collection('lotteryCode').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('lotteryCode').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}


async function sendMessage(touser, code, title) {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: touser,
      page: 'pages/index/index',
      data: {
        thing1: {
          value: '漳州小程序·云开发城市技术交流圈'
        },
        thing2: {
          value: title
        },
        number3: {
          value: code
        }
      },
      templateId: 'vdpGFeV0TvKKRWRTNMXT3lKlXqf8VKRzLSdSMW92NxQ'
    })
    // console.log(result)
    return result
  } catch (err) {
    return err
  }
}

exports.main = async(event, context) => {

  const {
    list
  } = await lotteryCode.aggregate()
    .sample({
      size: 1
    })
    .end()

  const code = list[0].code

  let {
    data
  } = await queryAllUser()

  for (item of data) {
    if (code === item.code) {
      const send = await sendMessage(item._openid, item.code, '恭喜您被选中了')
      console.log(send + '恭喜您被选中了' + item.code)
    } else {
      const send = await sendMessage(item._openid, item.code, '很遗憾,您未被选中')
      console.log(send + '很遗憾,本轮您未选中' + item.code)
    }
  }


  return code
}