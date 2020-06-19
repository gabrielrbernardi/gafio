/****************************************
| Data: 08/06/2020                      |
| Resumo: Controlador Usuário (CRUD)    |
| Sistema: GAFio                        |
****************************************/

import { Request, Response, request } from "express";
import knex from "../database/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
            return response.json({
              createdUser: true,
              id: users[0],
              Nome: user["Nome"],
              Email: user["Email"],
              Matricula: user["Matricula"],
              TipoUsuario: user["TipoUsuario"],
            });
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
    const userDB = await knex("Usuario").where("CodUsuario", id).update({
      Nome: nome,
      Email: email,
      Matricula: matricula,
    });
    if (userDB) {
      return response.json({ updatedUser: true });
    } else {
      return response.json({
        updatedUser: false,
        error: "Usuário não encontrado",
      });
    }
  }

  //Exclusao de usuario, baseando-se na passagem de email como parametro
  async delete(request: Request, response: Response) {
    const { email, senha } = request.body;
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
}

export default UserController;
