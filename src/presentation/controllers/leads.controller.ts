import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { GetAISummaryUseCase } from '../../aplications/use-cases/leads/get-ai-summary.usecase';
import { CreateUserUseCase, DeleteUserUseCase, GetAllUserUseCase, GetStatsUseCase, UpdateUserUseCase } from '../../aplications/use-cases/user';
import { CreateDto, UpdateDto } from '../../presentation/dtos/user';
import { ParamsType } from '../../shared/enums';
import { getUseCaseParams } from '../../shared/utils/commons';
import { QueryDto } from '../dtos/commons';
import { GetAISummaryDto } from '../dtos/leads/get-ai-summary.dto';

@Controller('leads')
export class LeadsController {

  constructor(
    private readonly createCase: CreateUserUseCase,
    private readonly deleteCase: DeleteUserUseCase,
    private readonly getCase: GetAllUserUseCase,
    private readonly statsCase: GetStatsUseCase,
    private readonly updateCase: UpdateUserUseCase,
    private readonly aiSummaryCase: GetAISummaryUseCase,
  ) { }

  @Post('ai/summary')
  getAISummary(
    @Body() body: GetAISummaryDto,
  ) {
    return this.aiSummaryCase.execute(body);
  }

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
