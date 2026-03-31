interface UserProps {
  id?: string;
  role?: number;
  fullName?: string;
  email?: string;
  phone?: string | null;
  source?: string;
  productOfInterest?: string | null;
  budget?: number | null;

  createdAt?: Date;
  updatedAt?: Date | null;
}

export class User {
  public readonly id?: string;
  public role?: number;
  public fullName?: string;
  public email?: string;
  public phone?: string | null;
  public source?: string;
  public productOfInterest?: string | null;
  public budget?: number | null;

  public createdAt?: Date;
  public updatedAt?: Date | null;

  constructor(props: UserProps) {
    Object.assign(this, props);
  }
}
