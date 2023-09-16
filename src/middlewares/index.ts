import express from 'express';
import { merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';
import { AUTH_SESSION_COOKIE } from '../helpers/constants';

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sessionToken = req.cookies[AUTH_SESSION_COOKIE];
    if (!sessionToken) {
      res.status(401);
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      res.status(403);
    }
    merge(req, { identity: existingUser });
    return next();
  } catch (err) {
    console.error(err);
    res.status(400);
  }
};
