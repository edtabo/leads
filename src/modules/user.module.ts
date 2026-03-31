import { Module } from '@nestjs/common';

import { CreateUserUseCase, DeleteUserUseCase, GetAllUserUseCase, GetStatsUseCase, UpdateUserUseCase } from '@/aplications/use-cases/user';
import { PrismaModule } from '@/infrastructure/database/prisma/prisma.module';
import { PrismaUserRepository } from '@/infrastructure/database/prisma/repositories/prisma-user.repository';
import { LeadsController } from '@/presentation/controllers/leads.controller';

@Module({
  imports: [PrismaModule],
  controllers: [LeadsController],
  providers: [
    CreateUserUseCase,
    GetAllUserUseCase,
    GetStatsUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    {
      provide: 'UserRepositoryPort',
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule { }
