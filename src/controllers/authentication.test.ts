import { Request, Response } from 'express';
import { register } from './authentication';

const { UserModel, getUserByEmail, createUser, deleteUser, updateUser } = require('../db/users');
const { generateRandomString, authentication } = require('../helpers');
const { AUTH_SESSION_COOKIE } = require('../helpers/constants');

jest.mock('../db/users');

const request = {
  body: {
    email: 'fake_email',
    password: 'fake_password',
    authentication: {
      password: 'fake_password',
      salt: 'fake_salt',
      sessionToken: 'fake_sessionToken',
    },
  },
};

const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  end: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};
describe('login', () => {
  it('should return 400 and error message "Credentials are not provided"', async () => {
    getUserByEmail.mockImplementationOnce(() => ({
      // email: 'email@email.com',
      // password: 'password',
      // username: 'username',
      email: 'fake_email',
      // password: 'fake_password',
      // username: 'fake_username',
    }));

    await register(request as Request, response as Response);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: 'Credentials are not provided' });
  });
});
