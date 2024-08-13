import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { adminQuesionnaireQuestionController } from "../../controllers/admin/questionnaireQuestion.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/questionnaire_question",
  tokenValidation(),
  adminQuesionnaireQuestionController.getAllQuestionnaireQuestions
);
routes.get(
  "/questionnaire_question/:id",
  tokenValidation(),
  adminQuesionnaireQuestionController.getQuestionnaireQuestionById
);
routes.post(
  "/questionnaire_question",
  adminQuesionnaireQuestionController.createQuestionnaireQuestion
);
routes.post(
  "/questionnaire_question_answer",
  adminQuesionnaireQuestionController.createQuestionnaireQuestionAnswer
)
routes.put(
  "/questionnaire_question/:id",
  tokenValidation(),
  adminQuesionnaireQuestionController.updateQuestionnaireQuestion
);
routes.delete(
  "/questionnaire_question/:id",
  tokenValidation(),
  adminQuesionnaireQuestionController.deleteQuestionnaireQuestion
);

export default routes;