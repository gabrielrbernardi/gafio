import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Usuario', table => {
        table.increments('IdHistorico').primary();
        table.string('NroProntuario').notNullable();
        table.string('NomePaciente').notNullable();
        table.date('DataNascimento').notNullable();
        table.enu('Genero', ['M', 'F']);
        table.timestamps(true, true);
        table.integer('NroProntuario').notNullable().references('NroProntuario').inTable('Prontuario');
    });
}

export async function down(knex: knex){
    return knex.schema.dropTable('usuario');
}