// src/types/express.d.ts
declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
    }
  }
}
export {};