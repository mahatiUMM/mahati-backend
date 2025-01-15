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
  tokenValidation(),
  adminQuesionnaireQuestionController.createQuestionnaireQuestion
);
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

// Questionnaire Question Answer
routes.get(
  "/questionnaire_question_answer",
  tokenValidation(),
  adminQuesionnaireQuestionController.getAllQuestionnaireQuestionAnswers
);
routes.post(
  "/questionnaire_question_answer",
  tokenValidation(),
  adminQuesionnaireQuestionController.createQuestionnaireQuestionAnswer
);

export default routes;