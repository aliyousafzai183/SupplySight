import pino from 'pino';

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

// Helper function for structured logging
export const logInfo = (message: string, data?: Record<string, any>) => {
  if (data) {
    logger.info({ ...data }, message);
  } else {
    logger.info(message);
  }
};
