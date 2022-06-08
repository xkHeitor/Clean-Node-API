import { AccountModel } from './../../../domain/models/account'
import { HashComparer } from './../../protocols/criptograpy/hash-comparer'
import { LoadAccountByEmailRepository } from './../../protocols/repository/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'

export class DbAuthentication implements Authentication {

  constructor(private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository, private readonly hashComparer: HashComparer){}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account: AccountModel|null = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) await this.hashComparer.compare(authentication.password, account.password)
    return ''
  }

}