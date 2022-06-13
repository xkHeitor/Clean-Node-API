import { AddAccountRepository } from '../../../../data/protocols/repository/account/add-account-repository'
import { Collection, InsertOneResult, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/repository/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/repository/account/update-access-token-repository'

export default class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  
  async add(addAccountModel: AddAccountModel): Promise<AccountModel> {
    const accountCollection: Collection = await MongoHelper.getCollection('accounts')
    const insertResult: InsertOneResult = await accountCollection.insertOne(addAccountModel)
    const account = await accountCollection.findOne(insertResult.insertedId)
    return MongoHelper.map(account)
  }

  async loadByEmail(email: string): Promise<AccountModel|null> {
    const accountCollection: Collection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }
  
  async updateAccessToken(id: string, accessToken: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken } })
  }
}  