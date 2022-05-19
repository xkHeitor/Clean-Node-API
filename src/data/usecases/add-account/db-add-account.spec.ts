import { AddAccount, AccountModel, Encrypted, AddAccountModel, AddAccountRepository } from './db-add-account-protocols'
import DbAddAccount from './db-add-account'

const makeEncrypted = (): Encrypted => {
  class EncryptStub implements Encrypted {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncryptStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount: AccountModel = {
        id: 'valid_id', 
        name: 'valid_name',
        email: 'valid_email', 
        password: 'hashed_password'
      } 
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: AddAccount
  encryptedStub: Encrypted,
  addAccountRepositoryStub: AddAccountRepository
  
}

const makeSut = (): SutTypes => {
  const encryptedStub: Encrypted = makeEncrypted()
  const addAccountRepositoryStub: AddAccountRepository = makeAddAccountRepository()
  const sut: AddAccount = new DbAddAccount(encryptedStub, addAccountRepositoryStub)
  return { sut, encryptedStub, addAccountRepositoryStub }
}

describe('DbAddAccount', () => {

  test('Should call Encrypt with correct password', async () => { 
    const { sut, encryptedStub } = makeSut()
    const encryptSpy = jest.spyOn(encryptedStub, 'encrypt')
    const accountData = {
      name: 'valid_name', 
      email: 'valid_email',
      password: 'valid_password' 
    }
    
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Encrypted throws', async () => { 
    const { sut, encryptedStub } = makeSut()
    jest.spyOn(encryptedStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const accountData = {
      name: 'valid_name', 
      email: 'valid_email',
      password: 'valid_password' 
    }
    
    const promise: Promise<AccountModel> = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => { 
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name', 
      email: 'valid_email',
      password: 'valid_password' 
    }
    
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
    const accountData = {
      name: 'valid_name', 
      email: 'valid_email',
      password: 'valid_password' 
    }
    
    const promise: Promise<AccountModel> = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => { 
    const { sut } = makeSut()
    const accountData = {
      name: 'valid_name', 
      email: 'valid_email',
      password: 'valid_password' 
    }
    
    const account = await sut.add(accountData)
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name', 
      email: 'valid_email',
      password: 'hashed_password' 
    })
  })

})