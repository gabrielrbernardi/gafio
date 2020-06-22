import express from "express";
import UserController from "../controllers/User";
import UserSession from "../controllers/UserSession";
import AuthMiddleware from "../middlewares/auth";

const routes = express.Router();
const user = new UserController();
const userSession = new UserSession();
const authMiddleware = new AuthMiddleware();

//Routes to User CRUD
routes.get("/users", user.index);
routes.get("/users/id/:id", user.showId);
routes.get("/users/email/:email", user.showEmail);
routes.post("/users", user.create);
routes.put("/users/:id", user.update);
routes.delete("/users", user.delete);
routes.put('/users/requestChangeUserType/:id', user.requestChangeUserType);

//Routes to User Login and account check
routes.post("/session/login", userSession.login);
routes.post("/session/requestUpdateUserType", userSession.requestUpdateUserType);

export default routes;
