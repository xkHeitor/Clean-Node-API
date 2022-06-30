declare namespace Express {
  interface Request {
    accountId?: string
  }
}

declare namespace jsonwebtoken {
  interface JwtPayload {
    id?: string
  }
}