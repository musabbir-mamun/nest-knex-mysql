import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let token = 'supersecrettoken';
    if (token == 'supersecrettoken') {
      next();
    } else {
      res.write(JSON.stringify({ result: 'Invalid token' }));
      res.end();
    }
  }
}
