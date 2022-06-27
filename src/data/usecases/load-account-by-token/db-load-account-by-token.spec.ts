import { LoadAccountByTokenRepository } from './../../protocols/repository/account/load-account-by-token-repository'
import { AccountModel } from './../../../domain/models/account';
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from './../../protocols/criptograpy/decrypter'

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

  interface sutTypes {
    sut: DbLoadAccountByToken
    decryptStub: Decrypter
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  }

  const makeSut = (): sutTypes => {
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

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load(anyValue, anyRole)
    expect(loadSpy).toHaveBeenCalledWith(anyValue, anyRole)
  })

})