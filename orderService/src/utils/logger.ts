import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, errors } = format;

const combinedFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const errorFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${message} ${stack || ''}`;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        errors({ stack: true }),
    ),
    transports: [
        new transports.Console({
            format: combine(
                format.colorize(),
                timestamp(),
                combinedFormat
            )
        }),
        new transports.File({
            filename: 'c2b-order-services.log',
            format: combinedFormat
        }),
        new transports.File({
            filename: 'c2b-order-services-error.log',
            level: 'error',
            format: errorFormat
        })
    ],
});

export default logger;
