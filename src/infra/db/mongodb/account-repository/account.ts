import { Collection, InsertOneResult } from 'mongodb';
import { MongoHelper } from './../helpers/mongo-helper';
import { AddAccountRepository } from './../../../../data/protocols/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';

export default class AccountMongoRepository implements AddAccountRepository {
  
  async add(addAccountModel: AddAccountModel): Promise<AccountModel> {
    const accountCollection: Collection = await MongoHelper.getCollection('accounts');
    const insertResult: InsertOneResult = await accountCollection.insertOne(addAccountModel);
    const getResult = await accountCollection.findOne(insertResult.insertedId);
    
    if (!getResult?._id) throw new Error('Not found');
    const { _id, name, email, password } = getResult;
    const account: AccountModel = { id: String(_id), name, email, password };
    return account;
  }

}  