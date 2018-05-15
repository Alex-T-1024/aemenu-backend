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
async function initialize() {
  let dbclient = await MongoClient.connect(url)
  client.self = dbclient
  client.db = dbclient.db(dbName)
  return client
}

const client = { self: null, db: null }

export default client
export { initialize }
