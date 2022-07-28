import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'

export default class DbAddAccount implements AddAccount {
  
  constructor(
    private readonly hasher: Hasher, 
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ){}

  async add(accountData: AddAccountModel): Promise<AccountModel|null> {
    const findAccount: AccountModel|null = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (findAccount) return null
    const hashedPassword: string = await this.hasher.hash(accountData.password)
    const accountModel: AddAccountModel = Object.assign({}, accountData, { password: hashedPassword })
    const account: AccountModel = await this.addAccountRepository.add(accountModel)
    return account
  }

}