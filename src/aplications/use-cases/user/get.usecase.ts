import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { User } from '../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { LIMIT_DEFAULT, PAGE_DEFAULT } from '../../../shared/constants';
import { LogType, ResponseStatus, Role, Source } from '../../../shared/enums';
import { IResponse, IUseCaseParams } from '../../../shared/interfaces';
import { app } from '../../../shared/localizations';
import { logger } from '../../../shared/utils/logger';

@Injectable()
export class GetAllUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private repository: UserRepositoryPort,
  ) { }

  async getAll(props: IUseCaseParams<unknown>): Promise<IResponse<User[]>> {
    try {
      const { limit, page, search } = props;

      const where: Prisma.UserWhereInput = {};

      if (search) {
        if (Object.values(Source).includes(search as Source)) {
          where.OR = [
            { source: search },
          ];
        }
        else if (search.includes('__')) {
          const [startDate, endDate] = search.split('__');
          where.OR = [
            { created_at: { gte: new Date(startDate + "T00:00:00"), lte: new Date(endDate + "T23:59:59") } },
          ];
        }
      }

      const query = await this.repository.findAll({
        limit: limit ?? LIMIT_DEFAULT,
        page: page ?? PAGE_DEFAULT,
        where,
      });

      const pagesQuery = await this.repository.findCount({ ...where, role: Role.USER });

      if (query === null || pagesQuery === null)
        return { status: ResponseStatus.ERROR, message: app.errors.tryAgain };

      const data: User[] = query.map((item) => {
        return {
          id: item.id,
          role: item.role,
          fullName: item.fullName,
          email: item.email,
          phone: item.phone,
          source: item.source,
          productOfInterest: item.productOfInterest,
          budget: item.budget,
          createdAt: item.createdAt
        };
      });

      const pages = Math.ceil(pagesQuery / (limit ?? LIMIT_DEFAULT));

      return {
        status: ResponseStatus.SUCCESS,
        data,
        limit,
        page,
        pages,
        last: (page ?? PAGE_DEFAULT) >= pages,
      };
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return { status: ResponseStatus.ERROR, message: app.errors.tryAgain };
    }
  }
}
