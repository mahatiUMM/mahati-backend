import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { adminUserController } from "../../controllers/admin/user.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/users",
  tokenValidation(),
  adminUserController.getAllUsers
);

export default routes;