
import { UninitializedDbError } from '@/infra/errors'
import env from '@/main/config/env'

import { MongoHelper as sut } from './mongo'

describe('Mongo Helper', () => {

  afterAll(async () => {
    await sut.disconnect
  })

  test('Should reconnect if mongodb is down', async () => {
    await sut.connect(env.mongoTest)
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })

  test('Should throw an UninitializedDbError if not is defined the client', async () => {
    sut.client = null
    const resultPromise: Promise<void> = sut.disconnect()
    await expect(resultPromise).rejects.toThrow(new UninitializedDbError())
  })

})