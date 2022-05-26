import * as express from 'express';
import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../middleware/authenticateMiddleware';
import {
  getClassrooms,
  getWorstClassrooms,
  resetClassroom,
} from '../services/classroomsService';

const classroomsRouter: Router = express.Router();

classroomsRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const classrooms = await getClassrooms();
      res.json(classrooms);
    } catch (err) {
      next(err);
    }
  },
);

classroomsRouter.get(
  '/worst',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const worstClassrooms = await getWorstClassrooms();
      res.json(worstClassrooms);
    } catch (err) {
      next(err);
    }
  },
);

classroomsRouter.post(
  '/:classroomId/reset',
  authenticate({ mustBeAdmin: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    const { classroomId } = req.params;

    try {
      await resetClassroom(classroomId);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
);

export default classroomsRouter;
