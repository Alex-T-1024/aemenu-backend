import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dbPromise from './connectdb'
import addCliCommand from './util/cli'
import { safeExit } from './exitHandler'
import './test' // delete before deploy

const app = express()

app.listen(8080, () => {
  console.log('DEBUG: ',process.env.DEBUG, process.env.DEBUG.length)
  console.log('NODE_ENV: ',process.env.NODE_ENV, process.env.NODE_ENV.length)
  console.log('Listening on port 8080...\n')
})

dbPromise.then(db => { app.locals.db = db }).finally(()=>{
  addCliCommand('exit', safeExit)
})

// #region Global middleware
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// #endregion Global middleware

// #region Test
app.get('/test', (req, res) => {
  console.log('Get!!')
  var k = app.locals.db.collection('users')
  k.find({}).toArray()
    .then(docs => {
      console.log(docs)
    })
  res.json({ 'a': 1 })
  console.log('/test done')
})

app.post('/blob', (req, res) => {
  console.log('Blob')
  // res.json({'b':2})
  res.send('sdfdsf')
})


// #endregion Test

app.post('/regist', (req, res) => {
  console.log(req.body)
  res.json(req.body)
})

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
