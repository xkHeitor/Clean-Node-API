import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepository, mockUpdateAccessTokenRepository } from '@/data/test'
import { makeFakeAuthentication, throwError } from '@/domain/test'
import { DbAuthentication } from './db-authentication'
import { 
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository 
} from './db-authentication-protocols'

describe('DbAuthentication UseCase', () => {

  type SutTypes = {
    sut: DbAuthentication;
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    tokenGeneratorStub: Encrypter
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository = mockLoadAccountByEmailRepository()
    const hashComparerStub: HashComparer = mockHashComparer()
    const tokenGeneratorStub: Encrypter = mockEncrypter()
    const updateAccessTokenRepositoryStub: UpdateAccessTokenRepository = mockUpdateAccessTokenRepository() 
    const sut: DbAuthentication = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub)
    return { sut, loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub }
  }

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub }: SutTypes = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub }: SutTypes = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return empty if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub }: SutTypes = makeSut()
    const promise: Promise<null> = Promise.resolve(null)
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(promise)
    const accessToken: string = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeFalsy()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub }: SutTypes = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub }: SutTypes = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(throwError)
    const resultPromise: Promise<string> = sut.auth(makeFakeAuthentication())
    await expect(resultPromise).rejects.toThrow()
  })

  test('Should return empty if HashComparer returns false', async () => {
    const { sut, hashComparerStub }: SutTypes = makeSut()
    const promise: Promise<boolean> = Promise.resolve(false)
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(promise)
    const accessToken: string = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeFalsy()
  })

  test('Should call Encrypter with correct id', async () => {
    const { sut, tokenGeneratorStub }: SutTypes = makeSut()
    const encryptSpy = jest.spyOn(tokenGeneratorStub, 'encrypt')
    await sut.auth(makeFakeAuthentication())
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, tokenGeneratorStub }: SutTypes = makeSut()
    jest.spyOn(tokenGeneratorStub, 'encrypt').mockImplementationOnce(throwError)
    const resultPromise: Promise<string> = sut.auth(makeFakeAuthentication())
    await expect(resultPromise).rejects.toThrow()
  })

  test('Should call Encrypter and returns a token on success', async () => {
    const { sut }: SutTypes = makeSut()
    const accessToken: string = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub }: SutTypes = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub }: SutTypes = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockImplementationOnce(throwError)
    const resultPromise: Promise<string> = sut.auth(makeFakeAuthentication())
    await expect(resultPromise).rejects.toThrow()
  })

})