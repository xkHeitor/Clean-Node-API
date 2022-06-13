import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

describe('JWT Adapter', () => {

  const anyID: string = 'any_id'
  const keySecret: string = 'secret'

  test('Should call sign with correct values', async () => {
    const sut = new JwtAdapter(keySecret)
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt(anyID)
    expect(signSpy).toHaveBeenCalledWith({ id: anyID }, keySecret)
  })

})