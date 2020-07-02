/****************************************
| Data: 08/06/2020                      |
| Resumo: Controlador Usuário (CRUD)    |
| Sistema: GAFio                        |
****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Notification from "./Notification";

const saltRounds = 10;

class UserController {
  //Criacao de usuario, verificando senha, se existe usuario com email ja cadastrado
  async create(request: Request, response: Response) {
    //Criacao de usuario
    const { nome, email, senha, confirmarSenha, matricula } = request.body;

    // const {token} = request.body;
    // var decoded = jwt.decode(token);
    // const nome = decoded.nome;
    // const email = decoded.email;
    // const senha = decoded.senha;
    // const confirmarSenha = decoded.confirmarSenha;
    // const matricula = decoded.matricula;

    if (!nome || !email || !senha || !confirmarSenha || !matricula) {
      return response.json({
        createdUser: false,
        error: "Preencha todos os campos.",
      });
    }
    if (senha != confirmarSenha) {
      return response.json({ createdUser: false, error: "Senhas diferentes." });
    }
    if (!email.includes("@")) {
      return response.json({
        createdUser: false,
        error: "Verifique o email e tente novamente.",
      });
    }

    const userDB = await knex("Usuario").where("Email", email);
    const user = userDB[0];
    if (!user) {
      await bcrypt.hash(senha, saltRounds, function (err, hash) {
        const user = {
          Nome: nome,
          Email: email,
          Senha: hash,
          Matricula: matricula,
          TipoUsuario: "F",
          isVerified: 0,
        };
        // return response.json({createdUser: true, user: user});
        knex("Usuario")
          .insert(user)
          .then(function (users) {
            const notificationDescription = `${user["Nome"]} criou uma conta.`;
            const notificationType = "Create";
            const userId = users[0]
            const notification = {
              Descricao: notificationDescription, 
              Status: 0, 
              TipoNotificacao: notificationType,
              CodUsuario: userId
            }
            knex("Notificacao").insert(notification).then(function (notifications) {
              if(notifications){
                knex("Usuario_Notificacao").insert({"CodNotificacao": notifications[0], "CodUsuario": userId}).then(userResponse => {
                  if(userResponse){
                    return response.json({
                      createdUser: true,
                      id: userId,
                      Nome: user["Nome"],
                      Email: user["Email"],
                      Matricula: user["Matricula"],
                      TipoUsuario: user["TipoUsuario"],
                    });
                  }else{
                    return response.json({createdNotification: false, error: "Não pode inserir em usuario."});
                  }
                })
              }else{
                return response.json({createdNotification: false, error: "Não pode inserir em notificacao."});
              }
            })
            // Notification.prototype.create(request, response, notificationDescription, notificationType);
          })
          .catch(function (err) {
            return response.json({ createdUser: false, status: 502 });
          });
      });
    } else {
      return response.json({
        createdUser: false,
        error: "Email já existente.",
      });
    }
  }

  //Listagem de todos usuarios
  async index(request: Request, response: Response) {
    const users = await knex("Usuario").select("*");
    return response.send(users);
  }

  //Listagem de usuario especifico com busca por id
  async showId(request: Request, response: Response) {
    const { id } = request.params;
    const userDB = await knex("Usuario").where("CodUsuario", id);
    const user = userDB[0];
    if (user) {
      return response.json({
        userFound: true,
        id: user["CodUsuario"],
        Nome: user["Nome"],
        Email: user["Email"],
        Matricula: user["Matricula"],
        TipoUsuario: user["TipoUsuario"],
      });
    } else {
      return response.json({
        userFound: false,
        error: "Usuário não encontrado. Verifique o id e tente novamente.",
      });
    }
  }

  //Listagem de usuario especifico com busca por email
  async showEmail(request: Request, response: Response) {
    //Listagem de usuario especifico
    const { email } = request.params;
    const userDB = await knex("Usuario").where("Email", email);
    const user = userDB[0];
    if (user) {
      return response.json({
        userFound: true,
        id: user["CodUsuario"],
        Nome: user["Nome"],
        Email: user["Email"],
        Matricula: user["Matricula"],
        TipoUsuario: user["TipoUsuario"],
      });
    } else {
      return response.json({
        userFound: false,
        error: "Usuário não encontrado. Verifique o id e tente novamente.",
      });
    }
  }

  //Atualizacao de dados de determinado usuario, baseando na passagem de id como parametro
  async update(request: Request, response: Response) {
    const { nome, email, matricula } = request.body;
    const { id } = request.params;
    const idInt = parseInt(id)
    const userDB = await knex('Usuario').where('CodUsuario', idInt).update({
      Nome: nome,
      Email: email,
      Matricula: matricula,
    });
    if (userDB) {
      return response.json({ updatedUser: true, userDB });
    } else {
      return response.json({
        updatedUser: false,
        error: "Não foi possível alterar as informações.",
      });
    }
  }

  //Exclusao de usuario, baseando-se na passagem de email como parametro
  async delete(request: Request, response: Response) {
    const { Email } = request.body;
    const email = String(Email);
    console.log(Email)
    const userDB = await knex("Usuario").where("Email", email);

    const user = userDB[0];
    if (user) {
      await knex("Usuario").where("Email", email).del();
      return response.json({ deletedUser: true });
    } else {
      return response.json({
        deletedUser: false,
        error: "Usuário não encontrado.",
      });
    }
  }
  
  async requestChangeUserType(request: Request, response: Response){
    const {notificationId} = request.params;
    const {TipoNotificacao} = request.body;
    const notificationDB = await knex('Usuario_Notificacao').where("CodNotificacao", notificationId);
    if(notificationDB){
      let id = notificationDB[0].CodUsuario;
      const userDBSelect = await knex('Usuario').where('CodUsuario', id);
      const user = userDBSelect[0];
      if(user['requestUserType'] == 'FM'){
          return response.json({requestChangeUserType: false, error: 'Solicitação enviada anteriormente. Contacte o responsável pelo sistema para mais informações.'})
      }else{
        const userDBUpdate = await knex('Usuario').where('CodUsuario', id).update({
            requestUserType: 'FM'
        })
        var notificationDescription = "";
        var notificationType = "";
        if(TipoNotificacao == "Create"){
          notificationDescription = `${user["Nome"]} deseja criar uma conta.`;
          notificationType = "Create";
        }else if(TipoNotificacao == "Change"){
          notificationDescription = `${user["Nome"]} deseja alterar o tipo de conta.`;
          notificationType = "Change";
        }
        const userId = id;
        const notification = {
          Descricao: notificationDescription, 
          Status: 0, 
          TipoNotificacao: notificationType,
          CodUsuario: userId
        }
        await knex("Notificacao").insert(notification).then(function (notifications) {
          if(notifications){
            knex("Usuario_Notificacao").insert({"CodNotificacao": notifications[0], "CodUsuario": userId}).then(userResponse => {
              if(userResponse){
                return response.json({requestChangeUserType: true});
              }else{
                return response.json({requestChangeUserType: false, error: "Não pode inserir em usuario."});
              }
            })
          }else{
            return response.json({requestChangeUserType: false, error: "Não pode inserir em notificacao."});
          }
        })
      }
    }else{
      return response.json({requestChangeUserType: false, error: "Notificação não encontrada"});
    }
  }
}

export default UserController;
