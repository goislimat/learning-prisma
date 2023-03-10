import { NextFunction, Request, Response } from "express";
import UsersRepository from "../repositories/UsersRepository";
import UsersService from "../services/UsersService";
import HandledError from "../utils/HandledError";

async function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  const { id } = req.user;

  const usersRepository = new UsersRepository();
  const usersService = new UsersService(usersRepository);

  const user = await usersService.getById(id);

  if (!user.isAdmin) {
    throw new HandledError(
      "You don't have the permissions to access this resource",
      401
    );
  }

  next();
}

export default ensureAdmin;
