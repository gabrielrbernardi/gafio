import { Request, Response } from "express";

class Auth {
  async auth(request: Request, response: Response) {
    response.json({ ok: true });
  }
}

export default Auth;
