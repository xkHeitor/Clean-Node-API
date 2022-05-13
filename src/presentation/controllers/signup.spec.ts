import { InvalidParamError, MissingParamError, ServerError } from "../errors"
import { EmailValidator } from './../protocols/email-validator';
import { Controller } from './../protocols/controller';
import { HttpResponse } from './../protocols/http';
import SignUpController from "./signup";

interface SutTypes {
  sut: Controller, emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub: EmailValidator = new EmailValidatorStub();
  const sut: Controller = new SignUpController(emailValidatorStub);
  return {
    sut, emailValidatorStub
  }
}

describe("SignUp Controller", () => {

  test("Should return 400 if no name is provided", () => {
    const { sut }: SutTypes = makeSut();
    const httpRequest = {
      body: {
        email: "any_email@mail.com",
        password: "any_pass", 
        passwordConfirmation: "any_pass"
      }
    }
    const httpResponse: HttpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  test("Should return 400 if no email is provided", () => {
    const { sut }: SutTypes = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_pass", 
        passwordConfirmation: "any_pass"
      }
    }
    const httpResponse: HttpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is provided", () => {
    const { sut }: SutTypes = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        passwordConfirmation: "any_pass"
      }
    }
    const httpResponse: HttpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 400 if no passwordConfirmation is provided", () => {
    const { sut }: SutTypes = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_pass"
      }
    }
    const httpResponse: HttpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("passwordConfirmation"));
  });

  test("Should return 400 if an invalid email is provided", () => {
    const { sut, emailValidatorStub }: SutTypes = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: "any_name", email: "invalid_email@mail.com",
        password: "any_pass", passwordConfirmation: "any_pass"
      }
    }
    const httpResponse: HttpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });

  test("Should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub }: SutTypes = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest = {
      body: {
        name: "any_name", email: "any_email@mail.com",
        password: "any_pass", passwordConfirmation: "any_pass"
      }
    }
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test("Should return 500 if EmailValidator throws ", () => {
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        throw new Error();
      }
    }
    const emailValidatorStub: EmailValidator = new EmailValidatorStub();
    const sut: Controller = new SignUpController(emailValidatorStub);
    const httpRequest = {
      body: {
        name: "any_name", email: "any_email@mail.com",
        password: "any_pass", passwordConfirmation: "any_pass"
      }
    }
    const httpResponse: HttpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

});