import knex from "knex";

export async function up(knex: knex) {
   return knex.schema.createTable("Avaliacao", (table) => {
      table.increments("IdAvaliacao").primary();
      table.integer("IdProntuario").references("SeqProntuario").inTable("Prontuario").unsigned();
      table.integer("IdPaciente").references("SeqPaciente").inTable("Paciente").unsigned();
      table.integer("NroAvaliacao").notNullable();
      table.string("DataAvaliacao").notNullable();
      table.string("ResultadoCulturas");
      table.string("ResCulturasAcao");
      table.enu("DoseCorreta", ["S", "N"]);
      table.enu("PosologiaCorreta", ["S", "N"]);
      table.enu("AlertaDot", ["S", "N"]);
      table.string("AlertaDotDescricao");
      table.string("DisfuncaoRenal").notNullable();
      table.enu("Hemodialise", ["S", "N", "SI"]).notNullable();   //Sim, nao, sim intermitente
      table.enu("AtbOral", ["S", "N", "NA"]).notNullable();   //Sim, nao, nao aplica
      table.enu("AtbContraindicacao", ["S", "N"]).notNullable();
      table.enu("AlteracaoPrescricao", ["S", "N"]);
      table.enu("AtbDiluicaoInfusao", ["S", "N"]).notNullable();
      table.enu("InteracaoAtbMedicamento", ["S", "N"]).notNullable();
      table.enu("TrocaAtb", ["S", "N"]).notNullable();
      table.string("NovoAtb").references("EAN").inTable("Medicamentos")
      table.timestamps(true, true);
   });
}

export async function down(knex: knex) {
   return knex.schema.dropTable("Avaliacao");
}