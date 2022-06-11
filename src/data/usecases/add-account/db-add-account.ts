import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'

export default class DbAddAccount implements AddAccount {
  
  constructor(private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository){}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword: string = await this.hasher.hash(accountData.password)
    const accountModel: AddAccountModel = Object.assign({}, accountData, { password: hashedPassword })
    const account: AccountModel = await this.addAccountRepository.add(accountModel)
    return account
  }

}