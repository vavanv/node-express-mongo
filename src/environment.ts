import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

interface Environment {
  mongoDb: string;
}

export const environment: Environment = {
  mongoDb: process.env.MONGO_CONNECTION_STRING as string,
};
