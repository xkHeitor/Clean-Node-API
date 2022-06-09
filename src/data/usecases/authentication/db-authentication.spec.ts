import { DbAuthentication } from './db-authentication'
import { 
  LoadAccountByEmailRepository,
  AuthenticationModel,
  AccountModel,
  HashComparer,
  TokenGenerator,
  UpdateAccessTokenRepository 
} from './db-authentication-protocols'

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

  const makeTokenGenerator = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
      async generate (id: string): Promise<string> {
        return new Promise(resolve => resolve('any_token'))
      }
    }
    return new TokenGeneratorStub()
  }

  const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
      async update (id: string, token: string): Promise<void> {
        return new Promise(resolve => resolve())
      }
    }
    return new UpdateAccessTokenRepositoryStub()
  }

  interface SutTypes {
    sut: DbAuthentication;
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparerStub: HashComparer
    tokenGeneratorStub: TokenGenerator
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository = makeLoadAccountByEmailRepositoryStub()
    const hashComparerStub: HashComparer = makeHashComparer()
    const tokenGeneratorStub: TokenGenerator = makeTokenGenerator()
    const updateAccessTokenRepositoryStub: UpdateAccessTokenRepository = makeUpdateAccessTokenRepositoryStub() 
    const sut: DbAuthentication = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub)
    return { sut, loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub, updateAccessTokenRepositoryStub }
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

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub }: SutTypes = makeSut()
    const rejectPromise: Promise<boolean> = new Promise((resolve, reject) => reject(new Error()))
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(rejectPromise)
    const resultPromise: Promise<string> = sut.auth(makeFakeAuthentication())
    await expect(resultPromise).rejects.toThrow()
  })

  test('Should return empty if HashComparer returns false', async () => {
    const { sut, hashComparerStub }: SutTypes = makeSut()
    const promise: Promise<boolean> = new Promise(resolve => resolve(false))
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(promise)
    const accessToken: string = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeFalsy()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub }: SutTypes = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub }: SutTypes = makeSut()
    const rejectPromise: Promise<string> = new Promise((resolve, reject) => reject(new Error()))
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(rejectPromise)
    const resultPromise: Promise<string> = sut.auth(makeFakeAuthentication())
    await expect(resultPromise).rejects.toThrow()
  })

  test('Should call TokenGenerator and returns a token on success', async () => {
    const { sut }: SutTypes = makeSut()
    const accessToken: string = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub }: SutTypes = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub }: SutTypes = makeSut()
    const rejectPromise: Promise<void> = new Promise((resolve, reject) => reject(new Error()))
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(rejectPromise)
    const resultPromise: Promise<string> = sut.auth(makeFakeAuthentication())
    await expect(resultPromise).rejects.toThrow()
  })

})