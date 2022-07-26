import { Collection, MongoClient, MongoClientOptions } from 'mongodb'
import { UninitializedDbError } from '@/infra/errors'

interface MongoHelperType {
  client: MongoClient|null;
  url: string|null;
  connect: (url: string) => Promise<void>;
  disconnect: () => Promise<void>;
  getCollection: (name: string) => Promise<Collection>;
  map: (collection: any) => any;
  mapAll: (collections: any) => any;
}

export const MongoHelper: MongoHelperType = {
  
  client: null,
  url: null,

  async connect(url: string): Promise<void> {
    const options: MongoClientOptions = {}
    this.client = await MongoClient.connect(url, options)
    this.url = url
  },
  
  async disconnect(): Promise<void> {
    if (!this.client) throw new UninitializedDbError()
    await this.client.close()
    this.client = null
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) await this.connect(this.url)
    return this.client.db().collection(name)
  },
  
  map: (collection: any): any => {
    const { _id, ...collectionWithId } = collection
    return Object.assign({}, collectionWithId, { id: String(_id) })
  },

  mapAll: (collections: any): any => {
    return collections.map(collection => MongoHelper.map(collection))
  }
  
}