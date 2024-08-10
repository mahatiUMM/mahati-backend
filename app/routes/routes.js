import { Router } from "express";
import { tokenValidation } from "../lib/tokenHandler.js";
import { authController } from "../controllers/auth.controller.js";
import { bloodPressureController } from "../controllers/bloodPressure.controller.js";
import { bookmarkController } from "../controllers/bookmark.controller.js";
import { brochureController } from "../controllers/brochure.controller.js";
import { questionnaireController } from "../controllers/questionnaire.controller.js";
import { questionnaireQuestionController } from "../controllers/questionnaireQuestion.controller.js";
import { reminderController } from "../controllers/reminder.controller.js";
import { scheduleController } from "../controllers/schedule.controller.js";
import { videoController } from "../controllers/video.controller.js";
import { exportController } from "../controllers/export.controller.js";
import { articleController } from "../controllers/article.controller.js";
import { userDashboardController } from "../controllers/userDashboard.controller.js";
import { imageUploader, pdfUploader } from "../lib/multerStorage.js";

const routes = Router({ strict: true });

// auth
routes.post("/signup", authController.signUp);
routes.post("/signin", authController.signIn);
routes.get(
  "/refresh",
  tokenValidation(true),
  authController.refreshAccessToken
);

// userDashboard
routes.get(
  "/dashboard",
  tokenValidation(),
  userDashboardController.getUserDashboard
);

routes.get("/profile", tokenValidation(), authController.getUser);
routes.put("/profile", tokenValidation(), authController.updateUser);

// blood pressures
routes.get(
  "/blood_pressure",
  tokenValidation(),
  bloodPressureController.getAllBloodPressures
);
routes.get(
  "/blood_pressure/:id",
  tokenValidation(),
  bloodPressureController.getBloodPressureById
);
routes.post(
  "/blood_pressure",
  tokenValidation(),
  imageUploader.single("image"),
  bloodPressureController.createBloodPressure
);
routes.put(
  "/blood_pressure/:id",
  tokenValidation(),
  bloodPressureController.updateBloodPressure
);
routes.delete(
  "/blood_pressure/:id",
  tokenValidation(),
  bloodPressureController.deleteBloodPressure
);

// bookmark
routes.get("/bookmark", tokenValidation(), bookmarkController.getAllBookmarks);
routes.post("/bookmark", tokenValidation(), bookmarkController.createBookmark);
routes.delete(
  "/bookmark/:id",
  tokenValidation(),
  bookmarkController.deleteBookmark
);

// brochure
routes.get("/brochure", tokenValidation(), brochureController.getAllBrochures);
routes.get(
  "/brochure/:id",
  tokenValidation(),
  brochureController.getBrochureById
);
routes.post(
  "/brochure",
  imageUploader.array("images", 10),
  brochureController.createBrochure
);
routes.put(
  "/brochure/:id",
  tokenValidation(),
  brochureController.updateBrochure
);
routes.delete(
  "/brochure/:id",
  tokenValidation(),
  brochureController.deleteBrochure
);

// questionnaire
routes.get(
  "/questionnaire",
  tokenValidation(),
  questionnaireController.getAllQuestionnaires
);
routes.get(
  "/questionnaire/:id",
  tokenValidation(),
  questionnaireController.getQuestionnaireById
);
routes.post("/questionnaire", questionnaireController.createQuestionnaire);
routes.put(
  "/questionnaire/:id",
  tokenValidation(),
  questionnaireController.updateQuestionnaire
);
routes.delete(
  "/questionnaire/:id",
  tokenValidation(),
  questionnaireController.deleteQuestionnaire
);

// questionnaire question
routes.get(
  "/questionnaire_question",
  tokenValidation(),
  questionnaireQuestionController.getAllQuestionnaireQuestions
);
routes.get(
  "/questionnaire_question/:id",
  tokenValidation(),
  questionnaireQuestionController.getQuestionnaireQuestionById
);
routes.post(
  "/questionnaire_question",
  questionnaireQuestionController.createQuestionnaireQuestion
);
routes.post(
  "/questionnaire_question_answer",
  questionnaireQuestionController.createQuestionnaireQuestionAnswer
);
routes.put(
  "/questionnaire_question/:id",
  tokenValidation(),
  questionnaireQuestionController.updateQuestionnaireQuestion
);
routes.delete(
  "/questionnaire_question/:id",
  tokenValidation(),
  questionnaireQuestionController.deleteQuestionnaireQuestion
);

// reminder
routes.get("/reminder", tokenValidation(), reminderController.getAllReminders);
routes.get(
  "/reminder/:id",
  tokenValidation(),
  reminderController.getReminderById
);
routes.post("/reminder", reminderController.createReminder);
routes.post(
  "/accept_reminder/:id",
  tokenValidation(),
  reminderController.acceptReminder
);
routes.put(
  "/reminder/:id",
  tokenValidation(),
  reminderController.updateReminder
);
routes.delete(
  "/reminder/:id",
  tokenValidation(),
  reminderController.deleteReminder
);

// schedule
routes.get("/schedule", tokenValidation(), scheduleController.getAllSchedules);
routes.get(
  "/schedule/:id",
  tokenValidation(),
  scheduleController.getScheduleById
);
routes.post("/schedule", scheduleController.createSchedule);
routes.put(
  "/schedule/:id",
  tokenValidation(),
  scheduleController.updateSchedule
);
routes.delete(
  "/schedule/:id",
  tokenValidation(),
  scheduleController.deleteSchedule
);

//video
routes.get("/video", tokenValidation(), videoController.getAllVideos);
routes.get(
  "/video_bookmarked",
  tokenValidation(),
  videoController.getAllBookmarkedVideos
);
routes.get("/video/:id", tokenValidation(), videoController.getVideoById);
routes.post("/video", videoController.createVideo);
routes.put("/video/:id", tokenValidation(), videoController.updateVideo);
routes.delete("/video/:id", tokenValidation(), videoController.deleteVideo);

// export
routes.get(
  "/export/blood_pressure",
  tokenValidation(),
  exportController.exportAllBloodPressures
);

routes.get(
  "/export/reminder",
  tokenValidation(),
  exportController.exportAllReminders
);

routes.get(
  "/export/video",
  tokenValidation(),
  exportController.exportAllVideos
);

// article
routes.get("/article", tokenValidation(), articleController.getAllArticles);

routes.get("/article/:id", tokenValidation(), articleController.getArticleById);

routes.post(
  "/article",
  pdfUploader.single("file"),
  articleController.createArticle
);

routes.put("/article/:id", tokenValidation(), articleController.updateArticle);

routes.delete(
  "/article/:id",
  tokenValidation(),
  articleController.deleteArticle
);

// admin
routes.post("/admin/signin", authController.signInAdmin);
routes.get(
  "/admin/users",
  tokenValidation(),
  userDashboardController.getAllUsers
);
routes.get(
  "/admin/reminders",
  tokenValidation(),
  reminderController.getAllRemindersAdmin
);

export default routes;
