import { QueryDto } from '@/presentation/dtos/commons';
import { ParamsType } from '@/shared/enums';

import { LIMIT_DEFAULT, PAGE_DEFAULT } from '../constants';

interface IUseCaseParamsProps<T> {
  body?: T,
  id?: string,
  queryParams?: QueryDto,
  type: ParamsType,
}

export const getUseCaseParams = <T>(data: IUseCaseParamsProps<T>) => {
  const { body, id, queryParams, type } = data;
  const { limit, page, search } = queryParams || {};

  switch (type) {
    case ParamsType.CREATE:
      return {
        body,
      };
    case ParamsType.UPDATE:
      return {
        body,
        id,
      };
    case ParamsType.DELETE:
      return {
        id,
      };
      break;
    case ParamsType.FIND_ALL: {
      let currentLimit = limit ? Number(limit) : LIMIT_DEFAULT;

      if (currentLimit <= LIMIT_DEFAULT)
        currentLimit = LIMIT_DEFAULT;

      const currentSearch = search ? search : '';

      return {
        limit: currentLimit,
        page: page ? Number(page) : PAGE_DEFAULT,
        search: currentSearch,
      };
    }
    case ParamsType.FIND_BY_ID:
      return {
        id,
      };
  }
};
