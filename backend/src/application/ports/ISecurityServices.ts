export interface TokenPayload {
  id: number;
  role: string;
}

export interface ITokenService {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload;
}

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
