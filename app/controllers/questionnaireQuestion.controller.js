import { prisma } from "../lib/dbConnect.js";
export * as questionnaireQuestionController from "./questionnaireQuestion.controller.js";


// Create questionnaire question
export const createQuestionnaireQuestion = async (req, res, next) => {
  try {
    const { questionnaire_id, question } = req.body;

    const newQuestionnaireQuestion = await prisma.questionnaire_questions.create({
      data: {
        questionnaire_id,
        question,
      },
    });

    res.status(201).json({ success: true, data: newQuestionnaireQuestion });
  } catch (error) {
    next(error);
  }
};

// Get all questionnaire questions
export const getAllQuestionnaireQuestions = async (req, res, next) => {
  try {
    const questionnaireQuestions = await prisma.questionnaire_questions.findMany({
      include: {
        questionnaire: true,
        questionnaire_answers: true,
      },
    });

    res.json({ success: true, data: questionnaireQuestions });
  } catch (error) {
    next(error);
  }
};

// Get questionnaire question by ID
export const getQuestionnaireQuestionById = async (req, res, next) => {
  try {
    const questionId = parseInt(req.params.id);

    const questionnaireQuestion = await prisma.questionnaire_questions.findUnique({
      where: { id: questionId },
      include: {
        questionnaire: true,
        questionnaire_answers: true,
      },
    });

    if (!questionnaireQuestion) {
      return res.status(404).json({
        status: 404,
        message: "Questionnaire question not found.",
      });
    }

    res.json({ success: true, data: questionnaireQuestion });
  } catch (error) {
    next(error);
  }
};

// Update questionnaire question by ID
export const updateQuestionnaireQuestion = async (req, res, next) => {
  try {
    const questionId = parseInt(req.params.id);
    const { questionnaire_id, question } = req.body;

    const updatedQuestionnaireQuestion = await prisma.questionnaire_questions.update({
      where: { id: questionId },
      data: {
        questionnaire_id,
        question,
      },
    });

    res.json({ success: true, data: updatedQuestionnaireQuestion });
  } catch (error) {
    next(error);
  }
};

// Delete questionnaire question by ID
export const deleteQuestionnaireQuestion = async (req, res, next) => {
  try {
    const questionId = parseInt(req.params.id);

    const deletedQuestionnaireQuestion = await prisma.questionnaire_questions.delete({
      where: { id: questionId },
    });

    res.json({ success: true, data: deletedQuestionnaireQuestion });
  } catch (error) {
    next(error);
  }
};
