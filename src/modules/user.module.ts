import { Module } from '@nestjs/common';

import { CreateUserUseCase, DeleteUserUseCase, GetAllUserUseCase, UpdateUserUseCase } from '@/aplications/use-cases/user';
import { PrismaModule } from '@/infrastructure/database/prisma/prisma.module';
import { PrismaUserRepository } from '@/infrastructure/database/prisma/repositories/prisma-user.repository';
import { UserController } from '@/presentation/controllers/user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetAllUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    {
      provide: 'UserRepositoryPort',
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule { }
