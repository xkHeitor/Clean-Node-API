import { LogMongoRepository } from './log'
import { Collection } from 'mongodb'
import env from '../../../../main/config/env'
import { MongoHelper } from './../helpers/mongo'
describe('Log Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoTest)
  })

  let errorCollection: Collection
  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })

})