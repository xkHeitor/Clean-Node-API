import { LoadAccountByEmailRepository } from './../../protocols/repository/load-account-by-email-repository'
import { AuthenticationModel } from './../../../domain/usecases/authentication'
import { DbAuthentication } from './db-authentication'
import { AccountModel } from './../../../domain/models/account'

describe('DbAuthentication UseCase', () => {

  const makeFakeAuthentication = (): AuthenticationModel => ({
    email: 'any_email',
    password: 'any_password'
  })

  const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'password'
  })

  const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        return new Promise(resolve => resolve(makeFakeAccount()))
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
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub }: SutTypes = makeSut()
    const rejectPromise: Promise<AccountModel> = new Promise((resolve, reject) => reject(new Error()))
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(rejectPromise)
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

})