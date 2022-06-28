import { Decrypter } from './../../../data/protocols/criptograpy/decrypter'
import { Encrypter } from './../../../data/protocols/criptograpy/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const token: string = await jwt.sign({ id: value }, this.secret)
    return token
  }

  async decrypt(value: string): Promise<string> {
    await jwt.verify(value, this.secret)
    return null
  }

}