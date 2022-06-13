import { Encrypter } from './../../../data/protocols/criptograpy/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter {
  
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const token: string = await jwt.sign({ id: value }, this.secret)
    return token
  }

}