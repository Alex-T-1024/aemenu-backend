import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { initializeDb } from './connectDb'
import User from './models/user'
import addCliCommand from './util/cli'
import asyncMiddleware from './util/asyncMiddleware'
import { addCleanUp, safeExit } from './exitHandler'

const app = express()

app.listen(8080, () => {
  console.log('DEBUG: ', process.env.DEBUG, process.env.DEBUG.length)
  console.log('NODE_ENV: ', process.env.NODE_ENV, process.env.NODE_ENV.length)
  console.log('Listening on port 8080...\n')
})

//# region Initialize
async function initializeApp() {
  addCliCommand('exit', safeExit)
  try {
    app.locals.dbClientObj = await initializeDb()
  } catch (e) {
    console.error('Connecting db failed', e)
  }
  addCleanUp(async () => {
    try {
      await app.locals.dbClientObj.client.close()
      console.log('Db closed!')
    } catch (e) {
      console.error('Closing db failed', e)
    }
  })
  User.initialize()
  console.log('App initializing completed!')
}
initializeApp()
//# endregion Initialize

// #region Global middleware
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// #endregion Global middleware


// app.post('/regist', (req, res) => {
//   let username = req.body.username
//   let password = req.body.password
//   let code = 0
//   if ((code = User.check(username, password)) !== 0) res.json({ success: false, code: code })
//   let user = new User(username, password)
//   user.insert().then(()=>{
//     res.json({ success: true, code: code })
//   })
// })

app.post('/regist', asyncMiddleware(async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let code = await User.check(username, password)
  if (code !== 0) {
    res.json({ success: false, code: code })
    return
  }
  let user = new User(username, password)
  await user.insert()
  res.json({ success: true, code: code })
}))

app.post('/login', (req, res) => {

})


//=========================================
// 404 catch-all handler
app.use((req, res, next) => {
  res.status(404)
  res.send('404')
})

// 500 handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500)
  res.send('500')
})
