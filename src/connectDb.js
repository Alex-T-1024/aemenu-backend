import { MongoClient } from 'mongodb'

const url = 'mongodb://localhost:27017'
const dbName = 'aemenu'

// Promise version.
// const dbClientPromise = MongoClient.connect(url)
// const dbPromise = dbClientPromise
//   .then((client) => {
//     console.log('Connected successfully to DB server')
//     addCleanUp(() => {
//       client ? client.close() : null
//       console.log('Db client closed.')
//     })
//     return client.db(dbName)
//   })
//   .catch(e => {
//     console.error('DB url error!')
//     throw e
//   })

// Async/await version.
async function initializeDb() {
  let dbclient = await MongoClient.connect(url)
  console.log('Db connected!')
  dbClientObj.client = dbclient
  dbClientObj.db = dbclient.db(dbName)
  return dbClientObj
}

const dbClientObj = { client: null, db: null }

export default dbClientObj
export { initializeDb }
