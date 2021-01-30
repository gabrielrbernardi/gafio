import { IMicrobiology } from "../../interfaces/MicrobiologyInterface";
import { MicrobiologyService } from "../MicrobiologyService";
import MicrobiologyRepository from "../../repositories/MicrobiologyRepository";
import { IPageable } from "../../interfaces/PageableInterface";

class MicrobiologyServiceImpl implements MicrobiologyService {
    async create(data: IMicrobiology) {
        await MicrobiologyRepository.create(data);
    }

    async update(id: number, data: IMicrobiology) {
        await MicrobiologyRepository.update(id, data);
    }

    async delete(id: number) {
        await MicrobiologyRepository.delete(id);
    }

    async show(id: number) {
        const data = await MicrobiologyRepository.showWithPatientAndMedicalRecordsData(id);
        return data;
    }

    async index(pageable:IPageable) {
        const data = await MicrobiologyRepository.listAllByPagination(pageable);
        return data;
    }

    async findById(id: number) {
        const microbiology = await MicrobiologyRepository.findById(id);
        return microbiology;
    }

    async findByIdPaciente(idPaciente: number, pageable: IPageable) {
        const data = await MicrobiologyRepository.findByIdPaciente(idPaciente, pageable);
        return data;
    }

    async findByIdProntuario(idProntuario: number, pageable:IPageable) {
        const data = await MicrobiologyRepository.findByIdProntuario(idProntuario, pageable);
        return data;
    }

    async findByDataColeta(dataColeta: string, pageable:IPageable) {
        const data = await MicrobiologyRepository.findByDataColeta(dataColeta, pageable);
        return data;
    }

    async findByDataResultado(dataResultado: string, pageable:IPageable) {
        const data = await MicrobiologyRepository.findByDataResultado(dataResultado, pageable);
        return data;
    }
}

export default new MicrobiologyServiceImpl();
