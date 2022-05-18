import { Collection, MongoClient, MongoClientOptions } from 'mongodb'
import { UninitializedDbError } from '../../../errors/';

interface MongoHelperType {
  client: MongoClient|null;
  connect: (url: string) => Promise<void>;
  disconnect: () => Promise<void>;
  getCollection: (name: string) => Collection;
}

export const MongoHelper: MongoHelperType = {
  
  client: null,

  async connect(url: string): Promise<void> {
    const options: MongoClientOptions = {};
    this.client = await MongoClient.connect(url, options);
  },
  
  async disconnect(): Promise<void> {
    if (!this.client) throw new UninitializedDbError();
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  }
  
};