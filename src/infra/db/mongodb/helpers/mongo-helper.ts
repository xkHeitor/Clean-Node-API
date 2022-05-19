import { Collection, MongoClient, MongoClientOptions } from 'mongodb'
import { UninitializedDbError } from '../../../errors/'

interface MongoHelperType {
  client: MongoClient|null;
  connect: (url: string) => Promise<void>;
  disconnect: () => Promise<void>;
  getCollection: (name: string) => Collection;
  map: (collection) => any;
}

export const MongoHelper: MongoHelperType = {
  
  client: null,

  async connect(url: string): Promise<void> {
    const options: MongoClientOptions = {}
    this.client = await MongoClient.connect(url, options)
  },
  
  async disconnect(): Promise<void> {
    if (!this.client) throw new UninitializedDbError()
    await this.client.close()
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name)
  },
  
  map: (collection: any): any => {
    const { _id, ...collectionWithId } = collection
    return Object.assign({}, collectionWithId, { id: String(_id) })
  }
  
}