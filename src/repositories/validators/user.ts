import { Prisma } from "@prisma/client";

export function createUser({ name, email, password }: Prisma.UserCreateInput) {
  return Prisma.validator<Prisma.UserCreateArgs>()({
    data: {
      name,
      email,
      password,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
    },
  });
}

export function findById(id: number) {
  return Prisma.validator<Prisma.UserFindFirstOrThrowArgs>()({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      isAdmin: true,
    },
  });
}

export function findByEmail(email: string) {
  return Prisma.validator<Prisma.UserFindUniqueOrThrowArgs>()({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      isAdmin: true,
    },
  });
}
