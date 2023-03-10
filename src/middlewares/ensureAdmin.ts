import { NextFunction, Request, Response } from "express";
import UsersRepository from "../repositories/UsersRepository";
import UsersService from "../services/UsersService";
import HandledError from "../utils/HandledError";

async function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = req.user?.id;

  if (!userId) {
    throw new HandledError(
      "You don't have the permissions to access this resource",
      401
    );
  }

  const usersRepository = new UsersRepository();
  const usersService = new UsersService(usersRepository);

  const user = await usersService.getById(userId);

  if (!user.isAdmin) {
    throw new HandledError(
      "You don't have the permissions to access this resource",
      401
    );
  }

  next();
}

export default ensureAdmin;
