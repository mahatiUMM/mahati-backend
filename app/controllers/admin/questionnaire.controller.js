import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";
import { getUserById } from "../../lib/userHandler.js";

export const createQuestionnaire = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)

    if (data?.status) return res.status(data.status).json(data)
    const { type, questionnaire_questions, title, description } = req.body

    if (!type || !title || !description) {
      return res.status(400).json({
        status: 400,
        message: "Please provide all required fields.",
      });
    }

    const image = req.file ? req.file.path : null

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const newQuestionnaire = await prisma.questionnaires.create({
        data: {
          type: parseInt(type),
          title,
          image,
          description,
          questionnaire_questions: {
            create: questionnaire_questions,
          },
        },
        include: {
          questionnaire_questions: true,
        },
      })
      res.status(201).json({ success: true, data: newQuestionnaire })
    } else {
      res.status(403).json({
        status: 403,
        message: "You are not authorized to perform this action.",
      });
    }
  } catch (error) {
    next(error)
  }
}

export const getAllQuestionnaires = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const questionnaires = await prisma.questionnaires.findMany({
        include: {
          questionnaire_questions: {
            include: {
              available_answers: true
            }
          },
        },
      })

      res.json({ success: true, data: questionnaires })
    } else {
      res.status(403).json({
        status: 403,
        message: "You are not authorized to perform this action.",
      });
    }
  } catch (error) {
    next(error)
  }
}

export const getQuestionnaireById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const questionnaireId = parseInt(req.params.id)

    if (!questionnaireId) {
      return res.status(400).json({
        status: 400,
        message: "Please provide all required fields.",
      });
    }

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const questionnaire = await prisma.questionnaires.findUnique({
        where: { id: questionnaireId },
        include: {
          questionnaire_questions: {
            include: {
              available_answers: true
            }
          },
        },
      })

      res.json({ success: true, data: questionnaire })
    } else {
      res.status(403).json({
        status: 403,
        message: "You are not authorized to perform this action.",
      });
    }
  } catch (error) {
    next(error);
  }
}

export const updateQuestionnaire = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const questionnaireId = parseInt(req.params.id)
    const { type, title, description, image } = req.body

    if (!type || !title || !description) {
      return res.status(400).json({
        status: 400,
        message: "Please provide all required fields.",
      });
    }

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const updatedQuestionnaire = await prisma.questionnaires.update({
        where: { id: questionnaireId },
        data: {
          type: parseInt(type),
          title,
          image,
          description,
        },
        include: {
          questionnaire_questions: true,
        },
      })

      res.json({ success: true, data: updatedQuestionnaire })
    } else {
      res.status(403).json({
        status: 403,
        message: "You are not authorized to perform this action.",
      });
    }
  } catch (error) {
    next(error);
  }
}

export const deleteQuestionnaire = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const questionnaireId = parseInt(req.params.id)

    if (!questionnaireId) {
      return res.status(400).json({
        status: 400,
        message: "Please provide all required fields.",
      });
    }

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const hasChildren = await prisma.questionnaire_questions.findFirst({
        where: {
          questionnaire_id: questionnaireId,
        },
      });

      if (hasChildren) {
        await prisma.$transaction(async (prisma) => {
          await prisma.available_answers.deleteMany({
            where: {
              questionnaireQuestion: {
                questionnaire_id: questionnaireId,
              },
            },
          });

          await prisma.questionnaire_answers.deleteMany({
            where: {
              question: {
                questionnaire_id: questionnaireId,
              },
            },
          });

          await prisma.questionnaire_questions.deleteMany({
            where: {
              questionnaire_id: questionnaireId,
            },
          });

          await prisma.questionnaires.delete({
            where: { id: questionnaireId },
          });
        });

        return res.json({ success: true, message: "Questionnaire deleted successfully." });
      } else {
        await prisma.questionnaires.delete({
          where: { id: questionnaireId },
        });

        return res.json({ success: true, message: "Questionnaire deleted successfully." });
      }
    } else {
      res.status(403).json({
        status: 403,
        message: "You are not authorized to perform this action.",
      });
    }
  } catch (error) {
    next(error);
  }
}

export * as adminQuestionnaireController from "./questionnaire.controller.js";