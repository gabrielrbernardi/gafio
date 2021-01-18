import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';

const winston = require("winston");

class AssessmentLog {
  handleSuccessfulCreation(email : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Assessment/successfulCreations.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "createAssessment", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt})});
  }

  handleUnsuccessfulCreation(email : string, erro : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Assessment/unsuccessfulCreations.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "createAssessment", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt})});
  }

  handleSuccessfulUpdate(email : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Assessment/successfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "updateAssessment", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), assessment:id});
  }

  handleUnsuccessfulUpdate(email : string, erro : string,  id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Assessment/unsuccessfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "updateAssessment", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), assessment:id});
  }

   handleSuccessfulDelete(email : string,  id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Assessment/successfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "deleteAssessment", date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt})});
   }
    
  handleUnsuccessfulDelete(email: string, erro: string,  id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Assessment/unsuccessfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "deleteAssessment", erro, date: format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt}), assessment:id});
  }
}

export default new AssessmentLog();
