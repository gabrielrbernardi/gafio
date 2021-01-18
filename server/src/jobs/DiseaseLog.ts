import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

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
    logger.info({ user: email, type: "createDisease", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}) });
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
    logger.warn({ user: email, type: "createDisease", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}) });
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
    logger.info({ user: email, type: "updateDisease", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), disease: id });
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
    logger.warn({ user: email, type: "updateDisease", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), disease: id });
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
    logger.info({ user: email, type: "deleteDisease", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), disease: id });
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
    logger.warn({ user: email, type: "deleteDisease", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), disease: id });
  }
}

export default new DiseaseLog();
