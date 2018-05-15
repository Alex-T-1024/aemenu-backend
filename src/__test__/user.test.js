import { dbPromise } from '../connectdb'
import User from '../models/user'
import { Db } from 'mongodb'

const file = 'models/user.js: '

test(`${file} Test db connection`, async () => {
  expect.assertions(1)
  expect(await dbPromise).toBeInstanceOf(Db)
  await userTest()
})

async function userTest() {
  test(`${file}Test user isExisted function.`, async () => {
    expect.assertions(2)
    expect(await User.isExisted('username')).toBe(true)
    expect(await User.isExisted('pewordsijfioewoijifoe')).toBe(false)
  })
  test(`${file}Test check user function.`, async () => {
    expect.assertions(2)
    expect(await User.check('a')).toBe(1000)
    expect(await User.check('uywhege1234567890qw1222ed')).toBe(1001)
    expect(await User.check('*&%&^%fds')).toBe(1003)
    expect(await User.check('*&%&^%fds')).toBe(1100)
    expect(await User.check('ehduce_3434')).toBe(0)
  })
}
// test(`${file}Test user isExisted function.`, async () => {

// })

// test(`${file}Test check user function.`, async () => {
//   expect.assertions(2)
//   expect(User.check('a')).toBe(1000)
//   expect(User.check('ehduce_3434')).toBe(0)
// })