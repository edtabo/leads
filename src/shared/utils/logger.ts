import { Axiom } from "@axiomhq/js";
import { AxiomJSTransport, ConsoleTransport, Logger } from "@axiomhq/logging";
import { Prisma } from '@prisma/client';

import { LogType } from '../enums';

interface props {
  error?: Error;
  message?: string;
  request?: any;
  type: LogType;
}

export const logger = ({ error, message, request, type }: props) => {

  // console.log(" ❌❌❌❌❌❌❌❌❌❌❌❌ ERROR ", error);
  const axiom = new Axiom({
    token: process.env.AXIOM_TOKEN!,
  });

  const logger = new Logger(
    {
      transports: [
        new AxiomJSTransport({
          axiom,
          dataset: 'one-million-leads',
        }),
        new ConsoleTransport(),
      ],
    }
  );

  let msg = error?.message ?? message;
  if (!msg) msg = 'Undefined message';

  const requestMetadata = request ? {
    url: request.url,
    method: request.method,
    headers: request.headers,
    ip: (request).ip,
    body: (request).body,
    query: (request).query,
    params: (request).params,
  } : undefined;

  switch (type) {
    case LogType.INFO:
      logger.info(msg, { request: requestMetadata });
      break;
    case LogType.ERROR:
      logger.error(msg, { request: requestMetadata });
      break;
    case LogType.WARN:
      logger.warn(msg, { request: requestMetadata });
      break;
    case LogType.DEBUG:
      logger.debug(msg, { request: requestMetadata });
      break;
  }

  void axiom.flush();
};

export const loggerRepository = (error: Error) => {
  void logger({ error, type: LogType.ERROR });
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025')
      return null;
  }
  return null;
};
