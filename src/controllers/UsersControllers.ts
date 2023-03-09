import { Request, Response } from "express";

import UsersRepository from "../repositories/UsersRepository";
import UsersService from "../services/UsersService";

class UsersController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const usersRepository = new UsersRepository();
    const usersService = new UsersService(usersRepository);

    const user = await usersService.createUser({ name, email, password });

    return res.status(201).json(user);
  }
}

export default UsersController;
