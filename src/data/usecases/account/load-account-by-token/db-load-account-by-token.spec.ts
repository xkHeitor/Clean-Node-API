import { mockDecrypter, mockLoadAccountByTokenRepository } from '@/data/test'
import { mockAccountModel, throwError } from '@/domain/test'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel, Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

describe('DbLoadAccountByToken UseCase', () => {

  const anyRole: string = 'anyRole'
  const anyValue: string = 'any_value'

  type SutTypes = {
    sut: DbLoadAccountByToken
    decryptStub: Decrypter
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  }

  const makeSut = (): SutTypes => {
    const decryptStub: Decrypter = mockDecrypter()
    const loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository = mockLoadAccountByTokenRepository()
    const sut: DbLoadAccountByToken = new DbLoadAccountByToken(decryptStub, loadAccountByTokenRepositoryStub)
    return { sut, decryptStub, loadAccountByTokenRepositoryStub }
  }

  test('Should call Decrypter with correct values', async () => {
    const { sut, decryptStub } = makeSut()
    const decryptSpy = jest.spyOn(decryptStub, 'decrypt')
    await sut.load(anyValue, anyRole)
    expect(decryptSpy).toHaveBeenCalledWith(anyValue)
  })

  test('Should returns null if Decrypter returns null', async () => {
    const { sut, decryptStub } = makeSut()
    const resolvePromise: Promise<string|null> = new Promise(resolve => resolve(null)) 
    jest.spyOn(decryptStub, 'decrypt').mockReturnValueOnce(resolvePromise)
    const account: AccountModel|null = await sut.load(anyValue, anyRole)
    expect(account).toBeNull()
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decryptStub }: SutTypes = makeSut()
    jest.spyOn(decryptStub, 'decrypt').mockImplementationOnce(throwError)
    const resultPromise: Promise<AccountModel|null> = sut.load(anyValue, anyRole)
    await expect(resultPromise).rejects.toThrow()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load(anyValue, anyRole)
    expect(loadSpy).toHaveBeenCalledWith(anyValue, anyRole)
  })

  test('Should returns null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const resolvePromise: Promise<AccountModel|null> = new Promise(resolve => resolve(null)) 
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(resolvePromise)
    const account: AccountModel|null = await sut.load(anyValue, anyRole)
    expect(account).toBeNull()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub }: SutTypes = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(throwError)
    const resultPromise: Promise<AccountModel|null> = sut.load(anyValue, anyRole)
    await expect(resultPromise).rejects.toThrow()
  })

  test('Should returns an account on success', async () => {
    const { sut } = makeSut()
    const account: AccountModel|null = await sut.load(anyValue, anyRole)
    expect(account).toEqual(mockAccountModel())
  })

})