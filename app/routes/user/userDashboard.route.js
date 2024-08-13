import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { userDashboardController } from "../../controllers/user/userDashboard.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/dashboard",
  tokenValidation(),
  userDashboardController.getUserDashboard
);

export default routes;