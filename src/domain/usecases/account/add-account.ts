import { AccountModel } from '@/domain/models/account/account'

export type AddAccountParams = Omit<AccountModel, 'id'>

export interface AddAccount {
  add: (accountData: AddAccountParams) => Promise<AccountModel|null>
}