/****************************************
| Data: 19/06/2020                      |
| Resumo: Controlador Usuário (CRUD)    |
| Sistema: GAFio                        |
****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";

interface notificationObject{
    descricao?: string
}

class Notification{
    async create(request: Request, response: Response){
        const {descricao, userId} = request.body;
        const notification = {
            Descricao: descricao, 
            Status: 0, 
            TipoNotificacao: "teste"
        }
        await knex("Notificacao").insert(notification).then(function (notifications) {
            if(notifications){
                knex("Usuario_Notificacao").insert({"CodNotificacao": notifications[0], "CodUsuario": userId}).then(user => {
                    if(user){
                        return response.json({createdNotification: true, id: notifications[0]});
                    }else{
                        return response.json({createdNotification: false, error: "Não pode inserir em usuario."});
                    }
                })
            }else{
                return response.json({createdNotification: false, error: "Não pode inserir em notificacao."});
            }
        })
    }

    async index(request: Request, response: Response){
        const notificationDB = await knex('Notificacao').select('*');
        console.log(notificationDB.length)
        return response.json({notificationFound: true, content: notificationDB});
    }

    async showId(request: Request, response: Response){
        const {id} = request.params;
        const notificationDB = await knex('Usuario_Notificacao').where('CodUsuario', id);
        if(notificationDB.length != 0){
            var notificationObject = {}, notificationList = [];
            for(let i = 0; i < notificationDB.length; i++){
                notificationObject = notificationDB[i];
                notificationList.push(notificationObject);
            }
            return response.json({
                notificationFound: true,
                notificationList
            });
        }else{
            return response.json({notificationFound: false, error: "Não há notificações para este usuário."});
        }
    }

    async updateStatus(request: Request, response: Response){
        const {id} = request.params;
        const notificationDB = await knex("Notificacao").where("CodNotificacao", id).update({
            Status: 1
        });
          if (notificationDB) {
            return response.json({ updatedNotification: true });
          } else {
            return response.json({updatedNotification: false, error: "Notificação não encontrada"});
          }
    }

    async delete(request: Request, response: Response){
        const {id} = request.params;
        const usuarioNotificacao = await knex("Usuario_Notificacao").where("CodNotificacao", id).del();
        const notificacao = await knex("Notificacao").where("CodNotificacao", id).del();
        if(notificacao && usuarioNotificacao){
            return response.json({deletedNotification: true});
        }else{
            return response.json({deletedNotification: false, error: "ERROR"});
        }
    }
}

export default Notification;