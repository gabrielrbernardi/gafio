import express from "express";
import HistController from "../controllers/Hist";

const routes = express.Router();
const historico = new HistController();

// routes.post("/historico", historico.create);

// routes.get("/historico", historico.index);
// routes.get("/historico/name/:name", historico.indexByNomePaciente);
// routes.get("/historico/prontuario/:prontuario", historico.indexByNomePaciente);

// routes.delete("/historico/:id", historico.delete);

export default routes;
