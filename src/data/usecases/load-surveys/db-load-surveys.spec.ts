import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'

import MockDate from 'mockdate'

describe('DbLoadSurveys', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  const makeFakeSurveys = (): SurveyModel [] => {
    return [{
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }, {
      id: 'other_id',
      question: 'other_question',
      answers: [{
        image: 'other_image',
        answer: 'other_answer'
      }],
      date: new Date()
    }]
  }

  const makeLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
    class LoadSurveysRepositoryStub implements LoadSurveysRepository {
      async loadAll(): Promise<SurveyModel[]> {
        return new Promise(resolve => resolve(makeFakeSurveys()))
      }
    }
    return new LoadSurveysRepositoryStub()
  }

  interface SutTypes {
    sut: DbLoadSurveys
    loadSurveysRepositoryStub: LoadSurveysRepository    
  }

  const makeSut = (): SutTypes => {
    const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub()
    const sut: DbLoadSurveys = new DbLoadSurveys(loadSurveysRepositoryStub)
    return { sut, loadSurveysRepositoryStub }
  }

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub }: SutTypes = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut }: SutTypes = makeSut()
    const surveys: SurveyModel[] = await sut.load()
    expect(surveys).toEqual(makeFakeSurveys())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub }: SutTypes = makeSut()
    const error: Error = new Error()
    const errorPromise: Promise<SurveyModel[]> = new Promise((resolve, reject) => reject(error))
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(errorPromise)
    const promise: Promise<SurveyModel[]> = sut.load()
    await expect(promise).rejects.toThrow()
  })

})