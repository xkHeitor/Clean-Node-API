import { AccountModel } from '@/domain/models/account/account'
import { MongoHelper } from '../helpers/mongo'
import { mockAddAccountParams } from '@/domain/test'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import AccountMongoRepository from './account-mongo-repository'
import env from '@/main/config/env'

import { Collection, InsertOneResult } from 'mongodb'

let accountCollection: Collection
const token: string = 'any_token'
const anyRole: string = 'any_role'
const addAccountParams: AddAccountParams = mockAddAccountParams()

describe('Account Mongo Repository', () => {

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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut: AccountMongoRepository = makeSut()
      const account: AccountModel = await sut.add(addAccountParams)
      expect(account).toBeTruthy()
      expect(account.name).toBe(addAccountParams.name)
      expect(account.email).toBe(addAccountParams.email)
      expect(account.password).toBe(addAccountParams.password)
      expect(account.id).toBeTruthy()
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut: AccountMongoRepository = makeSut()
      await accountCollection.insertOne(addAccountParams)
      const account: AccountModel|null = await sut.loadByEmail(addAccountParams.email)
      expect(account).toBeTruthy()
      expect(account?.name).toBe(addAccountParams.name)
      expect(account?.email).toBe(addAccountParams.email)
      expect(account?.password).toBe(addAccountParams.password)
      expect(account?.id).toBeTruthy()
    })
  
    test('Should return null on loadByEmail fails', async () => {
      const sut: AccountMongoRepository = makeSut()
      const account: AccountModel|null = await sut.loadByEmail(addAccountParams.email)
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut: AccountMongoRepository = makeSut()
      const insertResult: InsertOneResult = await accountCollection.insertOne(addAccountParams)
      const accountID: string = String(insertResult.insertedId)
      await sut.updateAccessToken(accountID, token)
      const account = await accountCollection.findOne(insertResult.insertedId)
      expect(account?.accessToken).toBe(token)
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken success without role', async () => {
      const sut: AccountMongoRepository = makeSut()
      await accountCollection.insertOne(Object.assign({}, addAccountParams, {
        accessToken: token
      }))
      const account: AccountModel|null = await sut.loadByToken(token)
      expect(account).toBeTruthy()
      expect(account?.name).toBe(addAccountParams.name)
      expect(account?.email).toBe(addAccountParams.email)
      expect(account?.password).toBe(addAccountParams.password)
      expect(account?.id).toBeTruthy()
    })

    test('Should return an account on loadByToken success with role', async () => {
      const sut: AccountMongoRepository = makeSut()
      await accountCollection.insertOne(Object.assign({}, addAccountParams, {
        accessToken: token,
        role: anyRole
      }))
      const account: AccountModel|null = await sut.loadByToken(token, anyRole)
      expect(account).toBeTruthy()
      expect(account?.name).toBe(addAccountParams.name)
      expect(account?.email).toBe(addAccountParams.email)
      expect(account?.password).toBe(addAccountParams.password)
      expect(account?.id).toBeTruthy()
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut: AccountMongoRepository = makeSut()
      await accountCollection.insertOne(Object.assign({}, addAccountParams, {
        accessToken: token
      }))
      const account: AccountModel|null = await sut.loadByToken(token, 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return null on loadByToken with if user is admin', async () => {
      const sut: AccountMongoRepository = makeSut()
      await accountCollection.insertOne(Object.assign({}, addAccountParams, {
        accessToken: token,
        role: 'admin'
      }))
      const account: AccountModel|null = await sut.loadByToken(token)
      expect(account).toBeTruthy()
      expect(account?.name).toBe(addAccountParams.name)
      expect(account?.email).toBe(addAccountParams.email)
      expect(account?.password).toBe(addAccountParams.password)
      expect(account?.id).toBeTruthy()
    })

    test('Should return null if loadByToken fails', async () => {
      const sut: AccountMongoRepository = makeSut()
      const account: AccountModel|null = await sut.loadByToken(token)
      expect(account).toBeFalsy()
    })
  })

})