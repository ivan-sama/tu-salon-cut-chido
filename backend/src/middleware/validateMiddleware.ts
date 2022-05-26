import { NextFunction, Request, Response } from 'express';
import { AnySchema, ValidationError } from 'yup';

export const validateBody =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await schema.validate(req.body);
      req.body = body;
      return next();
    } catch (err) {
      if (err instanceof ValidationError) {
        console.log(err);
        return res.sendStatus(400);
      }
      return res.sendStatus(500);
    }
  };

export const validateQuery =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = await schema.validate(req.query);
      req.query = query;
      return next();
    } catch (err) {
      if (err instanceof ValidationError) {
        console.log(err);
        return res.sendStatus(400);
      }
      return res.sendStatus(500);
    }
  };
