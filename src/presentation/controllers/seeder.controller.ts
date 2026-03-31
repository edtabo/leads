import { Controller, Get } from '@nestjs/common';

import { SeedLeadsUseCase } from '@/aplications/use-cases/user';

@Controller('seeder')
export class SeederController {
  constructor(private readonly seedCase: SeedLeadsUseCase) { }

  @Get()
  seed() {
    return this.seedCase.execute();
  }
}