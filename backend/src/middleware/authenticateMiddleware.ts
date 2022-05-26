import { NextFunction, Request, Response } from 'express';
import { isEmailValidated } from '../services/userService';

//TODO cache returned function
const authenticate =
  ({ mustBeAdmin = false, allowGuests = false } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.session.user;

    if (!user) {
      if (allowGuests) {
        req.user = null;
        return next();
      }

      res.status(401);
      return res.json({ error: 'unauthenticated' });
    }

    if (!user.isVerified) {
      const isVerified = await isEmailValidated(user.id);

      if (!isVerified) {
        res.status(403);
        return res.json({ error: 'emailNotVerified' });
      }

      user.isVerified = true;
    }

    if (mustBeAdmin && !user.isAdmin) {
      res.status(403);
      return res.json({ error: 'forbidden' });
    }

    req.user = user;
    next();
  };

export default authenticate;
