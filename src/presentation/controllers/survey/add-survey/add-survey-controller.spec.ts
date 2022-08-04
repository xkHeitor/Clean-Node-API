
import { HttpRequest, HttpResponse, Validation, AddSurvey, AddSurveyParams } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

import MockDate from 'mockdate'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/domain/test'

describe('AddSurvey Controller', () => {

  const makeFakeRequest = (): HttpRequest => ({
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }
  })

  const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
      validate (input: any): Error|undefined {
        return undefined
      }
    }
    return new ValidationStub()
  }

  const makeAddSurvey = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
      async add (data: AddSurveyParams): Promise<void> {
        return new Promise(resolve => resolve())
      } 
    }
    return new AddSurveyStub()
  }

  type SutTypes = {
    sut: AddSurveyController,
    validationStub: Validation
    addSurveyStub: AddSurvey
  }

  const makeSut = (): SutTypes => {
    const validationStub: Validation = makeValidation()
    const addSurveyStub: AddSurvey = makeAddSurvey()
    const sut: AddSurveyController = new AddSurveyController(validationStub, addSurveyStub)
    return { sut, validationStub, addSurveyStub }
  }

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut() 
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    const error: Error = new Error()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(error))
  })

  test('Should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut() 
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(throwError)
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    const error: Error = new Error()
    expect(httpResponse).toEqual(serverError(error))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })

})