import { AddAccount, AddAccountModel, AccountModel, Encrypted, AddAccountRepository } from './db-add-account-protocols';

export default class DbAddAccount implements AddAccount {
  
  constructor(private readonly encrypted: Encrypted, private readonly addAccountRepository: AddAccountRepository){}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword: string = await this.encrypted.encrypt(accountData.password);
    const accountModel: AddAccountModel = Object.assign({}, accountData, { password: hashedPassword });
    const account: AccountModel = await this.addAccountRepository.add(accountModel);
    return account;
  }

}