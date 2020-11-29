import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';

const formattedDate = format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt});
const winston = require("winston");

class MicrobiologyLog {
  handleSuccessfulCreation(email : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Microbiology/successfulCreations.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "createMicrobiology", date: formattedDate});
  }

  handleUnsuccessfulCreation(email : string, erro : string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Microbiology/unsuccessfulCreations.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "createMicrobiology", erro, date: formattedDate});
  }

  handleSuccessfulUpdate(email : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Microbiology/successfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.info({user: email, type: "updateMicrobiology", date: formattedDate, microbiology:id});
  }

  handleUnsuccessfulUpdate(email : string, erro : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Microbiology/unsuccessfulUpdates.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "updateMicrobiology", erro, date: formattedDate, microbiology:id});
  }

   handleSuccessfulDelete(email : string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Microbiology/successfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.info({user:email, type: "updateMicrobiology", date: formattedDate, microbiology:id});
   }
    
  handleUnsuccessfulDelete(email: string, erro: string, id:number) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          {filename: "./tmp/Logs/Microbiology/unsuccessfulExclusions.log", level: "info"}
        )
      ]
    });
    logger.warn({user:email, type: "updateMicrobiology", erro, date: formattedDate, microbiology:id});
  }
}

export default new MicrobiologyLog();
