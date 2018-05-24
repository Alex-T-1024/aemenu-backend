import dbClientObj from '../connectDb'
import { ObjectId } from 'mongodb'

class User {
  static initialize() {
    User.collection = dbClientObj.db.collection('users')
  }

  static collection

  static model(userDoc) {
    let user = new User(userDoc.name, userDoc.password)
    user._id = userDoc._id
    user.nickname = userDoc.nickname
    user.email = userDoc.nickname
    user.avatar = userDoc.avatar
    user.registrationTime = new Date(userDoc.registrationTime)
    return user
  }

  static async check(name, password) {
    try {
      if (name.length < 4) return 1000
      if (name.length > 20) return 1001
      var reg = /[^_A-Za-z0-9]+/
      if (reg.test(name)) return 1002
      if (await User.isExisted(name)) return 1003
      if (password == null || password.length === 0) return 1100
      return 0
    } catch (error) {
      return 1900
    }
  }

  static async isExisted(name) {
    let result = await User.collection.find({ name: name }).next()
    if (result == null) return false
    return true
  }

  static async getUserById(_id) {
    try {
      let userDoc = await User.collection.findOne({ _id: ObjectId(_id) })
      if (!userDoc) return null
      return User.model(userDoc)
    }
    catch (err) {
      console.log('Error getUserById: ', err)
      return null
    }
  }

  static async authenticate(name, password) {
    let user = await User.collection.findOne({ name: name })
    if (user && password == user.password) {
      return User.model(user)
    } else {
      return false
    }
  }

  static async tryLogin(req) {
    let name = req.body.username
    let password = req.body.password
    let rememberme = req.body.rememberme
    console.log(`User: ${name} RememberMe: ${rememberme} sessionID: ${req.sessionID}`)
    let user = await User.authenticate(name, password)
    if (!user) {
      return false
    }
    req.session.userId = user._id
    req.session.rememberme = rememberme
    if (!rememberme) {
      req.session.cookie.expires = false
    }
    return true
  }

  static async requiresLogin(req, res, next) {
    if (req.session && req.session.userId) return next()
    var err = new Error('User must login to continue!')
    err.code = 1200
    next(err)
  }

  constructor(name, password) {
    this.name = name
    this.password = password
    this.nickname = ''
    this.email = ''
    this.avatar = ''
    this.registrationTime = Date.now()
  }

  async insert() {
    let result = await User.collection.insertOne(this)
    console.log(result.insertedId, result.result)
  }

  async update() {
    let result = await User.collection.updateOne({ name: this.name }, { $set: this })
    console.log(result.upsertedId, result.result)
  }

  async delete() {
    let result = await User.collection.deleteOne({ name: this.name })
    console.log(result.deletedCount, result.result)
  }
}

export default User
