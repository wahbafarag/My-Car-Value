import { Request } from 'express';
import { User } from '../user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: User;
  }
}
