import "express-serve-static-core";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
  }
}

export {};

