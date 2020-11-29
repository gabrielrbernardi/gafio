import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';

const formattedDate = format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt});
const winston = require("winston");

class PatientLog {
  handleSuccessfulCreation(email : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Patient/successfulCreations.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "createPatient", date: formattedDate});
  }

  handleUnsuccessfulCreation(email : string, erro : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Patient/unsuccessfulCreations.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "createPatient", erro, date: formattedDate});
  }

  handleSuccessfulUpdate(email : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Patient/successfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "deletePatient", date: formattedDate, patient:id});
  }

  handleUnsuccessfulUpdate(email : string, erro : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Patient/unsuccessfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "deletePatient", erro, date: formattedDate, patient:id});
  }

   handleSuccessfulDelete(email : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Patient/successfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "deletePatient", date: formattedDate, patient:id});
   }
    
  handleUnsuccessfulDelete(email: string, erro: string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Patient/unsuccessfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "deletePatient", erro, date: formattedDate, patient:id});
  }
}

export default new PatientLog();
