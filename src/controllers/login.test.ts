import { Request, Response } from 'express';
import { login } from './login';
import { generateRandomString, authentication } from '../helpers';
import { AUTH_SESSION_COOKIE } from '../helpers/constants';

const { getUserByEmailWithAuthentication } = require('../db/users');

jest.mock('../db/users');
jest.mock('../helpers');

const mockedGenerateRandomString = generateRandomString as jest.MockedFunction<
  typeof generateRandomString
>;
const mockedAuthentication = authentication as jest.MockedFunction<typeof authentication>;

const request = {
  body: {
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

describe('login', () => {
  afterEach(jest.clearAllMocks);

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
    expect(response.end).toBeCalled();
  });

  it('should return 401 and error message "User does not exist"', async () => {
    getUserByEmailWithAuthentication.mockResolvedValueOnce(undefined);

    await login(request as Request, response as Response);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ error: 'User does not exist' });
    expect(response.end).toBeCalled();
  });

  it('should return 403 and error message "User does not have access"', async () => {
    getUserByEmailWithAuthentication.mockResolvedValueOnce({
      email: 'fake_email',
      username: 'fake_username',
      authentication: {
        salt: 'fake_salt',
        password: 'fake_password',
        sessionToken: 'fake_sessionToken',
      },
    });

    mockedAuthentication.mockReturnValueOnce('fake_hash');
    mockedGenerateRandomString.mockReturnValueOnce('fake_session_token');

    await login(request as Request, response as Response);
    expect(response.status).toBeCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({ error: 'User does not have access' });
    expect(response.end).toBeCalled();
  });

  // it('should return 200 and set session cookie if user has access', async () => {
  //   const user = {
  //     email: 'fake_email',
  //     username: 'fake_username',
  //     authentication: {
  //       salt: 'fake_salt',
  //       password: 'fake_password',
  //       sessionToken: 'fake_sessionToken',
  //     },
  //   };
  //   getUserByEmailWithAuthentication.mockResolvedValueOnce({
  //     user,
  //     save: jest.fn(),
  //   });

  //   await login(request as Request, response as Response);

  //   expect(user.authentication.password).toBe('fake_password');
  //   expect(response.status).toBeCalledWith(200);
  //   expect(response.cookie).toBeCalledWith(AUTH_SESSION_COOKIE, 'fake_session_token', {
  //     domain: 'localhost',
  //     path: '/',
  //   });
  //   expect(response.end).toBeCalled();
  // });

  it('should return 500 if an error occurs', async () => {
    getUserByEmailWithAuthentication.mockRejectedValueOnce(new Error('fake_error'));

    await login(request as Request, response as Response);

    expect(response.status).toBeCalledWith(500);
    expect(response.json).toBeCalledWith('fake_error');
    expect(response.end).toBeCalled();
  });
});
