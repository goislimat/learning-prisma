import { Prisma } from "@prisma/client";

const select = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  password: true,
  isAdmin: true,
});

export function createUser({ name, email, password }: Prisma.UserCreateInput) {
  return Prisma.validator<Prisma.UserCreateArgs>()({
    data: {
      name,
      email,
      password,
    },
    select,
  });
}

export function findById(id: number) {
  return Prisma.validator<Prisma.UserFindFirstOrThrowArgs>()({
    where: {
      id,
    },
    select,
  });
}

export function findByEmail(email: string) {
  return Prisma.validator<Prisma.UserFindUniqueOrThrowArgs>()({
    where: {
      email,
    },
    select,
  });
}
