import { Request, Response } from 'express';
import { register, login } from './authentication';

import { generateRandomString, authentication } from '../helpers';
const { UserModel, getUserByEmail, createUser, deleteUser, updateUser } = require('../db/users');
const { AUTH_SESSION_COOKIE } = require('../helpers/constants');

jest.mock('../db/users');

jest.mock('../helpers', () => ({
  generateRandomString: jest.fn(() => 'fake_salt'),
  authentication: jest.fn(() => 'authenticated_password'),
}));

const request = {
  body: {
    username: 'fake_username',
    email: 'fake_email',
    password: 'fake_password',
  },
};

const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  end: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

describe('register', () => {
  it('should return 400 and error message "Credentials are not provided"', async () => {
    const request = {
      body: {
        username: '',
        email: '',
        password: '',
      },
    };

    await register(request as Request, response as Response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: 'Credentials are not provided' });
  });

  it('should return 400 and error message "User already exists"', async () => {
    getUserByEmail.mockImplementationOnce(() => ({
      email: 'fake_email',
    }));

    await register(request as Request, response as Response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: 'User already exists' });
  });

  it('should return 200 when user created ', async () => {
    getUserByEmail.mockResolvedValueOnce(undefined);
    createUser.mockImplementationOnce(() => ({
      username: 'username',
      email: 'email',
      password: 'password',
    }));

    await register(request as Request, response as Response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      email: 'email',
      username: 'username',
      password: 'password',
    });
  });
});

describe('login', () => {
  it('should return 400 and error message "Credentials are not provided"', async () => {
    const request = {
      body: {
        email: '',
        password: '',
      },
    };

    await login(request as Request, response as Response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: 'Credentials are not provided' });
  });

  it('should return 400 and error message "User does not exist"', async () => {
    getUserByEmail.mockImplementationOnce(() => ({
      email: 'no_email',
      select: jest.fn(),
    }));

    await login(request as Request, response as Response);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ error: 'User does not exist' });
  });
});
