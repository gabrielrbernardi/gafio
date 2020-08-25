import knex from "knex";

export async function up(knex: knex) {
  return knex.schema.createTable("Prontuario", (table) => {
    table.increments("SeqProntuario").primary();
    table.integer("NroProntuario").notNullable();
    table.integer("NroPaciente").notNullable(); //IdPaciente
    table.string("DataInternacao").notNullable();
    table.string("CodDoencaPrincipal").references('CodDoenca').inTable('Doenca').notNullable();
    table.string("CodDoencaSecundario").references('CodDoenca').inTable('Doenca');
    table.string("SistemaAcometido").notNullable();
    table.string("CodComorbidade");
    table.string("Origem").notNullable();
    table.string("Alocacao").notNullable();
    table.string("DataDesfecho");
    table.string("Coleta");
    table.string("ResultadoColeta");
    table.string("CodAtbPrimario").references("EAN").inTable("Medicamentos").notNullable();
    table.string("CodAtbSecundario").references("EAN").inTable("Medicamentos");
    table.string("SitioInfecaoPrimario");
    table.enu("TratamentoCCIH", ["S", "N"]).notNullable();
    table.enu("IndicacaoSepse", ["S", "N"]).notNullable();
    table.enu("DisfuncaoRenal", ["S", "N"]).notNullable();
    table.string("OrigemInfeccao").notNullable();
    table.string("Desfecho");
    table.enu("DoseCorreta", ["S", "N"]);
    table.enu("PosologiaCorreta", ["S", "N"]);
  });
}

export async function down(knex: knex) {
  return knex.schema.dropTable("Prontuario");
}
