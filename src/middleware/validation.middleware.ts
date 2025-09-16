import type { NextFunction, Request, Response } from "express";
import z, { ZodError, ZodType } from "zod";
import Send from "../utils/response.utils.js";

class ValidationMiddleware {
  private static formatErrors(error: ZodError) {
    const formattedErrors: Record<string, string[]> = {};
    error.issues.forEach((err) => {
      const field = err.path.join(".");
      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }
      formattedErrors[field].push(err.message);
    });
    return formattedErrors;
  }

  static validateBody(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return Send.validationErrors(res, this.formatErrors(error));
        }
        return Send.error(res, "Invalid request body");
      }
    };
  }

  static validateParams(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.params);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return Send.validationErrors(res, this.formatErrors(error));
        }
        return Send.error(res, "Invalid request params");
      }
    };
  }

  static validateQuery(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse(req.query);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return Send.validationErrors(res, this.formatErrors(error));
        }
        return Send.error(res, "Invalid request query");
      }
    };
  }

  /**
   * Combine schemas (optional convenience helper)
   * Usage: validate({ body: schema1, params: schema2, query: schema3 })
   */
  static validate(schemas: {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
  }) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        if (schemas.body) req.body = schemas.body.parse(req.body);
        if (schemas.params)
          req.params = schemas.params.parse(req.params) as any;
        if (schemas.query) req.query = schemas.query.parse(req.query) as any;
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return Send.validationErrors(res, this.formatErrors(error));
        }
        return Send.error(res, "Invalid request");
      }
    };
  }
}

export default ValidationMiddleware;
