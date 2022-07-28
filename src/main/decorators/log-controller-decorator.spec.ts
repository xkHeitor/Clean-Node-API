import { AccountModel } from '@/domain/models/account/account'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller } from '@/presentation/protocols'
import { HttpRequest, HttpResponse } from '@/presentation/protocols/http'
import { LogErrorRepository } from '@/data/protocols/repository/log/log-error-repository'
import { LogControllerDecorator } from './log-controller-decorator'

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = ok(makeFakeAccount())
      return new Promise(resolve => resolve(httpResponse))
    }
  }
  return new ControllerStub()
}

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeSut = (): SutTypes => {
  const controllerStub: Controller = makeController()
  const logErrorRepositoryStub: LogErrorRepository = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { controllerStub, sut, logErrorRepositoryStub }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_pass'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_pass',
    passwordConfirmation: 'any_pass'
  }
})

const makeFakeServerError = (): HttpResponse => {
  const fakeError: Error = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

describe('Log Controller Decorator', () => {

  test('Should call controller handle ', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call LogControllerRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    const errorPromise: Promise<HttpResponse> = new Promise(resolve => resolve(makeFakeServerError()))
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(errorPromise)
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })

})