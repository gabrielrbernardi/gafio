import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('usuario', table => {
        table.increments('CodUsuario').primary();
        table.string('Nome').notNullable();
        table.string('Email').notNullable();
        table.string('Senha').notNullable();
        table.string('Matricula').notNullable();
        table.enu('TipoUsuario', ['A', 'M', 'F']);
        table.boolean('isVerified').notNullable();
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
        table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
}

export async function down(knex: knex){
    return knex.schema.dropTable('usuario');
}