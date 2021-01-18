import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';

const winston = require("winston");

class UserLog {
  handleSuccessfulCreation(email : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/User/successfulCreations.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "createUser", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt})});
  }

  handleUnsuccessfulCreation(email : string, erro : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/User/unsuccessfulCreations.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "createUser", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt})});
  }

  handleSuccessfulUpdate(email : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/User/successfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "updateUser", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), userId:id});
  }

  handleUnsuccessfulUpdate(email : string, erro : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/User/unsuccessfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "updateUser", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), userId:id});
  }

   handleSuccessfulDelete(email : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/User/successfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "deleteUser",  date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), userId:id});
   }
    
  handleUnsuccessfulDelete(email: string, erro: string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/User/unsuccessfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "deleteUser", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), userId:id});
  }
}

export default new UserLog();
