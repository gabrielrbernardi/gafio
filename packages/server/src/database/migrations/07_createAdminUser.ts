import knex from 'knex';

export async function up(knex: knex){
    await knex('Usuario').insert(
        {
            CodUsuario: 1, 
            Nome: 'Administrador', 
            Email: 'admin@gafio.com', 
            Senha: '$2b$10$cRO5A5Crb/FSyZcN0i4EnuinyJUZbPrz5.zkv32jyPb7YEzNye8MC', 
            Matricula: 1,
            TipoUsuario: 'A',
            isVerified: 1
        }
    );
    const notification = {
        Descricao: "Administrador criou uma conta", 
        Status: 1, 
        TipoNotificacao: 'Create',
        CodUsuario: 1,
        StatusAR: 'A'
      }
    await knex("Notificacao").insert(notification).then(notifications => {
        knex("Usuario_Notificacao").insert({"CodNotificacao": notifications[0], "CodUsuario": 1}).then(userResponse => {
            console.log(userResponse);
        });
    });
}
// $2b$10$cRO5A5Crb/FSyZcN0i4EnuinyJUZbPrz5.zkv32jyPb7YEzNye8MC
export async function down(knex: knex){
    return knex('Usuario').where('Email', 'admin@gafio.com').del();
}