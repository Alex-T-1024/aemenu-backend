import { dbPromise } from '../connectdb'

dbPromise.then(db => {
  User.collection = db.collection('users')
})

class User {
  static collection

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
    if(result == null) return false
    return true
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
