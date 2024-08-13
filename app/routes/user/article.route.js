import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { pdfUploader } from "../../lib/multerStorage.js";
import { userArticleController } from "../../controllers/user/article.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/article",
  tokenValidation(),
  userArticleController.getAllArticles
);
routes.get(
  "/article/:id",
  tokenValidation(),
  userArticleController.getArticleById
);
routes.post(
  "/article",
  pdfUploader.single("pdf"),
  userArticleController.createArticle
);
routes.put(
  "/article/:id",
  tokenValidation(),
  userArticleController.updateArticle
);
routes.delete(
  "/article/:id",
  tokenValidation(),
  userArticleController.deleteArticle
);

export default routes;