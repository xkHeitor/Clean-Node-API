import { Encrypted } from './../../data/protocols/encrypted';
import BcryptAdapter from './bcrypt-adater';
import bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('any_hash'));
  }
}));

describe('Bcrypt ADapter', () => {

  test('Should call bcrypt with correct values', async () => {
    const salt: number = 12;
    const sut: Encrypted = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    const value: string = 'any_value';
    await sut.encrypt(value);
    expect(hashSpy).toHaveBeenCalledWith(value, salt);
  });

  test('Should return a hash on success', async () => {
    const salt: number = 12;
    const sut: Encrypted = new BcryptAdapter(salt);
    const value: string = 'any_value';
    const hash: string = await sut.encrypt(value);
    expect(hash).toBe('any_hash');
  });

});