import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Medicamentos', table => {
        table.integer('EAN').primary();
        table.string('PrincipioAtivo').notNullable();
        table.string('CNPJ').notNullable();
        table.string('Laboratorio').notNullable();
        table.integer('Registro').notNullable();
        table.string('Produto').notNullable();
        table.string('Apresentacao').notNullable();
        table.string('ClasseTerapeutica').notNullable();
        table.integer('PMC 0%').notNullable();
        table.integer('PMC 12%').notNullable();
        table.integer('PMC 17%').notNullable();
        table.integer('PMC 17% ALC').notNullable();
        table.integer('PMC 17,5%').notNullable();
        table.integer('PMC 17,5% ALC').notNullable();
        table.integer('PMC 18%').notNullable();
        table.integer('PMC 20%').notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: knex){
    return knex.schema.dropTable('Medicamentos');
}