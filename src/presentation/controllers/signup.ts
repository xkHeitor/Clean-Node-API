import { Controller } from './../protocols/controller';
import { badRequest } from './../helpers/http-helper';
import { HttpRequest, HttpResponse } from './../protocols/http';
import MissingParamError from '../errors/missing-param-error';
import { EmailValidator } from '../protocols/email-validator';
import InvalidParamError from '../errors/invalid-param-error';

export default class SignUpController implements Controller {

  constructor(private readonly emailValidator: EmailValidator){}

  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields: string[] = ["name", "email", "password", "passwordConfirmation"];
    for (const field of requiredFields) {
      if(!httpRequest.body[field]) return badRequest(new MissingParamError(field));
    }

    const emailIsValid: boolean = this.emailValidator.isValid(httpRequest.body.email);
    if(!emailIsValid) return badRequest(new InvalidParamError("email"));
    return { statusCode: 200, body: {} };
  }

}