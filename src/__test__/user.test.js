import User from '../models/user'
import dbClientObj, { initializeDb } from '../connectDb'

const file = 'models/user.js: '

beforeAll(() => {
  console.log('Connecting db...')
  return initializeDb()
})

afterAll(() => {
  console.log('Closing db...')
  return dbClientObj.client.close()
})

test(`${file}Test User Code Error 1900`, async () => {
  expect.assertions(1)
  expect(await User.check('username')).toBe(1900)
})

describe('Db status OK', () => {
  beforeEach(async () => User.initialize())

  test(`${file}Test user isExisted function.`, async () => {
    expect.assertions(2)
    expect(await User.isExisted('username')).toBe(true)
    expect(await User.isExisted('pewordsijfioewoijifoe')).toBe(false)
  })

  test(`${file}Test check user function.`, async () => {
    expect.assertions(6)
    expect(await User.check('a')).toBe(1000)
    expect(await User.check('uywhege1234567890qw1222ed')).toBe(1001)
    expect(await User.check('*&%&^%fds')).toBe(1002)
    expect(await User.check('username')).toBe(1003)
    expect(await User.check('sihuhenhao')).toBe(1100)
    expect(await User.check('ehduce_3434', 'abcd345ef')).toBe(0)
  })
})
