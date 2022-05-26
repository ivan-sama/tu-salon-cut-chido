import * as express from 'express';
import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../middleware/authenticateMiddleware';
import { validateQuery } from '../middleware/validateMiddleware';
import { paginationSchema } from '../schema/pagination';

import {
  deleteNotice,
  getNotice,
  getNotices,
} from '../services/noticesService';

const noticesRouter: Router = express.Router();

//TODO schema
noticesRouter.get(
  '/all',
  authenticate({ mustBeAdmin: true }),
  validateQuery(paginationSchema),
  async (
    req: Request & { query: { limit: number | null; page: number | null } },
    res: Response,
    next: NextFunction,
  ) => {
    const { limit, page } = req.query;

    try {
      if (limit && page) {
        const notices = await getNotices({
          pagination: { limit, offset: page - 1 },
        });
        return res.json(notices);
      }
      const notices = await getNotices();
      return res.json(notices);
    } catch (err) {
      next(err);
    }
  },
);

noticesRouter.get(
  '/public/all',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notices = await getNotices({ is_public: true });
      res.json(notices);
    } catch (err) {
      next(err);
    }
  },
);

noticesRouter.get(
  '/:noticeId',
  authenticate({ mustBeAdmin: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    const noticeId = parseInt(req.params.noticeId);

    try {
      res.json(await getNotice(noticeId));
    } catch (err) {
      next(err);
    }
  },
);

noticesRouter.delete(
  '/:noticeId',
  authenticate({ mustBeAdmin: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    const noticeId = parseInt(req.params.noticeId);

    try {
      await deleteNotice(noticeId);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
);

export default noticesRouter;
