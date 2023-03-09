import { User } from "@prisma/client";

export interface ICreateUserParams {
  name: string;
  email: string;
  password: string;
}

interface IUsersRepository {
  findByEmail: (email: string) => Promise<User>;
  save: (params: ICreateUserParams) => Promise<User>;
}

export default IUsersRepository;
