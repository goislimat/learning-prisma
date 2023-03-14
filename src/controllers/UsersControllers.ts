import { Request, Response } from "express";

import UsersRepository from "../repositories/UsersRepository";
import UsersService from "../services/UsersService";
import zParse from "../utils/zParse";
import { CreateUserSchema } from "./schemas/user";

class UsersController {
  async create(req: Request, res: Response) {
    const {
      body: { name, email, password },
    } = await zParse(CreateUserSchema, req);

    const usersRepository = new UsersRepository();
    const usersService = new UsersService(usersRepository);

    const user = await usersService.createUser({ name, email, password });

    return res.status(201).json(user);
  }
}

export default UsersController;
