import { Inject, Injectable } from '@nestjs/common';

import { User } from '@/domain/entities/user.entity';
import { UserRepositoryPort } from '@/domain/ports/user.repository.port';
import { UpdateDto } from '@/presentation/dtos/user';
import { LogType, ResponseStatus, Role } from '@/shared/enums';
import { IResponse, IUseCaseParams } from '@/shared/interfaces';
import { app } from '@/shared/localizations';
import { logger } from '@/shared/utils/logger';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private repository: UserRepositoryPort,
  ) { }

  async execute(props: IUseCaseParams<UpdateDto>): Promise<IResponse<string>> {
    try {
      const { body, id } = props;

      if (!body || !id)
        return { status: ResponseStatus.ERROR, message: app.errors.requiredData };

      const { fullName, phone, source, productOfInterest, budget } = body;

      const newData = new User({
        id: String(id),
        role: Role.USER,
        fullName,
        phone,
        source,
        productOfInterest,
        budget,
      });

      const queryUpdate = await this.repository.update(newData);

      if (!queryUpdate)
        return { status: ResponseStatus.ERROR, message: app.errors.tryAgain };

      return {
        status: ResponseStatus.SUCCESS,
        message: app.success.update,
      };
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return { status: ResponseStatus.ERROR, message: app.errors.tryAgain };
    }
  }
}
