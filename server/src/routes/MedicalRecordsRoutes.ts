import express from "express"
import ProntuarioController from "../controllers/MedicalRecords"

const routes = express.Router()
const records = new ProntuarioController()

routes.post("/medicalRecords", records.create)
routes.get("/medicalRecords", records.index)

routes.get("/medicalRecords/paginate/", records.indexPagination)

routes.get("/medicalRecords/nroProntuario/", records.indexByNroProntuario)
routes.get("/medicalRecords/seqPaciente/", records.indexBySeqPaciente)
routes.get("/medicalRecords/dataInternacao/", records.indexByDataInternacao)

routes.put("/medicalRecords/desfecho", records.updateDesfecho)
routes.put("/medicalRecords/update", records.update)
routes.post("/medicalRecords/delete", records.delete)

routes.get("/medicalRecords/diseases", records.indexDiseases)

export default routes;
