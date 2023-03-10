import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import jwt from "../config/auth";
import HandledError from "../utils/HandledError";

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const beareToken = req.headers.authorization;

  if (!beareToken) {
    throw new HandledError(
      "You don't have authorization to perform this request",
      401
    );
  }

  const [, token] = beareToken.split(" ");

  try {
    const { sub: userId } = verify(token, jwt.secret);

    req.user = {
      id: Number(userId),
    };
  } catch {
    throw new HandledError(
      "You don't have authorization to perform this request",
      401
    );
  }

  next();
}

export default ensureAuthenticated;
