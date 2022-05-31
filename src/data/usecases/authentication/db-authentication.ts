import { LoadAccountByEmailRepository } from './../../protocols/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'

export class DbAuthentication implements Authentication {

  constructor(private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository){}

  async auth(authentication: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email)
    return ''
  }

}