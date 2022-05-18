import { MongoHelper } from './../helpers/mongo-helper';

import AccountMongoRepository from './account';

describe('Account Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should return an account on success', async () => {
    const sut: AccountMongoRepository = new AccountMongoRepository();
    const accountData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_pass'
    };
    const account = await sut.add(accountData);
    expect(account).toBeTruthy();
    expect(account.name).toBe(accountData.name);
    expect(account.email).toBe(accountData.email);
    expect(account.password).toBe(accountData.password);
    expect(account.id).toBeTruthy();
  });

});