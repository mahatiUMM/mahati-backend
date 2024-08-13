import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { adminScheduleController } from "../../controllers/admin/schedule.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/schedule",
  tokenValidation(),
  adminScheduleController.getAllSchedules
);
routes.get(
  "/schedule/:id",
  tokenValidation(),
  adminScheduleController.getScheduleById
);
routes.post(
  "/schedule",
  adminScheduleController.createSchedule
);
routes.put(
  "/schedule/:id",
  tokenValidation(),
  adminScheduleController.updateSchedule
);
routes.delete(
  "/schedule/:id",
  tokenValidation(),
  adminScheduleController.deleteSchedule
);

export default routes;