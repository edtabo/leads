import { Inject, Injectable } from '@nestjs/common';

import { UserRepositoryPort } from '@/domain/ports/user.repository.port';
import { LogType, ResponseStatus } from '@/shared/enums';
import { IResponse, IUseCaseParams } from '@/shared/interfaces';
import { app } from '@/shared/localizations';
import { logger } from '@/shared/utils/logger';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private repository: UserRepositoryPort,
  ) { }

  async execute(props: IUseCaseParams<unknown>): Promise<IResponse<string>> {
    try {
      const { id } = props;

      if (!id)
        return { status: ResponseStatus.ERROR, message: app.errors.requiredData };

      const queryDelete = await this.repository.delete(id.toString());

      if (!queryDelete)
        return { status: ResponseStatus.ERROR, message: app.errors.tryAgain };

      return {
        status: ResponseStatus.SUCCESS,
        message: app.success.delete,
      };
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return { status: ResponseStatus.ERROR, message: app.errors.tryAgain };
    }
  }
}
