import { AccountModel } from '@/domain/models/account/account'

export type AddAccountModel = Omit<AccountModel, 'id'>

export interface AddAccount {
  add: (accountData: AddAccountModel) => Promise<AccountModel|null>
}