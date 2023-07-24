import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';

interface SessionData {
  userId?: string;
}

// declare global {
//   namespace Express {
//     interface express {
//       currentUser?: User;
//     }
//   }
// }

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = (req.session as SessionData) || {};
    if (userId) {
      const user = await this.usersService.findOne(parseInt(userId));
      req.currentUser = user;
    }
    next();
  }
}
