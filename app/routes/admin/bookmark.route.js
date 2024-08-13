import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { adminBookmarkController } from "../../controllers/admin/bookmark.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/bookmark",
  tokenValidation(),
  adminBookmarkController.getAllBookmarks
);
routes.get(
  "/bookmark/:id",
  tokenValidation(),
  adminBookmarkController.getBookmarkById
);
routes.post(
  "/bookmark",
  tokenValidation(),
  adminBookmarkController.createBookmark
);
routes.put(
  "/bookmark/:id",
  tokenValidation(),
  adminBookmarkController.updateBookmark
);
routes.delete(
  "/bookmark/:id",
  tokenValidation(),
  adminBookmarkController.deleteBookmark
);

export default routes;