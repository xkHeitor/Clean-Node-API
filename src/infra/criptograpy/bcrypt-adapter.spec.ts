import { Hasher } from '../../data/protocols/criptograpy/hasher'
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
    const sut: Hasher = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    
    await sut.hash(value)
    expect(hashSpy).toHaveBeenCalledWith(value, salt)
  })

  test('Should return a hash on success', async () => {
    const sut: Hasher = makeSut()
    const hash: string = await sut.hash(value)
    expect(hash).toBe('any_hash')
  })

})