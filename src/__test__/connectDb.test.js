import dbClientObj, { initializeDb } from '../connectDb'
import { MongoClient, Db } from 'mongodb'

const file = 'models/connectDb.js: '

test(`${file} Test db connection`, async () => {
  expect.assertions(2)
  let result
  expect(result = await initializeDb()).toMatchObject({ client: expect.any(MongoClient), db: expect.any(Db)})
  expect(dbClientObj === result).toBe(true)
})
