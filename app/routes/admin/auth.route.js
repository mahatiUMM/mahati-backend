import { Router } from "express";
import { adminAuthController } from "../../controllers/admin/auth.controller.js";

const routes = Router({ strict: true });

routes.post(
  "/signin",
  adminAuthController.signInAdmin
)

export default routes;