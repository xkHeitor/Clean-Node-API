import { AddAccount } from '../../../domain/usecases/add-account';
import DbAddAccount from './db-add-account';
describe('DbAddAccount', () => {

  test('Should call Encrypt with correct password', async () => {
    class EncryptStub {
      async encrypt(value: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'));
      }
    }

    const encryptedStub: EncryptStub = new EncryptStub();
    const sut: AddAccount = new DbAddAccount(encryptedStub);
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