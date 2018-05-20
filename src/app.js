import express from 'express'
import session from 'express-session'
import cors from 'cors'
import bodyParser from 'body-parser'
import connectMongo from 'connect-mongo'
import { initializeDb } from './connectDb'
import User from './models/user'
import credentials from './credentials'
import addCliCommand from './util/cli'
import { addCleanUp, safeExit } from './exitHandler'
import router from './routes/router'

const port = 8080

const app = express()
const MongoStore = connectMongo(session)

app.listen(port, () => {
  console.log('DEBUG: ', process.env.DEBUG, process.env.DEBUG.length)
  console.log('NODE_ENV: ', process.env.NODE_ENV, process.env.NODE_ENV.length)
  console.log(`Listening on port ${port}...\n`)
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
  startApp()
  console.log('App initializing completed!')
}
initializeApp()
//# endregion Initialize

function startApp() {
  // #region Global middleware
  app.use(cors({
    credentials: true,
    origin: [
      'http://localhost:8000',
      'http://localhost:3000',
    ]
  }))
  app.use(express.static('public'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(session({
    secret: credentials.cookieSecret,
    saveUninitialized: false,
    resave: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 1,
    },
    store: new MongoStore({
      db: app.locals.dbClientObj.db,
    })
  }))
  // #endregion Global middleware

  app.use('/', router)

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

}
