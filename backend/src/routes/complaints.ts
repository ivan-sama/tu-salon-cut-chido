import * as express from 'express';
import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../middleware/authenticateMiddleware';
import { validateBody } from '../middleware/validateMiddleware';
import { classroomProblemsIdSchema } from '../schema/classroomProblemsId';
import {
  classroomExists,
  getComplaintsWithCheckedByUser,
  setComplaints,
} from '../services/complaintsService';
const complaintsRouter: Router = express.Router();

complaintsRouter.post(
  '/:classroomId',
  validateBody(classroomProblemsIdSchema),
  authenticate(),
  async (req: Request, res: Response, next: NextFunction) => {
    const { classroomId } = req.params;

    try {
      await setComplaints(
        req.user.id,
        classroomId,
        req.body.classroomProblemsId,
      );

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
);

complaintsRouter.get(
  '/:classroomId',
  async (req: Request, res: Response, next: NextFunction) => {
    const { classroomId } = req.params;

    try {
      const existsPromise = classroomExists(classroomId);

      const complaintsPromise = getComplaintsWithCheckedByUser(
        classroomId,
        req.user?.id ?? null,
      );

      const [exists, complaints] = await Promise.all([
        existsPromise,
        complaintsPromise,
      ]);

      console.log(exists);

      if (!exists) {
        res.sendStatus(404);
      }

      console.log(complaints);
      res.json(complaints);
    } catch (err) {
      next(err);
    }
  },
);

export default complaintsRouter;
