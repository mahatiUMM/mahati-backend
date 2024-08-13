import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { userScheduleController } from "../../controllers/user/schedule.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/schedule",
  tokenValidation(),
  userScheduleController.getAllSchedules
);
routes.get(
  "/schedule/:id",
  tokenValidation(),
  userScheduleController.getScheduleById
);
routes.post(
  "/schedule",
  userScheduleController.createSchedule
);
routes.put(
  "/schedule/:id",
  tokenValidation(),
  userScheduleController.updateSchedule
);
routes.delete(
  "/schedule/:id",
  tokenValidation(),
  userScheduleController.deleteSchedule
);

export default routes;