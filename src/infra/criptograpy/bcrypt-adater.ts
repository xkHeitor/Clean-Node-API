import { Encrypted } from './../../data/protocols/encrypted';
import bcrypt from 'bcrypt';

export default class BcryptAdapter implements Encrypted {
  
  constructor(private readonly salt: number){}

  async encrypt(value: string): Promise<string> {
    await bcrypt.hash(value, this.salt);
    return 'null';
  }

}