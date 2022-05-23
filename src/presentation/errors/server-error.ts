export class ServerError extends Error {
  constructor(stack?: string) {
    super('Internal server error')
    this.name = 'InvalidServerError'
    this.stack = stack ?? this.stack
  }
}