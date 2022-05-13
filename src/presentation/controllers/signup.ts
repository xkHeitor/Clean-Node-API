import { badRequest } from './../helpers/http-helper';
import MissingParamError from '../errors/missing-param-error';
import { HttpRequest, HttpResponse } from './../protocols/http';

export default class SignUpController {

  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields: string[] = ["name", "email"];
    for (const field of requiredFields) {
      if(!httpRequest.body[field]) return badRequest(new MissingParamError(field));
    }

    return { statusCode: 200, body: {} };
  }

}