import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

const formattedDate = format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", { locale: pt });
const winston = require("winston");

class DiseaseLog {
  handleSuccessfulCreation(email: string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          { filename: "./tmp/Logs/Disease/successfulCreations.log", level: "info" }
        )
      ]
    });
    logger.info({ user: email, type: "createDisease", date: formattedDate });
  }

  handleUnsuccessfulCreation(email: string, erro: string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          { filename: "./tmp/Logs/Disease/unsuccessfulCreations.log", level: "info" }
        )
      ]
    });
    logger.warn({ user: email, type: "createDisease", erro, date: formattedDate });
  }

  handleSuccessfulUpdate(email: string, id: number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          { filename: "./tmp/Logs/Disease/successfulUpdates.log", level: "info" }
        )
      ]
    });
    logger.info({ user: email, type: "updateDisease", date: formattedDate, disease: id });
  }

  handleUnsuccessfulUpdate(email: string, erro: string, id: number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          { filename: "./tmp/Logs/Disease/unsuccessfulUpdates.log", level: "info" }
        )
      ]
    });
    logger.warn({ user: email, type: "updateDisease", erro, date: formattedDate, disease: id });
  }

  handleSuccessfulDelete(email: string, id: number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          { filename: "./tmp/Logs/Disease/successfulExclusions.log", level: "info" }
        )
      ]
    });
    logger.info({ user: email, type: "deleteDisease", date: formattedDate, disease: id });
  }

  handleUnsuccessfulDelete(email: string, erro: string, id: number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          { filename: "./tmp/Logs/Disease/unsuccessfulExclusions.log", level: "info" }
        )
      ]
    });
    logger.warn({ user: email, type: "deleteDisease", erro, date: formattedDate, disease: id });
  }
}

export default new DiseaseLog();
