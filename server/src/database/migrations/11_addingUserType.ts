import knex from 'knex';

export async function up(knex: knex) {
    return knex.schema.raw("alter table usuario modify column TipoUsuario enum('A', 'M', 'F', 'L');");
}

export async function down(knex: knex) {
    return knex.schema.raw("alter table usuario modify column TipoUsuario enum('A', 'M', 'F', 'L');");
}