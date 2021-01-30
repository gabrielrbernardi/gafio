import { IPageable } from "../interfaces/PageableInterface";
import { MicrobiologyModel } from "../models/MicrobiologyModel";

class MicrobiologyRepository {
    async create(microbiology: any) {
        await MicrobiologyModel.query().insert(microbiology);
    }

    async update(id: number, microbiology: any) {
        await MicrobiologyModel.query().findById(id).patch(microbiology);
    }

    async delete(id: number) {
        await MicrobiologyModel.query().deleteById(id);
    }

    async findById(id: number) {
        return await MicrobiologyModel.query().findById(id);
    }

    async showWithPatientAndMedicalRecordsData(id: number) {
        return await MicrobiologyModel.query()
            .where({ IdMicrobiologia: id })
            .join(
                "Prontuario",
                "Prontuario.SeqProntuario",
                "=",
                "Microbiologia.IdProntuario"
            )
            .join(
                "Paciente",
                "Paciente.SeqPaciente",
                "=",
                "Microbiologia.IdPaciente"
            )
            .select(
                "Microbiologia.*",
                "Prontuario.NroProntuario",
                "Paciente.NomePaciente",
                "Paciente.NroPaciente"
            );
    }

    async findByIdPaciente(idPaciente: number, pageable: IPageable) {
        const [count] = await MicrobiologyModel.query()
            .where({ IdPaciente: idPaciente })
            .count({ count: "*" });
        
        const results = await MicrobiologyModel.query()
            .where({ IdPaciente: idPaciente })
            .limit(pageable.rows)
            .offset((pageable.page - 1) * pageable.rows);

        return { results, count };
    }

    async findByIdProntuario(idProntuario: number, pageable: IPageable) {
        const [count] = await MicrobiologyModel.query()
            .where({ IdProntuario: idProntuario })
            .count({ count: "*" });
        const results = await MicrobiologyModel.query()
            .where({ IdProntuario: idProntuario })
            .limit(pageable.rows)
            .offset((pageable.page - 1) * pageable.rows);

        return { results, count };
    }

    async findByDataColeta(dataColeta: string, pageable: IPageable) {
        const [count] = await MicrobiologyModel.query()
            .where("DataColeta", "LIKE", `%${dataColeta}%`)
            .count({ count: "*" });
        const results = await MicrobiologyModel.query()
            .where("DataColeta", "LIKE", `%${dataColeta}%`)
            .limit(pageable.rows)
            .offset((pageable.page - 1) * pageable.rows);

        return { results, count };
    }

    async findByDataResultado(dataResultado: string, pageable: IPageable) {
        const [count] = await MicrobiologyModel.query()
            .where("DataResultado", "LIKE", `%${dataResultado}%`)
            .count({ count: "*" });
        const results = await MicrobiologyModel.query()
            .where("DataResultado", "LIKE", `%${dataResultado}%`)
            .limit(pageable.rows)
            .offset((pageable.page - 1) * pageable.rows);

        return {results,count};
    }

    async listAllByPagination(pageable:IPageable) {
        const [count] = await MicrobiologyModel.query().count({ count: "*" });
        const results = await MicrobiologyModel.query().limit(pageable.rows).offset((pageable.page - 1) * pageable.rows);

        return {results,count};
    }
}

export default new MicrobiologyRepository();
