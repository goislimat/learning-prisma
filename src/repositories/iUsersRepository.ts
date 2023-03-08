import { User } from "@prisma/client";

export interface iCreateUserParams {
  name: string;
  email: string;
  password: string;
}

interface iUsersRepository {
  save: (params: iCreateUserParams) => Promise<User>;
}

export default iUsersRepository;
