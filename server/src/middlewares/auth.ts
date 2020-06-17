import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authConfig = require("../config/auth.json");

class Middleware {
  async(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return response.status(401).json({ error: "No token provided" });
    }

    const tokenParts = authHeader.split(" ");

    if (tokenParts.length === 2) {
      return response.status(401).json({ error: "Token error" });
    }

    const [scheme, token] = tokenParts;

    if (!/^Bearer$/i.test(scheme)) {
      return response.status(401).json({ error: "Token unformated" });
    }

    jwt.verify(token, authConfig.secret, (err: any, decoded: any) => {
      if (err) return response.status(401).json({ error: "Token invalid" });
    });
  }
}

export default Middleware;
