import { AccountModel, AddAccount, AddAccountParams, AddAccountRepository, Hasher, LoadAccountByEmailRepository } from './db-add-account-protocols'
import DbAddAccount from './db-add-account'
import { mockAddAccountParams, mockAccountModel, throwError } from '@/domain/test'
import { mockAddAccountRepository, mockHasher, mockLoadAccountByEmailRepository } from '@/data/test'

type SutTypes = {
  sut: AddAccount
  hasherStub: Hasher,
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub: Hasher = mockHasher()
  const addAccountRepositoryStub: AddAccountRepository = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository = mockLoadAccountByEmailRepository()
  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValue(Promise.resolve(null))
  const sut: AddAccount = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return { sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub }
}

describe('DbAddAccount', () => {

  test('Should call Hasher with correct password', async () => { 
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = mockAddAccountParams()
    
    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Hasher throws', async () => { 
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)
    const promise: Promise<AccountModel|null> = sut.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => { 
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = mockAddAccountParams()
    
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name', 
      email: 'any_email',
      password: 'hashed_password' 
    })
  })

  test('Should throw if AddAccountRepository throws', async () => { 
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)
    const accountData = mockAddAccountParams()
    
    const promise: Promise<AccountModel|null> = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => { 
    const { sut } = makeSut()
    const accountData = mockAddAccountParams()
    const account = await sut.add(accountData)
    expect(account).toEqual(mockAccountModel())
  })

  test('Should return null if LoadAccountByEmailRepository not return null', async () => { 
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      Promise.resolve(mockAccountModel())
    )
    const account: AccountModel|null = await sut.add(mockAddAccountParams())
    expect(account).toBeNull()
  })
  
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub }: SutTypes = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const accountData: AddAccountParams = mockAddAccountParams()
    await sut.add(accountData)
    expect(loadSpy).toHaveBeenCalledWith(accountData.email)
  })

})