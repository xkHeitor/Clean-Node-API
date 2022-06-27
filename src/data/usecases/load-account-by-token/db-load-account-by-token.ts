import { LoadAccountByTokenRepository } from './../../protocols/repository/account/load-account-by-token-repository';
import { AccountModel } from '../add-account/db-add-account-protocols'
import { LoadAccountByToken } from './../../../domain/usecases/load-account-by-token'
import { Decrypter } from './../../protocols/criptograpy/decrypter'

export class DbLoadAccountByToken implements LoadAccountByToken {

  constructor(private readonly decrypter: Decrypter, private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository) {}
  
  async load (accessToken: string, role?: string): Promise<AccountModel|null> {
    const token: string = await this.decrypter.decrypt(accessToken)
    if (token) {
      const account: AccountModel = await this.loadAccountByTokenRepository.loadByToken(token, role)
      return account||null
    }
    return null
  }

}