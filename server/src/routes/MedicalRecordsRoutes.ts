import express from "express";
import ProntuarioController from "../controllers/MedicalRecords";

const routes = express.Router();
const records = new ProntuarioController();

routes.post("/medicalRecords", records.create);
routes.get("/medicalRecords", records.index);

routes.get("/medicalRecords/nroProntuario/:NroProntuario?", records.indexByNroProntuario);
routes.get("/medicalRecords/nroPaciente/:NroPaciente?", records.indexByNroPaciente);
routes.get("/medicalRecords/dataInternacao/:DataInternacao?", records.indexByDataInternacao);

routes.get("/medicalRecords/paginate/:page?", records.indexPagination)

routes.put("/medicalRecords/desfecho/:id?", records.updateDesfecho)
routes.put("/medicalRecords/:id?", records.update)
routes.post("/medicalRecords/:id?", records.delete);

export default routes;
