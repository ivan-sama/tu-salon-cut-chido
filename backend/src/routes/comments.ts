import * as express from 'express';
import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../middleware/authenticateMiddleware';
import {
  deleteComment,
  getClassroomComments,
  getComment,
  setComment,
} from '../services/commentsService';
import { classroomExists } from '../services/complaintsService';
const commentsRouter: Router = express.Router();

commentsRouter.get(
  '/all/:classroomId',
  authenticate({ mustBeAdmin: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    const { classroomId } = req.params;

    try {
      const comments = await getClassroomComments(classroomId);
      comments.forEach(
        (comment: any) =>
          (comment.updated_at = comment.updated_at.toLocaleDateString('es-MX')),
      );
      res.json(comments);
    } catch (err) {
      next(err);
    }
  },
);

//TODO schema
commentsRouter.post(
  '/:classroomId',
  authenticate(),
  async (req: Request, res: Response, next: NextFunction) => {
    const { classroomId } = req.params;
    const comment = req.body.comment as string;

    try {
      if (comment.length == 0) {
        await deleteComment(req.user.id, classroomId);
      } else {
        await setComment(req.user.id, classroomId, comment);
      }

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
);

commentsRouter.get(
  '/:classroomId',
  authenticate(),
  async (req: Request, res: Response, next: NextFunction) => {
    const { classroomId } = req.params;

    try {
      const existsPromise = classroomExists(classroomId);
      const commentPromise = await getComment(req.user.id, classroomId);

      const [exists, comment] = await Promise.all([
        existsPromise,
        commentPromise,
      ]);

      if (!exists) {
        res.sendStatus(404);
      }

      res.json(comment ?? '');
    } catch (err) {
      next(err);
    }
  },
);

export default commentsRouter;
