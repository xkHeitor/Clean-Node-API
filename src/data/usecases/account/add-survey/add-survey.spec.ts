import MockDate from 'mockdate'
import { DbAddSurvey } from './add-survey'
import { AddSurveyModel, AddSurveyRepository } from './add-survey-protocols'

describe('DbAddSurvey UseCase', () => {

  const makeSurveyData = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  })

  const makeAddSurveyRepository = (): AddSurveyRepository => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add (surveyData: AddSurveyModel): Promise<void> {
        return new Promise(resolve => resolve())
      }
    }
    return new AddSurveyRepositoryStub()
  }

  type SutTypes = {
    sut: DbAddSurvey,
    addSurveyRepositoryStub: AddSurveyRepository
  }

  const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub: AddSurveyRepository = makeAddSurveyRepository()
    const sut: DbAddSurvey = new DbAddSurvey(addSurveyRepositoryStub)
    return { sut, addSurveyRepositoryStub }
  }

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData: AddSurveyModel = makeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should returns 400 if AddSurveyRepository throws an error', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const rejectPromise: Promise<void> = new Promise((resolve, reject) => reject(new Error()))
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(rejectPromise)
    const promise: Promise<void> = sut.add(makeSurveyData())
    await expect(promise).rejects.toThrow()
  })
})