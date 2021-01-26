import { IMicrobiology } from "../interfaces/MicrobiologyInterface";

export interface MicrobiologyService {

    /**
     * Insere uma nova microbiologia no banco de dados
     *
     * @param data
     */
    create(data: IMicrobiology): any;

    /**
     *Busca todas as microbiologias por paginação
     * 
     * @param page 
     * @param rows 
     * @returns uma lista de microbiologia
     */
    index(page: number, rows: number): any;

    /**
     * Busca uma microbiologia por id, devolvendo os dados da mesma juntamente com os dados
     * do prontuário e paciente para mostrar os dados na visualização
     *
     * @param id
     * @returns um microbiologia com dados  do paciente e prontuário
     */
    show(id: number): any;

    /**
     * Retorna uma microbiologia pelo id
     *
     * @param id
     * @returns IMicrobiology || null
     */
    findById(id: number): any;

    /**
     * Busca uma microbiologia pelo id do paciente
     *
     * @param idPaciente
     * @param page
     * @returns uma lista de microbiologia e a quantidade total
     */
    findByIdPaciente(idPaciente: number, page: number, rows: number): any;

    /**
     * Busca uma microbiologia pelo id do prontuário
     *
     * @param idProntuario
     * @param page
     * @returns uma lista de microbiologia e a quantidade total
     */
    findByIdProntuario(idProntuario: number, page: number, rows: number): any;

    /**
     * Busca uma microbiologia pela data de coleta
     *
     * @param idProntuario
     * @param page
     * @returns uma lista de microbiologia e a quantidade total
     */
    findByDataColeta(dataColeta: string, page: number, rows: number): any;

    /**
     * Busca uma microbiologia pela data de resultado
     *
     * @param dataResultado
     * @param page
     * @returns uma lista de microbiologia e a quantidade total
     */
    findByDataResultado(dataResultado: string, page: number, rows: number): any;

    /**
     * Atualiza uma microbiologia
     *
     * @param id
     * @param data
     */
    update(id: number, data: IMicrobiology): any;

    /**
     * Apaga uma microbiologia  por id
     *
     * @param id
     */
    delete(id: number): any;
}
