import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { adminReminderController } from "../../controllers/admin/reminder.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/reminder",
  tokenValidation(),
  adminReminderController.getAllReminders
);
routes.get(
  "/reminder/:id",
  tokenValidation(),
  adminReminderController.getReminderById
);
routes.post(
  "/reminder",
  tokenValidation(),
  adminReminderController.createReminder
);
routes.put(
  "/reminder/:id",
  tokenValidation(),
  adminReminderController.updateReminder
);
routes.delete(
  "/reminder/:id",
  tokenValidation(),
  adminReminderController.deleteReminder
);

export default routes;