import express from 'express';

import { login } from '../controllers/login';
import { register } from '../controllers/register';

export default (router: express.Router) => {
  router.post('/auth/register', register);
  router.post('/auth/login', login);
};
