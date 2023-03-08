import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import jwt from "../config/auth";

const prisma = new PrismaClient();

class SessionsController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Email/password combination invalid" });
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      return res
        .status(401)
        .json({ message: "Email/password combination invalid" });
    }

    const token = sign({}, jwt.secret, {
      subject: String(user.id),
      expiresIn: jwt.expiresIn,
    });

    return res.status(201).json({ user, token });
  }
}

export default SessionsController;
