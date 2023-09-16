import express from 'express';

import { createUser, getUserByEmail } from '../db/users';
import { generateRandomString, authentication } from '../helpers';
import { AUTH_SESSION_COOKIE } from '../helpers/constants';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      return res.end();
    }

    const user = await getUserByEmail(email).select(
      '+authentication.salt +authentication.password',
    );

    if (!user) {
      res.status(400);
      return res.end();
    }

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      res.status(403);
      return res.end();
    }

    const salt = generateRandomString();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie(AUTH_SESSION_COOKIE, user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
    });

    res.status(200).json(user);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(400);
    res.end();
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      res.status(400);
      res.json({ error: 'Credentials are not provided' });
      return res.end();
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(400);
      res.json({ error: 'User already exists' });
      return res.end();
    }
    const salt = generateRandomString();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    res.status(200);
    res.json(user);
    return res.end();
  } catch (err) {
    console.error(err);
    res.status(400);
    res.end();
  }
};
