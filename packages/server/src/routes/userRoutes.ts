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
routes.get("/users/paginate/:page", user.indexPagination);
routes.get("/users/id/", user.showId);
routes.get("/users/email/", user.showEmail);
routes.get("/users/name/", user.showName);
routes.get("/users/registrations/", user.showRegistrations);
routes.get("/users/userType/", user.showUserType);
routes.post("/users", user.create);
routes.put("/users/:id", user.update);
routes.post("/users/delete", user.delete);
routes.put('/users/requestChangeUserType/:notificationId', user.requestChangeUserType);
routes.post('/users/changeUserType', user.changeUserType);
routes.post('/users/changeVerifyUser', user.verifyUser);
routes.post('/users/checkAdminUser/:email', user.checkAdminUser);

//Routes to User Login and account check
routes.post("/session/login", userSession.login);
routes.post("/session/requestUpdateUserType", userSession.requestUpdateUserType);

export default routes;
