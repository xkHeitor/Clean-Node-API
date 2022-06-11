import { Hasher } from '../../data/protocols/criptograpy/hasher'
import bcrypt from 'bcrypt'

export default class BcryptAdapter implements Hasher {
  
  constructor(private readonly salt: number){}

  async hash(value: string): Promise<string> {
    const hash: string = await bcrypt.hash(value, this.salt)
    return hash
  }

}