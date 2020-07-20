import express from "express";
import ProntuarioController from "../controllers/MedicalRecords";

const routes = express.Router();
const records = new ProntuarioController();

routes.post("/prontuario", records.create);

routes.get("/prontuario", records.index);
routes.get("/prontuario/data/:data", records.indexByDataInternacao);
routes.get("/prontuario/origem/:origem", records.indexByOrigem);

routes.delete("/prontuario/:id", records.delete);

export default routes;
