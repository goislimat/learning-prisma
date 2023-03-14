import { Request, Response } from "express";
import { z } from "zod";

import UsersRepository from "../repositories/UsersRepository";
import SessionsService from "../services/SessionsService";
import zParse from "../utils/zParse";

const SessionCreateSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6).max(50),
  }),
});

class SessionsController {
  async create(req: Request, res: Response) {
    const {
      body: { email, password },
    } = await zParse(SessionCreateSchema, req);

    const usersRepository = new UsersRepository();
    const sessionsService = new SessionsService(usersRepository);

    const [user, token] = await sessionsService.create({ email, password });

    return res.status(201).json({ user, token });
  }
}

export default SessionsController;
