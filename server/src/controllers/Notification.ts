import { Request, Response } from "express";
import knex from "../database/connection";

class Notification{
    async create(request: Request, response: Response){
        const {descricao, userId} = request.body;
        const notification = {Descricao: descricao, Status: 0}
        await knex("Notificacao").insert(notification).then(function (notifications) {
            const userDBUpdate = knex('Usuario').where('CodUsuario', userId).update({
                CodNotificacao: 1
            })
            if(userDBUpdate){
                return response.json({createdNotification: true, id: notifications[0], user: String(userDBUpdate)});
            }else{
                return response.json({createdNotification: false, error: 'Não foi possível fazer a solicitação.'});
            }
            // console.log(user)
          })
        //   .catch(function (err) {
        //     return response.json({ createdNotification: false, status: 502 });
        //   });
        // return response.json({createdNotification: true, descricao: descricao});
    }

    async index(request: Request, response: Response){
        const notificationDB = await knex('Notificacao').select('*');
        console.log(notificationDB.length)
        return response.json({notificationFound: true, content: notificationDB});
    }

    async showId(request: Request, response: Response){
        const {id} = request.params;
        const notificationDB = await knex('Notificacao').where('CodNotificacao', id);
        const notification = notificationDB[0];
        if(notification){
            return response.json({
                notificationFound: true, 
                CodNotificacao: notification["CodNotificacao"], 
                Descricao: notification["Descricao"], 
                Status: notification["Status"]
            });
        }else{
            return response.json({notificationFound: false, error: "Notificação não encontrada."});
        }
    }
}

export default Notification;