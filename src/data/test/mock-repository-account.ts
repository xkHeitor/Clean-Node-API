import { UpdateAccessTokenRepository } from '@/data/protocols/repository/account/update-access-token-repository'
import { LoadAccountByTokenRepository } from '@/data/protocols/repository/account/load-account-by-token-repository'
import { AddAccountRepository } from '@/data/protocols/repository/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/protocols/repository/account/load-account-by-email-repository'
import { AddAccountParams } from '@/data/usecases/account/add-account/db-add-account-protocols'
import { AccountModel } from '@/data/usecases/authentication/db-authentication-protocols'
import { mockAccountModel } from '@/domain/test'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      const fakeAccount: AccountModel = mockAccountModel()
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel|null> {
      return new Promise(resolve => resolve(mockAccountModel()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (toke: string, role?: string): Promise<AccountModel|null> {
      return new Promise(resolve => resolve(mockAccountModel()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}