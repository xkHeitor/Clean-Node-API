import { TokenGenerator } from './../../protocols/criptograpy/token-generator'
import { AccountModel } from './../../../domain/models/account'
import { HashComparer } from './../../protocols/criptograpy/hash-comparer'
import { LoadAccountByEmailRepository } from './../../protocols/repository/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'

export class DbAuthentication implements Authentication {

  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository, 
    private readonly hashComparer: HashComparer, 
    private readonly tokenGenerator: TokenGenerator
  ){}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account: AccountModel|null = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid: boolean = await this.hashComparer.compare(authentication.password, account.password)
      if (isValid) return await this.tokenGenerator.generate(account.id)
    }
    return ''
  }

}