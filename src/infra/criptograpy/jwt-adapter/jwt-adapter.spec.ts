import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

const anyID: string = 'any_id'
const keySecret: string = 'secret'
const token: string = 'token'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve(token))
  }
}))

describe('JWT Adapter', () => {

  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter(keySecret)
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt(anyID)
    expect(signSpy).toHaveBeenCalledWith({ id: anyID }, keySecret)
  })

  test('Should return a token on sign success', async () => {
    const sut = new JwtAdapter(keySecret)
    const accessToken = await sut.encrypt(anyID)
    expect(accessToken).toBe(token)
  })

  test('Should throw if sign throws', async () => {
    const sut = new JwtAdapter(keySecret)
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const accessToken: Promise<string> = sut.encrypt(anyID)
    await expect(accessToken).rejects.toThrow()
  })

})