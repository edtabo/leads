import { Inject, Injectable } from '@nestjs/common';

import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { LogType, ResponseStatus } from '../../../shared/enums';
import { IResponse } from '../../../shared/interfaces';
import { app } from '../../../shared/localizations';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class GetStatsUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private repository: UserRepositoryPort,
  ) { }

  async execute(): Promise<IResponse<unknown>> {
    try {
      const queryStats = await this.repository.findStats();

      if (!queryStats)
        return { status: ResponseStatus.ERROR, message: app.errors.tryAgain };

      return {
        status: ResponseStatus.SUCCESS,
        data: queryStats,
      };
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return { status: ResponseStatus.ERROR, message: app.errors.tryAgain };
    }
  }
}