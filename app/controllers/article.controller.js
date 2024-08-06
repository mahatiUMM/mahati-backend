import { prisma } from "../lib/dbConnect.js";
import { verifyToken } from "../lib/tokenHandler.js";
import { removeFile } from "../lib/multerStorage.js";

// Create article
export const createArticle = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a pdf file." });
    }

    const pdf = req.file ? req.file.path : "";

    if (!pdf) {
      return res.status(400).json({ message: "Please upload a pdf file." });
    }

    const newArticle = await prisma.articles.create({
      data: {
        title,
        description,
        file: pdf,
      },
    });

    res.status(201).json({ success: true, data: newArticle })
  } catch (error) {
    next(error);
  }
}

export const getAllArticles = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const articles = await prisma.articles.findMany();

    res.json({ success: true, data: articles });
  } catch (error) {
    next(error);
  }
};

export const getArticleById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const articleId = parseInt(req.params.id);

    const article = await prisma.articles.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({
        status: 404,
        message: "Article not found.",
      });
    };

    res.json({ success: true, data: article })
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const file = req.file ? req.file.path : "";

    const articleId = parseInt(req.params.id);
    const { title, description } = req.body;

    const updatedArticle = await prisma.articles.update({
      where: { id: articleId },
      data: {
        title,
        description,
        file,
      },
    })

    res.json({ success: true, data: updatedArticle });
  } catch (error) {
    next(error);
  }
}

export const deleteArticle = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const articleId = parseInt(req.params.id);

    const article = await prisma.articles.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({
        status: 404,
        message: "Article not found.",
      });
    };

    if (article.file) {
      try {
        await removeFile(article.file);
      } catch (err) {
        console.error(`Failed to delete file: ${article.file}`, err);
      }
    };


    const deletedArticle = await prisma.articles.delete({
      where: { id: articleId },
    });

    res.json({ success: true, data: deletedArticle });
  } catch (error) {
    next(error);
  }
}

export * as articleController from "./article.controller.js";