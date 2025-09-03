import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf } = format;

const combinedFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const errorFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    combinedFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'c2b-api-socket.log' }),
    new transports.File({ filename: 'c2b-api-socket-error.log', level: 'error', format: errorFormat }),
  ],
});

export default logger;
