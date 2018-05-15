import { MongoClient } from 'mongodb'
import { addCleanUp } from './exitHandler'

const url = 'mongodb://localhost:27017'
const dbName = 'aemenu'

const dbPromise = MongoClient.connect(url)
  .then((client) => {
    console.log('Connected successfully to DB server')
    addCleanUp(() => {
      client ? client.close() : null
      console.log('Db client closed.')
    })
    return client.db(dbName)
  })
  .catch(e => {
    console.error('DB url error!')
    throw e
  })

export { dbPromise }
