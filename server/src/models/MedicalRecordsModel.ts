import { Model } from "objection";
import knexConnection from "../database/connection";
import { MicrobiologyModel } from "./MicrobiologyModel";

Model.knex(knexConnection);

export class MedicalRecordsModel extends Model {
    static get tableName() {
        return "Prontuario";
    }

    static get idColumn() {
        return "SeqProntuario";
    }

    static get relationMappings() {
        return {
            Microbiologia: {
                relation: Model.HasManyRelation,
                modelClass: MicrobiologyModel,
                join: {
                    from: "Prontuario.SeqProntuario",
                    to: "Microbiologia.IdProntuario",
                },
            },
        };
    }
}
