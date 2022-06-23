import { HttpRequest, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

describe('AddSurvey Controller', () => {

  const makeFakeRequest = (): HttpRequest => ({
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
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

  interface sutTypes {
    sut: AddSurveyController,
    validationStub: Validation
  }

  const makeSut = (): sutTypes => {
    const validationStub: Validation = makeValidation()
    const sut: AddSurveyController = new AddSurveyController(validationStub)
    return { sut, validationStub }
  }

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut() 
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

})