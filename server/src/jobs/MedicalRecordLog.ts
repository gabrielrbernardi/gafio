import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';

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
    logger.info({user:email, type: "createMedicalRecord", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt})});
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
    logger.warn({user:email, type: "createMedicalRecord", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt})});
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
    logger.info({user: email, type: "updateMedicalRecord", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), MedicalRecord:id});
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
    logger.warn({user: email, type: "updateMedicalRecord", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), MedicalRecord:id});
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
    logger.info({user: email, type: "deleteMedicalRecord", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), MedicalRecord:id});
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
    logger.warn({user: email, type: "deleteMedicalRecord", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), MedicalRecord:id});
  }
}

export default new MedicalRecordLog();
