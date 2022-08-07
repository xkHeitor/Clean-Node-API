import BcryptAdapter from './bcrypt-adapter'
import bcrypt from 'bcrypt'

const valueHash: string = 'any_hash' 
const value: string = 'any_value'
const salt: number = 12

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve(valueHash)
  },

  async compare(): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt ADapter', () => {

  test('Should call hash with correct values', async () => {
    const sut: BcryptAdapter = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    
    await sut.hash(value)
    expect(hashSpy).toHaveBeenCalledWith(value, salt)
  })

  test('Should return a valid hash on hash success', async () => {
    const sut: BcryptAdapter = makeSut()
    const hash: string = await sut.hash(value)
    expect(hash).toBe('any_hash')
  })

  test('Should call compare with correct values', async () => {
    const sut: BcryptAdapter = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare') 
    await sut.compare(value, valueHash)
    expect(compareSpy).toHaveBeenCalledWith(value, valueHash)
  })

  test('Should return true when compare success', async () => {
    const sut: BcryptAdapter = makeSut()
    const isValid: boolean = await sut.compare(value, valueHash)
    expect(isValid).toBe(true)
  })

})