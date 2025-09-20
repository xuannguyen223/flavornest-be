import BaseRouter from "./router.js";
import type { RouteConfig } from "./router.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import ValidationMiddleware from "../middleware/validation.middleware.js";
import cdnSchema from "../validation/cdn.schema.js";
import CdnController from "../controller/cdn.controller.js";

class CdnRouter extends BaseRouter {
  protected routes(): RouteConfig[] {
    return [
      {
        // get cdn upload url
        method: "get",
        path: "/get-upload-url",
        middlewares: [
          AuthMiddleware.authenticateUser,
          ValidationMiddleware.validateQuery(
            cdnSchema.getUploadUrl.shape.query
          ),
        ],
        handler: CdnController.generateUploadUrl,
      },
    ];
  }
}

export default new CdnRouter().router;
