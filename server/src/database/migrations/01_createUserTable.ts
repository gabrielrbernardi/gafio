import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Usuario', table => {
        table.increments('CodUsuario').primary();
        table.string('Nome').notNullable();
        table.string('Email').notNullable();
        table.string('Senha').notNullable();
        table.string('Matricula').notNullable();
        table.enu('TipoUsuario', ['A', 'M', 'F']);
        table.string('authToken');
        table.boolean('isVerified').notNullable();
        table.enu('requestUserType', ['FM', 'MF', 'MA', 'AM']);
        table.integer('CodNotificacao').references('CodNotificacao').inTable('Notificacao').unsigned();
        table.timestamps(true, true);
    });
}

export async function down(knex: knex){
    return knex.schema.dropTable('usuario');
}