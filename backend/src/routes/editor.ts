import * as express from 'express';
import { NextFunction, Request, Response, Router } from 'express';
import authenticate from '../middleware/authenticateMiddleware';

import multer from 'multer';
import {
  createNotice,
  deleteUnusedImages,
  setNoticeVisibility,
  updateNotice,
} from '../services/noticesService';
import { nanoid } from 'nanoid/non-secure';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const noticeId = parseInt(req.params.noticeId);
    const dir = `./public/notices/${noticeId}`;

    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir);
      } catch (err) {
        return cb(err, dir);
      }
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, nanoid());
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (
      ['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(
        file.mimetype,
      )
    ) {
      return cb(null, true);
    }
    cb(new Error('Wrong file type'));
  },
});

const editorRouter: Router = express.Router();

editorRouter.post(
  '/createNotice',
  authenticate({ mustBeAdmin: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = await createNotice();
      console.log(id);
      res.json(id);
    } catch (err) {
      next(err);
    }
  },
);

//TODO schema
editorRouter.post(
  '/:noticeId/setPublic',
  authenticate({ mustBeAdmin: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    const noticeId = parseInt(req.params.noticeId);
    try {
      const result = await setNoticeVisibility(noticeId, true);

      if (result == 'not_found') {
        return res.sendStatus(404);
      }

      if (result == 'null_document') {
        return res.sendStatus(400);
      }

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
);

//TODO schema
editorRouter.post(
  '/:noticeId/setPrivate',
  authenticate({ mustBeAdmin: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    const noticeId = parseInt(req.params.noticeId);
    try {
      const result = await setNoticeVisibility(noticeId, false);

      if (result == 'not_found') {
        return res.sendStatus(404);
      }

      if (result == 'null_document') {
        return res.sendStatus(400);
      }

      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
);

//TODO schema
editorRouter.post(
  '/:noticeId/updateNotice',
  authenticate({ mustBeAdmin: true }),
  async (req: Request, res: Response, next: NextFunction) => {
    const noticeId = parseInt(req.params.noticeId);

    const { document } = req.body;

    try {
      await updateNotice(noticeId, document);
      await deleteUnusedImages(noticeId, document);
      res.sendStatus(200);
    } catch (err) {
      next(err);
    }
  },
);

editorRouter.post(
  '/:noticeId/imageUpload',
  authenticate({ mustBeAdmin: true }),
  upload.array('files'),
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    res.json({ filenames: files.map((f) => f.filename) });
  },
);

export default editorRouter;
