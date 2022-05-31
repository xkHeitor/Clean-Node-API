import { Encrypted } from '../../data/protocols/criptograpy/encrypted'
import BcryptAdapter from './bcrypt-adater'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('any_hash'))
  }
}))

const value: string = 'any_value'
const salt: number = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt ADapter', () => {

  test('Should call bcrypt with correct values', async () => {
    const sut: Encrypted = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    
    await sut.encrypt(value)
    expect(hashSpy).toHaveBeenCalledWith(value, salt)
  })

  test('Should return a hash on success', async () => {
    const sut: Encrypted = makeSut()
    const hash: string = await sut.encrypt(value)
    expect(hash).toBe('any_hash')
  })

})