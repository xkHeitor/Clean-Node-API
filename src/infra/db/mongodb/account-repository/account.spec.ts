import { AccountModel } from './../../../../domain/models/account'
import { MongoHelper } from '../helpers/mongo'

import AccountMongoRepository from './account'
import env from '../../../../main/config/env'

describe('Account Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoTest)
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on success', async () => {
    const sut: AccountMongoRepository = makeSut()
    const accountData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_pass'
    }
    const account: AccountModel = await sut.add(accountData)
    expect(account).toBeTruthy()
    expect(account.name).toBe(accountData.name)
    expect(account.email).toBe(accountData.email)
    expect(account.password).toBe(accountData.password)
    expect(account.id).toBeTruthy()
  })

})