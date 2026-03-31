import { Module } from '@nestjs/common';

import { CreateUserUseCase, DeleteUserUseCase, GetAllUserUseCase, GetStatsUseCase, SeedLeadsUseCase, UpdateUserUseCase } from '@/aplications/use-cases/user';
import { PrismaModule } from '@/infrastructure/database/prisma/prisma.module';
import { PrismaUserRepository } from '@/infrastructure/database/prisma/repositories/prisma-user.repository';
import { LeadsController } from '@/presentation/controllers/leads.controller';
import { SeederController } from '@/presentation/controllers/seeder.controller';

@Module({
  imports: [PrismaModule],
  controllers: [LeadsController, SeederController],
  providers: [
    CreateUserUseCase,
    GetAllUserUseCase,
    GetStatsUseCase,
    SeedLeadsUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    {
      provide: 'UserRepositoryPort',
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule { }
