import { AddAccount, AccountModel, Hasher, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'
import DbAddAccount from './db-add-account'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount: AccountModel = makeFakeAccount()
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: AddAccount
  hasherStub: Hasher,
  addAccountRepositoryStub: AddAccountRepository
  
}

const makeSut = (): SutTypes => {
  const hasherStub: Hasher = makeHasher()
  const addAccountRepositoryStub: AddAccountRepository = makeAddAccountRepository()
  const sut: AddAccount = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return { sut, hasherStub, addAccountRepositoryStub }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id', 
  name: 'valid_name',
  email: 'valid_email', 
  password: 'hashed_password'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name', 
  email: 'valid_email',
  password: 'valid_password' 
})

describe('DbAddAccount', () => {

  test('Should call Hasher with correct password', async () => { 
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = makeFakeAccountData()
    
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Hasher throws', async () => { 
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const accountData = makeFakeAccountData()
    
    const promise: Promise<AccountModel> = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => { 
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = makeFakeAccountData()
    
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name', 
      email: 'valid_email',
      password: 'hashed_password' 
    })
  })

  test('Should throw if AddAccountRepository throws', async () => { 
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const accountData = makeFakeAccountData()
    
    const promise: Promise<AccountModel> = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => { 
    const { sut } = makeSut()
    const accountData = makeFakeAccountData()
    
    const account = await sut.add(accountData)
    expect(account).toEqual(makeFakeAccount())
  })

})