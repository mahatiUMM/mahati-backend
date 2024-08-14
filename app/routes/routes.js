import { Router } from "express";
import {
  adminAuthRoutes,
  adminBloodPressureRoutes,
  adminBookmarkRoutes,
  adminBrochureRoutes,
  adminExportRoutes,
  adminQuestionnaireRoutes,
  adminQuestionnaireQuestionRoutes,
  adminReminderRoutes,
  adminScheduleRoutes,
  adminUserRoutes,
  adminVideoRoutes,
} from "./admin/index.js";
import {
  userArticleRoutes,
  userAuthRoutes,
  userBloodPressureRoutes,
  userBookmarkRoutes,
  userBrochureRoutes,
  userExportRoutes,
  userQuestionnaireRoutes,
  userQuestionnaireQuestionRoutes,
  userReminderRoutes,
  userScheduleRoutes,
  userUserRoutes,
  userDashboardRoutes,
  userVideoRoutes,
} from "./user/index.js";

const routes = Router({ strict: true });

// Admin routes group
const adminRoutes = Router();
adminRoutes.use(adminAuthRoutes);
adminRoutes.use(adminBloodPressureRoutes);
adminRoutes.use(adminBookmarkRoutes);
adminRoutes.use(adminBrochureRoutes);
adminRoutes.use(adminExportRoutes);
adminRoutes.use(adminQuestionnaireRoutes);
adminRoutes.use(adminQuestionnaireQuestionRoutes);
adminRoutes.use(adminReminderRoutes);
adminRoutes.use(adminScheduleRoutes);
adminRoutes.use(adminUserRoutes);
adminRoutes.use(adminVideoRoutes);
routes.use("/admin", adminRoutes);


// User routes group
const userRoutes = Router();
userRoutes.use(userArticleRoutes);
userRoutes.use(userAuthRoutes);
userRoutes.use(userBloodPressureRoutes);
userRoutes.use(userBookmarkRoutes);
userRoutes.use(userBrochureRoutes);
userRoutes.use(userExportRoutes);
userRoutes.use(userQuestionnaireRoutes);
userRoutes.use(userQuestionnaireQuestionRoutes);
userRoutes.use(userReminderRoutes);
userRoutes.use(userScheduleRoutes);
userRoutes.use(userUserRoutes);
userRoutes.use(userDashboardRoutes);
userRoutes.use(userVideoRoutes);
routes.use(userRoutes);

export default routes;
