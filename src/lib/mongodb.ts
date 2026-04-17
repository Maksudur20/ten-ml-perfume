import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  console.warn('⚠️  MONGODB_URI not configured. API routes will fail. Add MONGODB_URI to environment variables.')
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so we don't lose the connection on hot reload
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    if (!uri) throw new Error('MONGODB_URI environment variable is not set')
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable
  if (!uri) throw new Error('MONGODB_URI environment variable is not set')
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
