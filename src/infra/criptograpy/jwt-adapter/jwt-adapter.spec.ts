import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

const anyId: string = 'any_id'
const anyValue: string = 'any_value'
const keySecret: string = 'secret'
const token: string = 'token'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return Promise.resolve(token)
  },

  async verify (token: string): Promise<string> {
    return Promise.resolve(anyValue)
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter(keySecret)
}

describe('JWT Adapter', () => {

  describe('Sign', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt(anyId)
      expect(signSpy).toHaveBeenCalledWith(anyId, keySecret)
    })
  
    test('Should return a token on sign success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt(anyId)
      expect(accessToken).toBe(token)
    })
  
    test('Should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const accessToken: Promise<string> = sut.encrypt(anyId)
      await expect(accessToken).rejects.toThrow()
    })
  })

  describe('Verify', () => {
    test('Should call verify with correct values', async () => {
      const sut: JwtAdapter = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt(token)
      expect(verifySpy).toHaveBeenCalledWith(token, keySecret)
    })

    test('Should return a token on verify success', async () => {
      const sut = makeSut()
      const value: string|null = await sut.decrypt(token)
      expect(value).toBe(anyValue)
    })
    
    test('Should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const accessToken: Promise<string|null> = sut.decrypt(anyId)
      await expect(accessToken).rejects.toThrow()
    })
  })

})