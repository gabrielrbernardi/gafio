import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';

const formattedDate = format(new Date(), "'dia 'dd 'de' MMMM' às' H:mm'h'", {locale: pt});
const winston = require("winston");

class LoginLog{
  handleSuccessfullLogin(email: string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          { filename: "./tmp/Logs/Login/successfulLogins.log", level: "info" }
        )
      ]
    });
    logger.info({ email,  type:"login", date: formattedDate});
  }

    handleUnsuccessfulLogin(email: string, erro:string) {
    const logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(), new winston.transports.File(
          { filename: "./tmp/Logs/Login/unsuccessfulLogins.log", level: "info" }
        )
      ]
    });
    logger.warn({ email,  type:"login",  erro, date: formattedDate});
  }
}

export default new LoginLog();

