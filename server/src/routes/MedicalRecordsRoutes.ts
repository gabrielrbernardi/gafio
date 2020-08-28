import express from "express";
import ProntuarioController from "../controllers/MedicalRecords";

const routes = express.Router();
const records = new ProntuarioController();

routes.post("/medicalRecords", records.create);
routes.get("/medicalRecords", records.index);

routes.get("/medicalByNroProntuario/:id", records.indexByNroProntuario);
routes.get("/medicalByNroPaciente/:id", records.indexByNroPaciente);
routes.get("/medicalByDataInternacao/:id", records.indexByDataInternacao);

routes.get("/medicalRecords/paginate/:page", records.indexPagination)

routes.put("/medicalRecords/:id", records.update)
routes.delete("/medicalRecords/:id", records.delete);

export default routes;
