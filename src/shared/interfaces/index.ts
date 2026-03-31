export interface IUseCaseParams<T> {
  id?: string | number;
  limit?: number;
  search?: string;
  page?: number;
  body?: T;
}


export class IResponse<T> {
  constructor(
    public status: string,
    public data?: T[] | T,
    public message?: string,

    public limit?: number,
    public page?: number,
    public search?: string,

    public pages?: number,
    public last?: boolean,
  ) { }
}
