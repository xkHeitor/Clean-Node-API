import { Encrypted } from '../../data/protocols/criptograpy/encrypted'
import bcrypt from 'bcrypt'

export default class BcryptAdapter implements Encrypted {
  
  constructor(private readonly salt: number){}

  async encrypt(value: string): Promise<string> {
    const hash: string = await bcrypt.hash(value, this.salt)
    return hash
  }

}