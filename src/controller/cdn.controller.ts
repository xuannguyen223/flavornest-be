import type { Request, Response } from "express";
import Send from "../utils/response.utils.js";
import CDNService from "../service/cdn.service.js";

class CdnController {
  static generateUploadUrl = async (req: Request, res: Response) => {
    try {
      const fileName = req.query.name as string;
      const fileType = req.query.type as string;

      const urls = await CDNService.getSignedUploadUrl(fileName, fileType);

      Send.success(res, urls, "Get upload URL successfully");
    } catch (error) {
      // Handle any unexpected errors (e.g., DB errors, network issues)
      console.error("Registration failed:", error); // Log the error for debugging
      return Send.error(res, null, "Registration failed.");
    }
  };
}
export default CdnController;
