import { DbLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel, Decrypter, LoadAccountByTokenRepository } from './db-load-account-by-token-protocols'

describe('DbLoadAccountByToken UseCase', () => {

  const anyRole: string = 'anyRole'
  const anyValue: string = 'any_value'

  const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id', 
    name: 'valid_name',
    email: 'valid_email', 
    password: 'hashed_password'
  })

  const makeDecrypter = (): Decrypter => {
    class DecrypterStub implements Decrypter {
      async decrypt(value: string): Promise<string|null> {
        return new Promise(resolve => resolve(anyValue))
      }
    }
    return new DecrypterStub()
  }

  const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
      async loadByToken (toke: string, role?: string): Promise<AccountModel|null> {
        return new Promise(resolve => resolve(makeFakeAccount()))
      }
    }
    return new LoadAccountByTokenRepositoryStub()
  }

  type SutTypes = {
    sut: DbLoadAccountByToken
    decryptStub: Decrypter
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  }

  const makeSut = (): SutTypes => {
    const decryptStub: Decrypter = makeDecrypter()
    const loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository = makeLoadAccountByTokenRepository()
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
    const rejectPromise: Promise<string|null> = new Promise((resolve, reject) => reject(new Error()))
    jest.spyOn(decryptStub, 'decrypt').mockReturnValueOnce(rejectPromise)
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
    const rejectPromise: Promise<AccountModel|null> = new Promise((resolve, reject) => reject(new Error()))
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(rejectPromise)
    const resultPromise: Promise<AccountModel|null> = sut.load(anyValue, anyRole)
    await expect(resultPromise).rejects.toThrow()
  })

  test('Should returns an account on success', async () => {
    const { sut } = makeSut()
    const account: AccountModel|null = await sut.load(anyValue, anyRole)
    expect(account).toEqual(makeFakeAccount())
  })

})