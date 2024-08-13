import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { adminExportController } from "../../controllers/admin/export.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/export/blood_pressure",
  tokenValidation(),
  adminExportController.exportAllBloodPressures
);

export default routes;