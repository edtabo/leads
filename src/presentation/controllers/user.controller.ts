import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { CreateUserUseCase, DeleteUserUseCase, GetAllUserUseCase, GetStatsUseCase, UpdateUserUseCase } from '@/aplications/use-cases/user';
import { CreateDto, UpdateDto } from '@/presentation/dtos/user';
import { ParamsType } from '@/shared/enums';
import { getUseCaseParams } from '@/shared/utils/commons';

import { QueryDto } from '../dtos/commons';

@Controller('leads')
export class UserController {

  constructor(
    private readonly createCase: CreateUserUseCase,
    private readonly deleteCase: DeleteUserUseCase,
    private readonly getCase: GetAllUserUseCase,
    private readonly statsCase: GetStatsUseCase,
    private readonly updateCase: UpdateUserUseCase,
  ) { }

  @Get('stats')
  stats() {
    return this.statsCase.execute();
  }

  @Get()
  findAll(
    @Query() queryParams: QueryDto,
  ) {
    const params = getUseCaseParams({ queryParams, type: ParamsType.FIND_ALL });
    return this.getCase.getAll(params);
  }

  @Post()
  async create(
    @Body() body: CreateDto
  ) {
    const params = getUseCaseParams<CreateDto>({ body, type: ParamsType.CREATE });
    return this.createCase.execute(params);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateDto
  ) {
    const params = getUseCaseParams<UpdateDto>({ body, id, type: ParamsType.UPDATE });
    return this.updateCase.execute(params);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ) {
    const params = getUseCaseParams({ id, type: ParamsType.DELETE });
    return this.deleteCase.execute(params);
  }
}
