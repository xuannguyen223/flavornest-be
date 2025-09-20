import express from "express";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import appConfig from "./config/app.config.js";
import session from "express-session";
import recipeRoutes from "./routes/recipe.routes.js";
import cdnRoutes from "./routes/cdn.routes.js";

class App {
  private app: Express;

  constructor() {
    this.app = express();

    this.initMiddlewares();
    this.initRoutes();
  }

  private initMiddlewares() {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        origin: [
          "http://localhost:3000",
          process.env.FLAVORNEST_FE_URL as string,
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      })
    );
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET || "supersecret", // use env var in production
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === "production" ? true : false,
        }, // set true if using HTTPS
      })
    );
  }

  private initRoutes() {
    // /api/auth/*
    this.app.use("/api/auth", authRoutes);
    // /api/user/*
    this.app.use("/api/user", userRoutes);
    // /api/recipe/*
    this.app.use("/api/recipe", recipeRoutes);
    // /api/cdn/*
    this.app.use("/api/cdn", cdnRoutes);
  }

  public start() {
    const { port } = appConfig;

    this.app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  }
}

export default App;
