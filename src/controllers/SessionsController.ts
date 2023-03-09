import { Request, Response } from "express";

import UsersRepository from "../repositories/UsersRepository";
import SessionsService from "../services/SessionsService";

class SessionsController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const usersRepository = new UsersRepository();
    const sessionsService = new SessionsService(usersRepository);

    const [user, token] = await sessionsService.create({ email, password });

    return res.status(201).json({ user, token });
  }
}

export default SessionsController;
