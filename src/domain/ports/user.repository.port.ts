import { Prisma } from '@prisma/client';

import { User } from '@/domain/entities/user.entity';

export abstract class UserRepositoryPort {
  abstract findCount(where: Prisma.UserWhereInput): Promise<number | null>;
  abstract findAll(props: {
    limit: number;
    page: number;
    where: Prisma.UserWhereInput;
  }): Promise<User[] | null>;
  abstract findByWhere(where: Prisma.UserWhereInput): Promise<User | null>;
  abstract create(data: User): Promise<boolean | null>;
  abstract update(data: User): Promise<boolean | null>;
  abstract delete(id: string): Promise<boolean | null>;
}
