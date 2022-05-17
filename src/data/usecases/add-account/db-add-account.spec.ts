
import { AddAccount, AccountModel, Encrypted } from './db-add-account-protocols';
import DbAddAccount from './db-add-account';

interface SutTypes {
  sut: AddAccount
  encryptedStub: Encrypted
}

const makeEncrypted = (): Encrypted => {
  class EncryptStub implements Encrypted {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }
  return new EncryptStub();
}

const makeSut = (): SutTypes => {
  const encryptedStub: Encrypted = makeEncrypted();
  const sut: AddAccount = new DbAddAccount(encryptedStub);
  return { sut, encryptedStub };
}

describe('DbAddAccount', () => {

  test('Should call Encrypt with correct password', async () => { 
    const { sut, encryptedStub } = makeSut();
    const encryptSpy = jest.spyOn(encryptedStub, 'encrypt');
    const accountData = {
      name: 'valid_name', 
      email: 'valid_email',
      password: 'valid_password' 
    };
    
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password);
  });

  test('Should throw if Encrypted throws', async () => { 
    const { sut, encryptedStub } = makeSut();
    jest.spyOn(encryptedStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );
    const accountData = {
      name: 'valid_name', 
      email: 'valid_email',
      password: 'valid_password' 
    };
    
    const promise: Promise<AccountModel> = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

});