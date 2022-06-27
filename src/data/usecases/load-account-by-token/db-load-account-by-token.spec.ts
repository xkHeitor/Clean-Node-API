import { AccountModel } from './../../../domain/models/account';
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from './../../protocols/criptograpy/decrypter'

describe('DbLoadAccountByToken UseCase', () => {

  const anyRole: string = 'anyRole'
  const anyValue: string = 'any_value'
  const anyToken: string = 'any_token'

  const makeDecrypter = (): Decrypter => {
    class DecrypterStub implements Decrypter {
      async decrypt(value: string): Promise<string|null> {
        return new Promise(resolve => resolve(anyValue))
      }
    }
    return new DecrypterStub()
  }

  interface sutTypes {
    sut: DbLoadAccountByToken
    decryptStub: Decrypter
  }

  const makeSut = (): sutTypes => {
    const decryptStub: Decrypter = makeDecrypter()
    const sut = new DbLoadAccountByToken(decryptStub)
    return { sut, decryptStub}
  }

  test('Should call Decrypter with correct values', async () => {
    const { sut, decryptStub } = makeSut()
    const decryptSpy = jest.spyOn(decryptStub, 'decrypt')
    await sut.load(anyToken, anyRole)
    expect(decryptSpy).toHaveBeenCalledWith(anyToken)
  })

  test('Should returns null if Decrypter returns null', async () => {
    const { sut, decryptStub } = makeSut()
    const resolvePromise: Promise<string|null> = new Promise(resolve => resolve(null)) 
    jest.spyOn(decryptStub, 'decrypt').mockReturnValueOnce(resolvePromise)
    const account: AccountModel|null = await sut.load(anyToken, anyRole)
    expect(account).toBeNull()
  })

})