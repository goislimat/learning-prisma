import { User, UserCreateInput, UserWithoutPassword } from "../types/user";

interface IUsersRepository {
  findById: (id: number) => Promise<User>;
  findByEmail: (email: string) => Promise<User>;
  save: (params: UserCreateInput) => Promise<UserWithoutPassword>;
}

export default IUsersRepository;
