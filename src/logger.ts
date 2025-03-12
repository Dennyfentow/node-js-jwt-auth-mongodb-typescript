//logger.js
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from "winston-daily-rotate-file";
import dotenv from 'dotenv';

dotenv.config({
  path: "./app.env"
});

const { combine, timestamp: timestampImport, label: labelImport, printf, errors, colorize } = format;

const nameAplication = process.env['NAME_APPLICATION'] || 'api';

const myFormat = combine(
    colorize(),
    timestampImport({ format: 'DD-MM-YYYY HH:mm:ss' }),
    labelImport({ label: nameAplication }),
    errors({ stack: true }),
    printf(({ level, timestamp, label, message, stack, ...meta }) => {
        const result = message ? message : "";
        const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
        if (stack) {
            return `${timestamp} [${label}] level: ${level} - ${result} - stack: ${stack}${metaString ? ` - meta: ${metaString}` : ''} \n`;
        } else {
            return `${timestamp} [${label}] level: ${level} - ${result}${metaString ? ` - meta: ${metaString}` : ''}`;
        }
    })
);

const transportRotateFile = new DailyRotateFile({
    filename: nameAplication + '-%DATE%.log',
    dirname: 'logs',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '500m',
    format: myFormat,
    level: 'debug'
});

const transportErrorFile = new DailyRotateFile({
    filename: nameAplication + '-error-%DATE%.log',
    dirname: 'logs',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '500m',
    format: myFormat,
    level: 'error'
});

const logger = createLogger({
    exitOnError: false,
    transports: [
        transportRotateFile,
        transportErrorFile
    ],
});

if (process.env['NODE_ENV'] !== 'production') {
    logger.add(new transports.Console({
        handleExceptions: true,
        debugStdout: true,
        level: 'info',
        format: myFormat,
    }));
} else {
    logger.add(new transports.Console({
        handleExceptions: true,
        debugStdout: true,
        level: 'info',
        format: myFormat
    }));
}

export default logger;
