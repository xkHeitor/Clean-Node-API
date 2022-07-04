export default {
  mongoURL: process.env.MONGO_URL ?? 'mongodb://localhost:27017/clean-node-api',
  mongoTest: global.__MONGO_URI__ ?? 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.JWT_SECRET ?? 'cNa/13-GGbh1@27017'
}