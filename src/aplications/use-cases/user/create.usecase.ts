import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { CreateDto } from '../../../presentation/dtos/user';
import { LogType, ResponseStatus, Role } from '../../../shared/enums';
import { IResponse, IUseCaseParams } from '../../../shared/interfaces';
import { app } from '../../../shared/localizations';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private repository: UserRepositoryPort,
  ) { }

  async execute(props: IUseCaseParams<CreateDto>): Promise<IResponse<string>> {
    try {
      const { body } = props;

      if (!body)
        return { status: ResponseStatus.ERROR, message: app.errors.requiredData };

      const { fullName, email, phone, source, productOfInterest, budget } = body;

      const queryFind = await this.repository.findByWhere({ email });

      if (queryFind)
        return {
          status: ResponseStatus.ERROR,
          message: app.errors.emailAlreadyRegistered,
        };

      const data = new User({
        role: Role.USER,
        fullName,
        email,
        phone,
        source,
        productOfInterest,
        budget,
      });


      const queryCreate = await this.repository.create(data);

      if (!queryCreate)
        return { status: ResponseStatus.ERROR, message: app.errors.tryAgain };


      return {
        status: ResponseStatus.SUCCESS,
        message: app.success.register,
      };
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return { status: ResponseStatus.ERROR, message: app.errors.tryAgain };
    }
  }
}
