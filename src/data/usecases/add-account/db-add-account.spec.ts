import { Encrypted } from './../../protocols/encrypted';
import { AddAccount } from '../../../domain/usecases/add-account';
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

});