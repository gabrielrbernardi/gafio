import api from "../../services/api";
import { IMicrobiology } from "./MicrobiologyModel";

interface IData{
  page: number;
  filter?: string;
  filterValue?: string;
}

class MicrobiologyService {
  async getMicrobiologies(data:IData) {
    let { page, filter, filterValue } = data;
    if (filter && filterValue) {
      return await api.get("/microbiology", { params: { page, filter, filterValue } }).then(response => response.data);
    } else {
      return await api.get("/microbiology", { params: { page } }).then(response => response.data);
    }
  }

  async getById(id:number) {
    return await api.get<IMicrobiology[]>(`/microbiology/${id}`).then(response => response.data);
  }

  async delete(id:number) {
    return  await api.delete(`/microbiology/delete/${id}`).then(response => response.data);
  }

  async view(id: number) {
    return await api.get(`/microbiology/view/${id}`).then(response => response.data);
  }

  async create(data: IMicrobiology){
    await api.post("/microbiology", data).then(response => response.data);
  }

  async update(data: IMicrobiology, id:number) {
    return await api.put(`/microbiology/update/${id}`, data).then(response => response.data);
  }
}

export default new MicrobiologyService();

