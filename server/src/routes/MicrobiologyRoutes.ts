import express from "express";
import MicrobiologyController from "../controllers/Microbiology";

const routes = express.Router();

routes.post("/microbiology", MicrobiologyController.create);

routes.put("/microbiology/update/:id", MicrobiologyController.update);

routes.get("/microbiology", MicrobiologyController.index);
routes.get("/microbiology/:id", MicrobiologyController.index);


export default routes;
