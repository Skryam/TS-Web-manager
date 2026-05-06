declare global {
  namespace Express {
    interface User {
      id: number | string;
      email: string;
    }
    
    interface Request {
      user?: Express.User;
    }
  }
}

export {};