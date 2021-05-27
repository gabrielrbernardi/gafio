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
                knex("Usuario").insert(user).then(users => {
                    const notificationDescription = `${user["Nome"]} criou uma conta.`;
                    const notificationType = "Create";
                    const userId = users[0]
                    const notification = {
                        Descricao: notificationDescription,
                        Status: 0,
                        TipoNotificacao: notificationType,
                        CodUsuario: userId
                    }
                    knex("Notificacao").insert(notification).then(notifications => {
                        if (notifications) {
                            knex("Usuario_Notificacao").insert({ "CodNotificacao": notifications[0], "CodUsuario": userId }).then(userResponse => {
                                if (userResponse) {
                                    return response.json({
                                        createdUser: true,
                                        id: userId,
                                        Nome: user["Nome"],
                                        Email: user["Email"],
                                        Matricula: user["Matricula"],
                                        TipoUsuario: user["TipoUsuario"],
                                    });
                                } else {
                                    return response.json({ createdNotification: false, error: "Não pode inserir em usuario." });
                                }
                            })
                        } else {
                            return response.json({ createdNotification: false, error: "Não pode inserir em notificacao." });
                        }
                    })
                    // Notification.prototype.create(request, response, notificationDescription, notificationType);
                })
                    .catch(function (err) {
                        return response.json({ createdUser: false, status: 502, err });
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

    //Listagem de usuários por pagina
    async indexPagination(request: Request, response: Response) {
        const { page } = request.params;
        var pageRequest = parseInt(page) / 10;
        if(pageRequest == 0){
            pageRequest = 1
        }
        const rows = 10;
        try {
            const users = await knex("Usuario").select("*").offset((pageRequest - 1) * rows).limit(rows);
            const usersLength = (await knex("Usuario").select("*")).length;
            if (users) {
                var serializedUsers = users.map(userDB => {
                    return {
                        CodUsuario: userDB.CodUsuario,
                        Nome: userDB.Nome,
                        Email: userDB.Email,
                        Matricula: userDB.Matricula,
                        TipoUsuario: userDB.TipoUsuario,
                        isVerified: userDB.isVerified,
                    }
                })
                return response.json({
                    showUsers: true,
                    users: serializedUsers,
                    length: usersLength,
                    length1: users.length
                });
            } else {
                return response.json({
                    userFound: false,
                    error: "Usuário não encontrado. Verifique o id e tente novamente.",
                });
            }
            // return response.json({ showUsers: true, users: users, length: usersLength });
        } catch (err) {
            return response.json({ showUsers: false, error: err });
        }

    }

    //Listagem de usuario especifico com busca por id
    async showId(request: Request, response: Response) {
        //Listagem de usuario especifico
        const { id } = request.query;
        var page = String(request.query.page);
        if (!page) {
            page = "10";
        }

        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            if (id) {
                const userDB = await knex("Usuario").where('CodUsuario', 'like', `%${id}%`).offset((pageRequest - 1) * rows).limit(rows);
                const user = userDB[0];
                if (user) {
                    const usersLength = (await knex("Usuario").count('CodUsuario').where('CodUsuario', 'like', `%${id}%`));
                    var serializedUsers = userDB.map(userDB => {
                        return {
                            CodUsuario: userDB.CodUsuario,
                            Nome: userDB.Nome,
                            Email: userDB.Email,
                            Matricula: userDB.Matricula,
                            TipoUsuario: userDB.TipoUsuario,
                            isVerified: userDB.isVerified,
                        }
                    })
                    return response.json({
                        userFound: true,
                        users: serializedUsers,
                        length: usersLength,
                        length1: userDB.length
                    });
                } else {
                    return response.json({
                        userFound: false,
                        error: "Usuário não encontrado. Verifique o id e tente novamente.",
                    });
                }
            } else {
                return response.json({ userFound: false, error: "Digite um id para procurar." })
            }
        } catch (err) {
            return response.json({ showUsers: false, error: err });
        }
    }

    //Listagem de usuario especifico com busca por email
    async showEmail(request: Request, response: Response) {
        //Listagem de usuario especifico
        const { email } = request.query;
        var page = String(request.query.page);
        if (!page) {
            page = "10";
        }
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            if (email) {
                const userDB = await knex("Usuario").where('Email', 'like', `%${email}%`).offset((pageRequest - 1) * rows).limit(rows);
                const user = userDB[0];
                if (user) {
                    const usersLength = (await knex("Usuario").count('Email').where('Email', 'like', `%${email}%`));
                    var serializedUsers = userDB.map(userDB => {
                        return {
                            CodUsuario: userDB.CodUsuario,
                            Nome: userDB.Nome,
                            Email: userDB.Email,
                            Matricula: userDB.Matricula,
                            TipoUsuario: userDB.TipoUsuario,
                            isVerified: userDB.isVerified,
                        }
                    })
                    return response.json({
                        userFound: true,
                        users: serializedUsers,
                        length: usersLength,
                        length1: userDB.length
                    });
                } else {
                    return response.json({
                        userFound: false,
                        error: "Usuário não encontrado. Verifique o email e tente novamente.",
                    });
                }
            } else {
                return response.json({ userFound: false, error: "Digite um email para procurar." })
            }
        } catch (err) {
            return response.json({ showUsers: false, error: err });
        }
    }

    //Listagem de usuario especifico com busca por nome
    async showName(request: Request, response: Response) {
        //Listagem de usuario especifico
        const { nome } = request.query;
        var page = String(request.query.page);
        if (!page) {
            page = "10";
        }
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            if (nome) {
                const userDB = await knex("Usuario").where('Nome', 'like', `%${nome}%`).offset((pageRequest - 1) * rows).limit(rows);
                const user = userDB[0];
                if (user) {
                    const usersLength = (await knex("Usuario").count('Nome').where('Nome', 'like', `%${nome}%`));
                    var serializedUsers = userDB.map(userDB => {
                        return {
                            CodUsuario: userDB.CodUsuario,
                            Nome: userDB.Nome,
                            Email: userDB.Email,
                            Matricula: userDB.Matricula,
                            TipoUsuario: userDB.TipoUsuario,
                            isVerified: userDB.isVerified,
                        }
                    })
                    return response.json({
                        userFound: true,
                        users: serializedUsers,
                        length: usersLength,
                        length1: userDB.length
                    });
                } else {
                    return response.json({
                        userFound: false,
                        error: "Usuário não encontrado. Verifique o nome e tente novamente.",
                    });
                }
            } else {
                return response.json({ userFound: false, error: "Digite um nome para procurar." })
            }
        } catch (err) {
            return response.json({ showUsers: false, error: err });
        }
    }
    //Listagem de usuario especifico com busca por matricula
    async showRegistrations(request: Request, response: Response) {
        //Listagem de usuario especifico
        const { matricula } = request.query;
        var page = String(request.query.page);
        if (!page) {
            page = "10";
        }
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            if (matricula) {
                const userDB = await knex("Usuario").where('Matricula', 'like', `%${matricula}%`).offset((pageRequest - 1) * rows).limit(rows);
                const user = userDB[0];
                if (user) {
                    const usersLength = (await knex("Usuario").count('Matricula').where('Matricula', 'like', `%${matricula}%`));
                    var serializedUsers = userDB.map(userDB => {
                        return {
                            CodUsuario: userDB.CodUsuario,
                            Nome: userDB.Nome,
                            Email: userDB.Email,
                            Matricula: userDB.Matricula,
                            TipoUsuario: userDB.TipoUsuario,
                            isVerified: userDB.isVerified,
                        }
                    })
                    return response.json({
                        userFound: true,
                        users: serializedUsers,
                        length: usersLength,
                        length1: userDB.length
                    });
                } else {
                    return response.json({
                        userFound: false,
                        error: "Usuário não encontrado. Verifique a matrícula e tente novamente.",
                    });
                }
            } else {
                return response.json({ userFound: false, error: "Digite uma matrícula para procurar." })
            }
        } catch (err) {
            return response.json({ showUsers: false, error: err });
        }
    }
    //Listagem de usuario especifico com busca por tipo de usuario
    async showUserType(request: Request, response: Response) {
        //Listagem de usuario especifico
        const userType = String(request.query.userType);
        var page = String(request.query.page);
        const userTypeChar = userType[0];
        if (!page) {
            page = "10";
        }
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            if (userTypeChar) {
                const userDB = await knex("Usuario").where('TipoUsuario', 'like', `%${userTypeChar}%`).offset((pageRequest - 1) * rows).limit(rows);
                const user = userDB[0];
                if (user) {
                    const usersLength = (await knex("Usuario").count('TipoUsuario').where('TipoUsuario', 'like', `%${userTypeChar}%`));
                    var serializedUsers = userDB.map(userDB => {
                        return {
                            CodUsuario: userDB.CodUsuario,
                            Nome: userDB.Nome,
                            Email: userDB.Email,
                            Matricula: userDB.Matricula,
                            TipoUsuario: userDB.TipoUsuario,
                            isVerified: userDB.isVerified,
                        }
                    })
                    return response.json({
                        userFound: true,
                        users: serializedUsers,
                        length: usersLength,
                        length1: userDB.length
                    });
                } else {
                    return response.json({
                        userFound: false,
                        error: "Usuário não encontrado. Verifique o tipo de usuário e tente novamente.",
                    });
                }
            } else {
                return response.json({ userFound: false, error: "Digite um tipo de usuário para procurar." })
            }
        } catch (err) {
            return response.json({ showUsers: false, error: err });
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
        const userDB = await knex("Usuario").where("Email", email);

        const user = userDB[0];
        if (user) {
            await knex('Usuario_Notificacao').where('CodUsuario', user["CodUsuario"]).del();
            await knex('Notificacao').where('CodUsuario', user['CodUsuario']).del();
            await knex("Usuario").where("Email", email).del();
            return response.json({ deletedUser: true });
        } else {
            return response.json({
                deletedUser: false,
                error: "Usuário não encontrado.",
            });
        }
    }

    async requestChangeUserType(request: Request, response: Response) {
        const { notificationId } = request.params;
        const { TipoNotificacao } = request.body;
        const notificationDB = await knex('Usuario_Notificacao').where("CodNotificacao", notificationId);
        if (notificationDB && notificationDB.length > 0) {
            if (!notificationDB[0].CodUsuario) {
                return response.json({ requestChangeUserType: false, error: 'Não foi encontrado código de usuário.' });
            }
            let id = notificationDB[0].CodUsuario;
            const userDBSelect = await knex('Usuario').where('CodUsuario', id);
            const user = userDBSelect[0];
            if (user['requestUserType'] == 'FM') {
                return response.json({ requestChangeUserType: false, error: 'Solicitação enviada anteriormente. Contacte o responsável pelo sistema para mais informações.' })
            } else {
                const userDBUpdate = await knex('Usuario').where('CodUsuario', id).update({
                    requestUserType: 'FM'
                })
                var notificationDescription = "";
                var notificationType = "";
                if (TipoNotificacao == "Create") {
                    notificationDescription = `${user["Nome"]} deseja criar uma conta.`;
                    notificationType = "Create";
                } else if (TipoNotificacao == "Change") {
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
                    if (notifications) {
                        knex("Usuario_Notificacao").insert({ "CodNotificacao": notifications[0], "CodUsuario": userId }).then(userResponse => {
                            if (userResponse) {
                                return response.json({ requestChangeUserType: true });
                            } else {
                                return response.json({ requestChangeUserType: false, error: "Não pode inserir em usuario." });
                            }
                        })
                    } else {
                        return response.json({ requestChangeUserType: false, error: "Não pode inserir em notificacao." });
                    }
                })
            }
        } else {
            return response.json({ requestChangeUserType: false, error: "Notificação não encontrada ou não pode fazer a solicitação." });
        }
    }
    async changeUserType(request: Request, response: Response) {
        const { userId, newUserType } = request.body;
        const charNewUserType = newUserType[0];
        if (userId) {
            const userDB = await knex('Usuario').select("*").where('CodUsuario', userId);
            if (userDB[0]['TipoUsuario'] === 'A') {
                return response.json({ verifyUser: false, error: "Não é possível alterar o tipo de usuário de Administrador." })
            }
            if (userDB[0]['TipoUsuario'] === charNewUserType) {
                return response.json({ updatedUser: false, error: "Usuário já possui o referido cargo." });
            } else {
                const userDBUpdate = await knex('Usuario').where('CodUsuario', userId).update({
                    TipoUsuario: charNewUserType
                })
                if (userDBUpdate === 1) {
                    return response.json({ updatedUser: true });
                } else {
                    return response.json({ updateduser: false, error: "Erro na atualização da permissão do usuário" });
                }
            }
        }
    }

    async verifyUser(request: Request, response: Response) {
        const { userId, verifyUserOption } = request.body;
        const charVerifyUserOption = verifyUserOption[0];
        if (userId) {
            const userDB = await knex('Usuario').select("*").where('CodUsuario', userId);
            if (userDB[0]['TipoUsuario'] === 'A') {
                return response.json({ verifyUser: false, error: "Não é possível alterar a verificação de Administrador." })
            }
            if (userDB[0]['isVerified'] === verifyUserOption) {
                return response.json({ verifyUser: false, error: "Usuário já possui a verificação solicitada." });
            } else {
                var userDBUpdate;
                if (charVerifyUserOption === 'S') {
                    userDBUpdate = await knex('Usuario').where('CodUsuario', userId).update({
                        isVerified: 1
                    })
                    const codNotificacaoDB = await knex('Usuario_Notificacao').where("CodUsuario", userId);
                    const notificationDB = await knex("Notificacao").where("CodNotificacao", codNotificacaoDB[0]["CodNotificacao"]).update({
                        StatusAR: 'A',
                        Status: 1
                    });
                    if (notificationDB) {
                        return response.json({ verifyUser: true });
                    } else {
                        return response.json({ verifyUser: false, error: "Não foi possível verificar o usuário" });
                    }
                } else {
                    userDBUpdate = await knex('Usuario').where('CodUsuario', userId).update({
                        isVerified: 0
                    })
                }
                if (userDBUpdate === 1) {
                    return response.json({ verifyUser: true });
                } else {
                    return response.json({ verifyUser: false, error: "Não foi possível alterar a verificação do usuário." });
                }
            }
        }
    }
    async checkAdminUser(request: Request, response: Response) {
        const { email } = request.params;
        var userDB = await knex('Usuario').where('Email', email);
        const user = userDB[0];
        if (user) {
            if (user.TipoUsuario === 'A') {
                return response.json({ adminUser: true })
            } else {
                return response.json({ adminUser: false, error: "Usuário não tem permissão" })
            }
        } else {
            return response.json({ adminUser: false, error: "Usuário não encontrado." })
        }
    }
}

export default UserController;
