import { LoadAccountByEmailRepository } from './../../protocols/repository/load-account-by-email-repository'
import { AuthenticationModel } from './../../../domain/usecases/authentication'
import { DbAuthentication } from './db-authentication'
import { AccountModel } from './../../../domain/models/account'
import { HashComparer } from '../../protocols/criptograpy/hash-comparer'

describe('DbAuthentication UseCase', () => {

  const makeFakeAuthentication = (): AuthenticationModel => ({
    email: 'any_email',
    password: 'any_password'
  })

  const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email',
    password: 'hashed_password'
  })

  const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel|null> {
        return new Promise(resolve => resolve(makeFakeAccount()))
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

  const makeHashComparer = (): HashComparer => {
    class HashComparerStub implements HashComparer {
      async compare (value: string, hash: string): Promise<boolean> {
        return new Promise(resolve => resolve(true))
      }
    }
    return new HashComparerStub()
  }

  interface SutTypes {
    sut: DbAuthentication;
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository = makeLoadAccountByEmailRepositoryStub()
    const hashComparerStub = makeHashComparer()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub)
    return { sut, loadAccountByEmailRepositoryStub, hashComparerStub }
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

  test('Should return empty if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub }: SutTypes = makeSut()
    const promise: Promise<null> = new Promise(resolve => resolve(null))
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(promise)
    const accessToken: string = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeFalsy()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub }: SutTypes = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

})