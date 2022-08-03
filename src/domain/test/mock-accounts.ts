import { AccountModel } from '../models/account/account'
import { AddAccountParams } from '../usecases/account/add-account'
import { AuthenticationParams } from '../usecases/account/authentication'

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id', 
  name: 'any_name',
  email: 'any_email', 
  password: 'hashed_password'
})

export const mockAccountData = (): AddAccountParams => ({
  name: 'any_name', 
  email: 'any_email',
  password: 'any_password' 
})

export const makeFakeAuthentication = (): AuthenticationParams => ({
  email: 'any_email',
  password: 'any_password'
})