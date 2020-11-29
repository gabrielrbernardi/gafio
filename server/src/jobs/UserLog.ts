import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';

const formattedDate = format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt});
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
    logger.info({user:email, type: "createUser", date: formattedDate});
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
    logger.warn({user:email, tipo: "createUser", erro, date: formattedDate});
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
    logger.info({user:email, tipo: "deleteUser", date: formattedDate, userId:id});
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
    logger.warn({user:email, tipo: "deleteUser", erro, date: formattedDate, userId:id});
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
    logger.info({user:email, tipo: "deleteUser",  date: formattedDate, userId:id});
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
    logger.warn({user:email, tipo: "deleteUser", erro, date: formattedDate, userId:id});
  }
}

export default new UserLog();
