import { createLogger, format, transports } from "winston";
const { combine, timestamp, json, colorize,prettyPrint } = format;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  prettyPrint(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message}`;
  })
);

const logger = createLogger({
  level: "info",
  format: combine(colorize(),prettyPrint(), timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({ filename: "app.log" }),
  ],
});

export default logger;