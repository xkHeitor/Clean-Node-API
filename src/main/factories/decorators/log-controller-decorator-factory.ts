import { LogControllerDecorator } from './../../decorators/log-controller-decorator'
import { LogMongoRepository } from './../../../infra/db/mongodb/log/log-mongo-repository'
import { Controller } from './../../../presentation/protocols/controller'

export const makeLogControllerDecorator = (controller: Controller): Controller => {
  const logMongoRepository: LogMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}