import express from 'express';

import { getUsers } from '../db/users';

export const getAllUsers = async (_: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(400);
  }
};
