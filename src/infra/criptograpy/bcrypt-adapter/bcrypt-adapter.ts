import { HashComparer } from '@/data/protocols/criptograpy/hash-comparer'
import { Hasher } from '@/data/protocols/criptograpy/hasher'
import bcrypt from 'bcrypt'

export default class BcryptAdapter implements Hasher, HashComparer {
  
  constructor(private readonly salt: number){}
  
  async compare(value: string, hash: string): Promise<boolean> {
    const isValid: boolean = await bcrypt.compare(value, hash)
    return isValid
  }

  async hash(value: string): Promise<string> {
    const hash: string = await bcrypt.hash(value, this.salt)
    return hash
  }

}