import { TokenPayload } from '../../application/ports/ISecurityServices';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
