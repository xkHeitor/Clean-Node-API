import { AddAccount, AddAccountModel, AccountModel, Encrypted } from './db-add-account-protocols';

export default class DbAddAccount implements AddAccount {
  
  constructor(private readonly encrypted: Encrypted){}

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypted.encrypt(account.password);
    const accountModel: AccountModel = { ...account, id: '1' };
    return new Promise(resolve => resolve(accountModel));
  }

}