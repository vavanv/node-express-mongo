import express from 'express';
import { getUserByEmailWithAuthentication } from '../db/users';
import { generateRandomString, authentication } from '../helpers';
import { AUTH_SESSION_COOKIE } from '../helpers/constants';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      res.json({ error: 'Credentials are not provided' });
      return res.end();
    }

    const user = await getUserByEmailWithAuthentication(email);

    if (!user) {
      res.status(401);
      res.json({ error: 'User does not exist' });
      return res.end();
    }

    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      res.status(403);
      res.json({ error: 'User does not have access' });
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
    res.status(500);
    res.json(err.message);
    res.end();
  }
};
