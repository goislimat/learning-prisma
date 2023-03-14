import { Request, Response } from "express";
import { z } from "zod";

import UsersRepository from "../repositories/UsersRepository";
import UsersService from "../services/UsersService";
import zParse from "../utils/zParse";

const CreateUserSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(50),
  }),
});

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
