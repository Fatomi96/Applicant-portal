import * as winston from 'winston';
const { combine, label, timestamp, printf } = winston.format;

class Logger {
  private readonly LOG_FILE = {
    ERROR: 'logs/error.log',
    WARN: 'logs/warn.log',
    INFO: 'logs/info.log',
    DEBUG: 'logs/debug.log',
    ALL: 'logs/all.log',
  };

  private logger: winston.Logger;

  constructor() {
    const logFormat = printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}:  ${message}`;
    });

    this.logger = winston.createLogger({
      level: 'info',
      format: combine(
        label({ label: '--> Applicant portal logs' }),
        timestamp(),
        logFormat,
      ),
      transports: [
        new winston.transports.Console({
          level: 'debug',
          handleExceptions: true,
          format: winston.format.json(),
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.ERROR,
          level: 'error',
          handleExceptions: true,
          format: winston.format.json(),
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.WARN,
          level: 'warn',
          handleExceptions: true,
          format: winston.format.json(),
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.ALL,
          handleExceptions: true,
          format: winston.format.json(),
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.DEBUG,
          level: 'debug',
          handleExceptions: true,
          format: winston.format.json(),
        }),
        new winston.transports.File({
          filename: this.LOG_FILE.INFO,
          level: 'info',
          handleExceptions: true,
          format: winston.format.json(),
        }),
      ],
      exitOnError: false,
    });
  }

  error(data) {
    this.logger.error(typeof data === 'object' ? JSON.stringify(data) : data);
    return { console: (arg?: any) => console.error(arg || data) };
  }
  log(data) {
    this.logger.log(
      'info',
      typeof data === 'object' ? JSON.stringify(data) : data,
    );
    return { console: (arg?: any) => console.log(arg || data) };
  }
  warn(data) {
    this.logger.warn(typeof data === 'object' ? JSON.stringify(data) : data);
    return { console: (arg?: any) => console.error(arg || data) };
  }
  info(data) {
    this.logger.info(typeof data === 'object' ? JSON.stringify(data) : data);
    return { console: (arg?: any) => console.info(arg || data) };
  }
  debug(data) {
    this.logger.debug(typeof data === 'object' ? JSON.stringify(data) : data);
    return { console: (arg?: any) => console.debug(arg || data) };
  }
}

export default new Logger();
