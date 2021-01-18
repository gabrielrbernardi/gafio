import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';

const winston = require("winston");

class MedicineLog {
  handleSuccessfulCreation(email : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Medicine/successfulCreations.log", level: "info"}
        )
      ]
    });
    logger.info({ user:email, type: "createMedicine", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt})});
  }

  handleUnsuccessfulCreation(email : string, erro : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Medicine/unsuccessfulCreations.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "createMedicine", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt})});
  }

  handleSuccessfulUpdate(email : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Medicine/successfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.info({user: email, type: "updateMedicine", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), medicine:id});
  }

  handleUnsuccessfulUpdate(email : string, erro : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Medicine/unsuccessfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.warn({user: email, type: "updateMedicine", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), medicine:id});
  }

   handleSuccessfulDelete(email : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Medicine/successfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.info({user: email, type: "deleteMedicine", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), medicine:id});
   }
    
  handleUnsuccessfulDelete(email: string, erro: string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Medicine/unsuccessfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.warn({user: email, type: "deleteMedicine", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), medicine:id});
  }
}

export default new MedicineLog();
