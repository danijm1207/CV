import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../../application/ports/ISecurityServices';

export class BcryptPasswordHasher implements IPasswordHasher {
  private saltRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
