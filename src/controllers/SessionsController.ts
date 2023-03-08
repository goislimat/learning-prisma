import { Request, Response } from "express";
import UsersRepository from "../repositories/UsersRepository";
import UsersService from "../services/UsersService";

class SessionsController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const usersRepository = new UsersRepository();
    const usersService = new UsersService(usersRepository);

    const user = await usersService.findUserByEmail(email);
    await usersService.validateCredentials(user, password);
    const token = usersService.generateToken(user.id);

    return res.status(201).json({ user, token });
  }
}

export default SessionsController;
