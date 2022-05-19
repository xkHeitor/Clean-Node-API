import { Collection, InsertOneResult } from 'mongodb';
import { MongoHelper } from './../helpers/mongo-helper';
import { AddAccountRepository } from './../../../../data/protocols/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';

export default class AccountMongoRepository implements AddAccountRepository {
  
  async add(addAccountModel: AddAccountModel): Promise<AccountModel> {
    const accountCollection: Collection = await MongoHelper.getCollection('accounts');
    const insertResult: InsertOneResult = await accountCollection.insertOne(addAccountModel);
    const account = await accountCollection.findOne(insertResult.insertedId);
    return MongoHelper.map(account);
  }

}  