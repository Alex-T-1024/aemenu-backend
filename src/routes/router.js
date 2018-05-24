import express from 'express'
import asyncMiddleware from '../util/asyncMiddleware'
import User from '../models/user'

var router = express.Router()

router.post('/regist', asyncMiddleware(async (req, res) => {
  let username = req.body.username
  let password = req.body.password
  let code = await User.check(username, password)
  if (code !== 0) {
    res.json({ success: false, code: code })
    return
  }
  let user = new User(username, password)
  await user.insert()
  req.body.rememberme = true
  User.tryLogin(req)
  res.json({ success: true, code: code })
}))

router.post('/login', asyncMiddleware(async (req, res) => {
  let canLogin = await User.tryLogin(req)
  if (!canLogin) {
    return res.json({ success: false, code: 1101 })
  }
  console.log(req.sessionID)
  console.log(req.session)
  res.json({ success: true, code: 0 })
}))

router.get('/islogin', (req, res, next) => {
  next()
})

router.get('/isAuthenticated', asyncMiddleware(async (req, res) => {
  console.log('isAuthenticated:', req.session.userId)
  if (!req.session.userId) {
    return res.json({ success: false, code: 1200 })
  }
  let user = await User.getUserById(req.session.userId)
  if (user) {
    user._id = undefined
    return res.json({ success: true, code: 0, user: user })
  } else {
    return res.json({ success: false, code: 1201 })
  }
}))

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error(`User ${req.sessionID} logout error.`)
        return res.json({ success: false, code: 1900 })
      }
      console.log(`User ${req.sessionID} logout.`)
      res.json({ success: true, code: 0 })
    })
  } else {
    // Maybe below is impossible?
    console.log(`User ${req.sessionID} already logged out.`)
    res.json({ success: true, code: 0 })
  }
})

// TODO DELETE
router.get('/test', (req, res) => {
  console.log(req.sessionID)
  console.log(req.session.userId)
  console.log(req.session)
  res.json({ success: true, code: 0, session: req.session, sessionID: req.sessionID })
})

export default router
