import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';

const formattedDate = format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt});
const winston = require("winston");

class MedicalRecordLog {
  handleSuccessfulCreation(email : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/MedicalRecord/successfulCreations.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "createMedicalRecord", date: formattedDate});
  }

  handleUnsuccessfulCreation(email : string, erro : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/MedicalRecord/unsuccessfulCreations.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, tipo: "createMedicalRecord", erro, date: formattedDate});
  }

  handleSuccessfulUpdate(email : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/MedicalRecord/successfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.info({user: email, tipo: "updateMedicalRecord", date: formattedDate, MedicalRecord:id});
  }

  handleUnsuccessfulUpdate(email : string, erro : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/MedicalRecord/unsuccessfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.warn({user: email, tipo: "updateMedicalRecord", erro, date: formattedDate, MedicalRecord:id});
  }

   handleSuccessfulDelete(email : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/MedicalRecord/successfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.info({user: email, tipo: "updateMedicalRecord", date: formattedDate, MedicalRecord:id});
   }
    
  handleUnsuccessfulDelete(email: string, erro: string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/MedicalRecord/unsuccessfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.warn({user: email, tipo: "updateMedicalRecord", erro, date: formattedDate, MedicalRecord:id});
  }
}

export default new MedicalRecordLog();
