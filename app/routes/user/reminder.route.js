import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { userReminderController } from "../../controllers/user/reminder.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/reminder",
  tokenValidation(),
  userReminderController.getAllReminders
);
routes.get(
  "/reminder/:id",
  tokenValidation(),
  userReminderController.getReminderById
);
routes.post(
  "/reminder",
  tokenValidation(),
  userReminderController.createReminder
);
routes.put(
  "/reminder/:id",
  tokenValidation(),
  userReminderController.updateReminder
);
routes.delete(
  "/reminder/:id",
  tokenValidation(),
  userReminderController.deleteReminder
);

export default routes;