import { AddAccount, AddAccountModel, AccountModel, Encrypted, AddAccountRepository } from './db-add-account-protocols';

export default class DbAddAccount implements AddAccount {
  
  constructor(private readonly encrypted: Encrypted, private readonly addAccountRepository: AddAccountRepository){}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword: string = await this.encrypted.encrypt(accountData.password);
    const accountModel: AccountModel = { ...accountData, id: 'valid_id', password: hashedPassword };
    await this.addAccountRepository.add(Object.assign({}, accountModel, { id: undefined }));
    return new Promise(resolve => resolve(accountModel));
  }

}