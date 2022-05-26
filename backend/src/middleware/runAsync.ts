import { NextFunction, Request, Response } from 'express';

type ExpressMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

const runAsync =
  (...middleware: ExpressMiddleware[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    Promise.all(middleware.map((f) => f(req, res, next)));
  };

export default runAsync;
