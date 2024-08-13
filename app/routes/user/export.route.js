import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { userExportController } from "../../controllers/user/export.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/export/blood_pressure",
  tokenValidation(),
  userExportController.exportAllBloodPressures
);
routes.get(
  "/export/reminder",
  tokenValidation(),
  userExportController.exportAllReminders
);
routes.get(
  "/export/video",
  tokenValidation(),
  userExportController.exportAllVideos
);

export default routes;