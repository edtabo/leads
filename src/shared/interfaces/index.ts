export interface UseCaseParams<T> {
  id?: string;
  limit?: number;
  page?: number;
  body?: T;
}


export class Response<T> {
  constructor(
    public status: string,
    public data?: T[] | T,
    public message?: string,

    public limit?: number,
    public page?: number,

    public pages?: number,
    public last?: boolean,
  ) { }
}
