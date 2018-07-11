import path from 'path';
import winston from 'winston';

const myFormat = winston.format.printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logPath = path.join(__dirname, './../../', 'logs');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.label({ label: 'webpush' }),
        winston.format.timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logPath, 'combined.log')
        }),
        new winston.transports.Console()
    ]
});

export default logger;
