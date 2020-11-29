import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';

const formattedDate = format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt});
const winston = require("winston");

class NoticationLog {
  handleSuccessfulCreation(email : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Notication/successfulCreations.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "createNotication", date: formattedDate});
  }

  handleUnsuccessfulCreation(email : string, erro : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Notication/unsuccessfulCreations.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "createNotication", erro, date: formattedDate});
  }

  handleSuccessfulUpdate(email : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Notication/successfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "updateNotication", date: formattedDate});
  }

  handleUnsuccessfulUpdate(email : string, erro : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Notication/unsuccessfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "updateNotication", erro, date: formattedDate});
  }

   handleSuccessfulDelete(email : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Notication/successfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "deleteNotication", date: formattedDate});
   }
    
  handleUnsuccessfulDelete(email: string, erro: string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Notication/unsuccessfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "deleteNotication", erro, date: formattedDate});
  }
}

export default new NoticationLog();
