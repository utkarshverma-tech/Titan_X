import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    /** Set by `requireUser` after session is validated */
    userId?: number;
  }
}

export {};
