import { DbAuthentication } from './db-authentication'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { AccountModel } from './../../../domain/models/account'

describe('DbAuthentication UseCase', () => {

  const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        return new Promise(resolve => resolve({
          id: 'any_id',
          name: 'any_name',
          email,
          password: 'password'
        }))
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

  interface SutTypes {
    sut: DbAuthentication;
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository = makeLoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    return { sut, loadAccountByEmailRepositoryStub }
  }

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
   
    const { sut, loadAccountByEmailRepositoryStub }: SutTypes = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'any_email',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email')
  })

})