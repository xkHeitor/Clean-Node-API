import { Controller, HttpRequest, HttpResponse } from './../../presentation/protocols'
import { Request, Response } from 'express'

export const adaptRouteExpress = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    } 
    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    let responseBody = httpResponse.body
    if (httpResponse.statusCode < 200 || httpResponse.statusCode > 299) responseBody = { error: httpResponse.body.message }
    res.status(httpResponse.statusCode).json(responseBody)
  }
}