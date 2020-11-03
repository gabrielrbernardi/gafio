import knex from "knex";

export async function up(knex: knex) {
    return knex.schema.createTable("Microbiologia", (table) => {
        table.increments("IdMicrobiologia").primary();
        table.integer("IdPaciente").references("SeqPaciente").inTable("Paciente").unsigned();
        table.integer("IdProntuario").references("SeqProntuario").inTable("Prontuario").unsigned();
        table.string("DataColeta").notNullable();
        table.string("DataResultado");
        table.enu("SwabNasal", ["S", "N"]).notNullable();
        table.string("SwabNasalObservacoes");
        table.enu("SwabRetal", ["S", "N"]).notNullable();
        table.string("SwabRetalObservacoes");
        table.enu("Sangue", ["S", "N"]).notNullable();
        table.string("SangueObservacoes");
        table.enu("Urina", ["S", "N"]).notNullable();
        table.string("UrinaObservacoes");
        table.enu("SecrecaoTraqueal", ["S", "N"]).notNullable();
        table.string("SecrecaoTraquealObservacoes");
        table.enu("Outros", ["S", "N"]).notNullable();
        table.string("OutrosObservacoes");
        // table.integer("IdGermeIsolado"); // Campo a ser criado quando tabela de germes for criada
        table.string("PerfilSensibilidade");
    });
}

export async function down(knex: knex) {
    return knex.schema.dropTable("Historico");
}