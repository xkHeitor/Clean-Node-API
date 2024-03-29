import { AccountModel } from '@/domain/models/account/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

export interface AddAccountRepository {
  add: (AddAccountParams: AddAccountParams) => Promise<AccountModel>
}