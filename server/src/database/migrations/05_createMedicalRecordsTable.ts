import knex from "knex";

export async function up(knex: knex) {
  return knex.schema.createTable("Prontuario", (table) => {
    table.increments("SeqProntuario").primary();
    table.integer("NroProntuario").notNullable();
    table.integer("NroPaciente").notNullable();
    table.string("DataInternacao").notNullable();
    table.integer("CodDoencaPrincipal").references('index').inTable('Doenca').notNullable();
    table.integer("CodDoencaSecundario").references('index').inTable('Doenca');
    table.string("SistemaAcometido").notNullable();
    table.string("CodComorbidade");
    table.string("Origem").notNullable();
    table.string("Alocacao").notNullable();
    table.string("DataDesfecho");
    table.enu("ResultadoColeta", ["S", "N"]);
    table.string("CodAtbPrimario").references("EAN").inTable("Medicamentos").notNullable();
    table.string("CodAtbSecundario").references("EAN").inTable("Medicamentos");
    table.string("SitioInfeccaoPrimario");
    table.enu("TratamentoCCIH", ["S", "N"]).notNullable();
    table.enu("IndicacaoSepse", ["S", "N"]).notNullable();
    table.enu("DisfuncaoRenal", ["S", "N"]).notNullable();
    table.string("OrigemInfeccao").notNullable();
    table.enu("Desfecho", ["A", "O", "T"]);
    table.enu("DoseCorreta", ["S", "N"]);
    table.enu("PosologiaCorreta", ["S", "N"]);
  });
}

export async function down(knex: knex) {
  return knex.schema.dropTable("Prontuario");
}
