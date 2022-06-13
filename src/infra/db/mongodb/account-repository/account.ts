import { AddAccountRepository } from './../../../../data/protocols/repository/add-account-repository'
import { Collection, InsertOneResult } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/repository/load-account-by-email-repository'

export default class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
    
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

}  