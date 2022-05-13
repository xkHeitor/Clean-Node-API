import { Controller } from './../protocols/controller';
import { badRequest } from './../helpers/http-helper';
import { HttpRequest, HttpResponse } from './../protocols/http';
import MissingParamError from '../errors/missing-param-error';

export default class SignUpController implements Controller {

  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields: string[] = ["name", "email", "password", "passwordConfirmation"];
    for (const field of requiredFields) {
      if(!httpRequest.body[field]) return badRequest(new MissingParamError(field));
    }

    return { statusCode: 200, body: {} };
  }

}