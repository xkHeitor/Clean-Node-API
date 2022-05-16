import { AddAccount } from './../../domain/usecases/add-account';
import { Controller, EmailValidator, HttpRequest, HttpResponse } from './../protocols';
import { badRequest, serverError } from './../helpers/http-helper';
import { MissingParamError, InvalidParamError } from "../errors";

export default class SignUpController implements Controller {

  constructor(private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount){}

  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields: string[] = ["name", "email", "password", "passwordConfirmation"];
    for (const field of requiredFields) {
      if(!httpRequest.body[field]) return badRequest(new MissingParamError(field));
    }

    const { name, email, password, passwordConfirmation } = httpRequest.body;
    if(password !== passwordConfirmation) 
      return badRequest(new InvalidParamError("passwordConfirmation"));

    try {
      const emailIsValid: boolean = this.emailValidator.isValid(email);
      if(!emailIsValid) return badRequest(new InvalidParamError("email"));
      this.addAccount.add({ name, email, password });
      return { statusCode: 200, body: {} };
    } catch(error: any) {
      return serverError();
    }
  }

}