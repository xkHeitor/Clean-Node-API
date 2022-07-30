import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router: Router = Router()
  app.use('/api', router)
  readdirSync(`${__dirname}/../routes/src`).map(async file => {
    const ignoredExtensions: string[] = ['.test.', '.spec.'] 
    if (!ignoredExtensions.find(extension => file.includes(extension)) && !file.endsWith('.map')) {
      (await import(`../routes/src/${file}`)).default(router)
    }
  })

}