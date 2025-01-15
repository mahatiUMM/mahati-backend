import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { adminQuestionnaireController } from "../../controllers/admin/questionnaire.controller.js";
import { imageUploader } from "../../lib/multerStorage.js";

const routes = Router({ strict: true });

routes.get(
  "/questionnaire",
  tokenValidation(),
  adminQuestionnaireController.getAllQuestionnaires
);
routes.get(
  "/questionnaire/:id",
  tokenValidation(),
  adminQuestionnaireController.getQuestionnaireById
);
routes.post(
  "/questionnaire",
  tokenValidation(),
  imageUploader.single("image"),
  adminQuestionnaireController.createQuestionnaire
);
routes.put(
  "/questionnaire/:id",
  tokenValidation(),
  imageUploader.single("image"),
  adminQuestionnaireController.updateQuestionnaire
);
routes.delete(
  "/questionnaire/:id",
  tokenValidation(),
  adminQuestionnaireController.deleteQuestionnaire
);

export default routes;