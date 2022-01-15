import * as winston from 'winston';

export const jsonLogger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
    ],
});
