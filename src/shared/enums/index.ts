export enum LogType {
  INFO = 'info',
  ERROR = 'error',
  WARN = 'warn',
  DEBUG = 'debug',
}

export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum Source {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  LANDING_PAGE = 'landing_page',
  REFERRAL = 'referido',
  OTHER = 'other',
}

export enum Role {
  ADMIN = 0,
  USER = 100
}

export enum ParamsType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  FIND_ALL = 'findAll',
  FIND_BY_ID = 'findById',
}
