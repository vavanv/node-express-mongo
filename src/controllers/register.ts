import express from 'express';

import { createUser, getUserByEmail } from '../db/users';
import { generateRandomString, authentication } from '../helpers';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;
    // console.dir(req.body);
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
    // console.dir(user);
    res.status(200);
    res.json(user);
    return res.end();
  } catch (err) {
    console.error(err);
    res.status(400);
    res.end();
  }
};
