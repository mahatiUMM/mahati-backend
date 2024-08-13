import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { userBookmarkController } from "../../controllers/user/bookmark.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/bookmark",
  tokenValidation(),
  userBookmarkController.getAllBookmarks
);
routes.get(
  "/bookmark/:id",
  tokenValidation(),
  userBookmarkController.getBookmarkById
);
routes.post(
  "/bookmark",
  tokenValidation(),
  userBookmarkController.createBookmark
);
routes.put(
  "/bookmark/:id",
  tokenValidation(),
  userBookmarkController.updateBookmark
);
routes.delete(
  "/bookmark/:id",
  tokenValidation(),
  userBookmarkController.deleteBookmark
);

export default routes;