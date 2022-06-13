import { Collection, InsertOneResult } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo'

import AccountMongoRepository from './account-mongo-repository'
import env from '../../../../main/config/env'

let accountCollection: Collection
const token: string = 'any_token'
const accountData = {
  name: 'any_name',
  email: 'any_email',
  password: 'any_pass'
}

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

  test('Should return an account on add success', async () => {
    const sut: AccountMongoRepository = makeSut()
    const account: AccountModel = await sut.add(accountData)
    expect(account).toBeTruthy()
    expect(account.name).toBe(accountData.name)
    expect(account.email).toBe(accountData.email)
    expect(account.password).toBe(accountData.password)
    expect(account.id).toBeTruthy()
  })

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

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const sut: AccountMongoRepository = makeSut()
    const insertResult: InsertOneResult = await accountCollection.insertOne(accountData)
    const accountID: string = String(insertResult.insertedId)
    await sut.updateAccessToken(accountID, token)
    const account = await accountCollection.findOne(insertResult.insertedId)
    expect(account?.accessToken).toBe(token)
  })

})