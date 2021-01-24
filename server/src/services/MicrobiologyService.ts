import { IMicrobiology } from '../interfaces/MicrobiologyInterface';

export interface MicrobiologyService {
  /**
   * Insere uma nova microbiologia no banco de dados
   * 
   * @param data
   */
  create(data: IMicrobiology): any;

  /**
   * Retorna uma microbiologia pelo id
   * 
   * @param id 
   * @returns IMicrobiology || null
   */
  findById(id: number): any;

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

  /**
  * Busca uma microbiologia por id, devolvendo os dados da mesma juntamente com os dados 
  * do prontuário e paciente para mostrar os dados na visualização
  *
  * @param id
  */
  show(id: number): any;
}

