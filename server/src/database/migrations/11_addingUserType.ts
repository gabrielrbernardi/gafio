import knex from 'knex';

export async function up(knex: knex) {
    return knex.schema.raw("ALTER TABLE Usuario MODIFY COLUMN TipoUsuario ENUM('A', 'M', 'F', 'L');");
}

export async function down(knex: knex) {
    return knex.schema.raw("ALTER TABLE usuario MODIFY COLUMN TipoUsuario ENUM('A', 'M', 'F', 'L');");
}