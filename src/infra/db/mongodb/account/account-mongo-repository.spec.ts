import { Collection, InsertOneResult } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo'

import AccountMongoRepository from './account-mongo-repository'
import env from '../../../../main/config/env'

let accountCollection: Collection
const token: string = 'any_token'
const anyRole: string = 'any_role'
const accountData = {
  name: 'any_name',
  email: 'any_email',
  password: 'any_pass'
}

beforeAll(async () => {
  await MongoHelper.connect(env.mongoTest)
})

beforeEach(async () => {
  accountCollection = await MongoHelper.getCollection('accounts')
  await accountCollection.deleteMany({})
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

describe('Account Mongo Repository', () => {

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut: AccountMongoRepository = makeSut()
      const account: AccountModel = await sut.add(accountData)
      expect(account).toBeTruthy()
      expect(account.name).toBe(accountData.name)
      expect(account.email).toBe(accountData.email)
      expect(account.password).toBe(accountData.password)
      expect(account.id).toBeTruthy()
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut: AccountMongoRepository = makeSut()
      await accountCollection.insertOne(accountData)
      const account: AccountModel|null = await sut.loadByEmail(accountData.email)
      expect(account).toBeTruthy()
      expect(account?.name).toBe(accountData.name)
      expect(account?.email).toBe(accountData.email)
      expect(account?.password).toBe(accountData.password)
      expect(account?.id).toBeTruthy()
    })
  
    test('Should return null on loadByEmail fails', async () => {
      const sut: AccountMongoRepository = makeSut()
      const account: AccountModel|null = await sut.loadByEmail(accountData.email)
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut: AccountMongoRepository = makeSut()
      const insertResult: InsertOneResult = await accountCollection.insertOne(accountData)
      const accountID: string = String(insertResult.insertedId)
      await sut.updateAccessToken(accountID, token)
      const account = await accountCollection.findOne(insertResult.insertedId)
      expect(account?.accessToken).toBe(token)
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken success without role', async () => {
      const sut: AccountMongoRepository = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_pass',
        accessToken: token
      })
      const account: AccountModel|null = await sut.loadByToken(token)
      expect(account).toBeTruthy()
      expect(account?.name).toBe(accountData.name)
      expect(account?.email).toBe(accountData.email)
      expect(account?.password).toBe(accountData.password)
      expect(account?.id).toBeTruthy()
    })

    test('Should return an account on loadByToken success with role', async () => {
      const sut: AccountMongoRepository = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_pass',
        accessToken: token,
        role: anyRole
      })
      const account: AccountModel|null = await sut.loadByToken(token, anyRole)
      expect(account).toBeTruthy()
      expect(account?.name).toBe(accountData.name)
      expect(account?.email).toBe(accountData.email)
      expect(account?.password).toBe(accountData.password)
      expect(account?.id).toBeTruthy()
    })
  })

})