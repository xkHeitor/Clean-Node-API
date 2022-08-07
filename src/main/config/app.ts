import express, { Express } from 'express'
import setupMiddlewares from './middlewares'
import setupSwagger from './swagger'
import setupRoutes from './routes'

const app: Express = express()
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)
export default app