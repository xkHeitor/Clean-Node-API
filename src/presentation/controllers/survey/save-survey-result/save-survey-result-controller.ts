import { 
  Controller, 
  HttpRequest, 
  HttpResponse, 
  LoadSurveyById, 
  SurveyModel, 
  SaveSurveyResult,
  SurveyResultModel,
  forbidden, 
  serverError,
  InvalidParamError,
  ok
} from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  
  constructor(private readonly loadSurveyById: LoadSurveyById, private readonly saveSurveyResult: SaveSurveyResult){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    const { answer } = httpRequest.body
    const { accountId } = httpRequest

    try {
      const survey: SurveyModel = await this.loadSurveyById.loadById(surveyId)
      if (!survey || !survey.answers) return forbidden(new InvalidParamError('surveyId'))
      const answers: string[] = survey.answers.map(reply => reply.answer)
      if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))

      const surveyResultModel: SurveyResultModel = await this.saveSurveyResult.save({ accountId, surveyId, answer, date: new Date() })
      return ok(surveyResultModel)
    } catch (error: any) {
      return serverError(error)
    }
  }
  
}