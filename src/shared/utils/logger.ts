import { Prisma } from '@prisma/client';

import { LogType } from '../enums';

interface props {
  error?: Error;
  message?: string;
  request?: any;
  type: LogType;
}

export const logger = ({ error, message, request, type }: props) => {
  console.log(" ❌❌❌❌❌❌❌❌❌❌❌❌ ERROR ", error);
};

export const loggerRepository = (error: Error) => {
  void logger({ error, type: LogType.ERROR });
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025')
      return null;
  }
  return null;
};
