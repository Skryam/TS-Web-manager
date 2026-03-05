import { User } from '@prisma/client'; // или путь к вашему типу Prisma User

declare global {
  namespace Express {
    interface User {
      id: User['id'];
      email: User['email'];
    }
    
    // Для Request.user (опционально, т.к. Passport добавляет его)
    interface Request {
      user?: Express.User;
    }
  }
}
