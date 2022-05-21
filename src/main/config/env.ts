export default {
  mongoURL: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api',
  mongoTest: global.__MONGO_URI__,
  port: process.env.PORT ?? 5050
}