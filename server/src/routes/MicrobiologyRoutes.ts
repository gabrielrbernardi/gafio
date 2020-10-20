import express from "express";
import MicrobiologyController from "../controllers/Microbiology";

const routes = express.Router();

routes.post("/microbiology", MicrobiologyController.create);

export default routes;
