import { AccountModel } from './../../../../domain/models/account';
import { MongoHelper } from './../helpers/mongo-helper';

import AccountMongoRepository from './account';

describe('Account Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__);
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  }

  test('Should return an account on success', async () => {
    const sut: AccountMongoRepository = makeSut();
    const accountData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_pass'
    };
    const account: AccountModel = await sut.add(accountData);
    expect(account).toBeTruthy();
    expect(account.name).toBe(accountData.name);
    expect(account.email).toBe(accountData.email);
    expect(account.password).toBe(accountData.password);
    expect(account.id).toBeTruthy();
  });

});