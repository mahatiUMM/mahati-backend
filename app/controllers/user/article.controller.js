import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";
import { removeFile } from "../../lib/multerStorage.js";

export const createArticle = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }
    
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
    }

    res.json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

export const updateArticle = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const articleId = parseInt(req.params.id);
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const article = await prisma.articles.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({
        status: 404,
        message: "Article not found.",
      });
    }

    if (!title || !description) {
      return res.status(400).json({ message: "Please fill all required fields." });
    };

    const updatedArticle = await prisma.articles.update({
      where: { id: articleId },
      data: {
        title,
        description,
      },
    });

    res.json({ success: true, data: updatedArticle });
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (req, res, next) => {
  try {
    const articleId = parseInt(req.params.id);
    const article = await prisma.articles.findUnique({
      where: { id: articleId },
    });
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    if (!article) {
      return res.status(404).json({
        status: 404,
        message: "Article not found.",
      });
    }

    await prisma.articles.delete({
      where: { id: articleId },
    });

    removeFile(article.file);

    res.json({ success: true, message: "Article deleted." });
  } catch (error) {
    next(error);
  }
};

export * as userArticleController from "./article.controller.js";