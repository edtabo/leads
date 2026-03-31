import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { LogType, ResponseStatus, Source } from '../../../shared/enums';
import { IResponse } from '../../../shared/interfaces';
import { app } from '../../../shared/localizations';
import { logger } from '../../../shared/utils/logger';

export interface SeedLeadData {
  fullName: string;
  email: string;
  phone: string;
  source: string;
  productOfInterest: string;
  budget: number;
}

const fakeEmail = (name: string) => `${name.split(' ')[0].toLowerCase()}${Date.now()}@${name.split(' ')[0].toLowerCase()}.com`;
const fakePhone = () => `+57300${Math.floor(Math.random() * 100000000)}`;

const SEED_LEADS: SeedLeadData[] = [
  {
    fullName: 'Juan Pérez',
    email: fakeEmail('Juan Pérez'),
    phone: fakePhone(),
    source: Source.OTHER,
    productOfInterest: 'Plan Premium',
    budget: 150000,
  },
  {
    fullName: 'María García',
    email: fakeEmail('María García'),
    phone: fakePhone(),
    source: Source.FACEBOOK,
    productOfInterest: 'Plan Básico',
    budget: 80000,
  },
  {
    fullName: 'Carlos López',
    email: fakeEmail('Carlos López'),
    phone: fakePhone(),
    source: Source.INSTAGRAM,
    productOfInterest: 'Plan Empresarial',
    budget: 250000,
  },
  {
    fullName: 'Ana Martínez',
    email: fakeEmail('Ana Martínez'),
    phone: fakePhone(),
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Premium',
    budget: 180000,
  },
  {
    fullName: 'Pedro Sánchez',
    email: fakeEmail('Pedro Sánchez'),
    phone: fakePhone(),
    source: Source.REFERRAL,
    productOfInterest: 'Plan Profesional',
    budget: 200000,
  },
  {
    fullName: 'Laura Rodríguez',
    email: fakeEmail('Laura Rodríguez'),
    phone: fakePhone(),
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Básico',
    budget: 75000,
  },
  {
    fullName: 'Miguel Torres',
    email: fakeEmail('Miguel Torres'),
    phone: fakePhone(),
    source: Source.FACEBOOK,
    productOfInterest: 'Plan Empresarial',
    budget: 300000,
  },
  {
    fullName: 'Sofia Díaz',
    email: fakeEmail('Sofia Díaz'),
    phone: fakePhone(),
    source: Source.INSTAGRAM,
    productOfInterest: 'Plan Premium',
    budget: 160000,
  },
  {
    fullName: 'Jorge Hernández',
    email: fakeEmail('Jorge Hernández'),
    phone: fakePhone(),
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Profesional',
    budget: 220000,
  },
  {
    fullName: 'Isabel Flores',
    email: fakeEmail('Isabel Flores'),
    phone: fakePhone(),
    source: Source.REFERRAL,
    productOfInterest: 'Plan Básico',
    budget: 90000,
  },
  {
    fullName: 'Diego Ramírez',
    email: fakeEmail('Diego Ramírez'),
    phone: fakePhone(),
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Empresarial',
    budget: 280000,
  },
  {
    fullName: 'Carmen Castillo',
    email: fakeEmail('Carmen Castillo'),
    phone: fakePhone(),
    source: Source.FACEBOOK,
    productOfInterest: 'Plan Premium',
    budget: 175000,
  },
  {
    fullName: 'Fernando Ruiz',
    email: fakeEmail('Fernando Ruiz'),
    phone: fakePhone(),
    source: Source.INSTAGRAM,
    productOfInterest: 'Plan Profesional',
    budget: 210000,
  },
  {
    fullName: 'Patricia González',
    email: fakeEmail('Patricia González'),
    phone: fakePhone(),
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Básico',
    budget: 85000,
  },
  {
    fullName: 'Alejandro Morales',
    email: fakeEmail('Alejandro Morales'),
    phone: fakePhone(),
    source: Source.REFERRAL,
    productOfInterest: 'Plan Empresarial',
    budget: 320000,
  },
  {
    fullName: 'Claudia Suárez',
    email: fakeEmail('Claudia Suárez'),
    phone: fakePhone(),
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Premium',
    budget: 190000,
  },
  {
    fullName: 'Roberto Vega',
    email: fakeEmail('Roberto Vega'),
    phone: fakePhone(),
    source: Source.FACEBOOK,
    productOfInterest: 'Plan Profesional',
    budget: 230000,
  },
  {
    fullName: 'Elena Jiménez',
    email: fakeEmail('Elena Jiménez'),
    phone: fakePhone(),
    source: Source.INSTAGRAM,
    productOfInterest: 'Plan Básico',
    budget: 95000,
  },
  {
    fullName: 'Gabriel Ortega',
    email: fakeEmail('Gabriel Ortega'),
    phone: fakePhone(),
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Empresarial',
    budget: 290000,
  },
  {
    fullName: 'Lucía Mendoza',
    email: fakeEmail('Lucía Mendoza'),
    phone: fakePhone(),
    source: Source.REFERRAL,
    productOfInterest: 'Plan Premium',
    budget: 185000,
  },
  {
    fullName: 'Andrés Cruz',
    email: fakeEmail('Andrés Cruz'),
    phone: fakePhone(),
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Profesional',
    budget: 240000,
  },
  {
    fullName: 'Verónica Rubio',
    email: fakeEmail('Verónica Rubio'),
    phone: fakePhone(),
    source: Source.FACEBOOK,
    productOfInterest: 'Plan Básico',
    budget: 82000,
  },
  {
    fullName: 'Sergio Núñez',
    email: fakeEmail('Sergio Núñez'),
    phone: fakePhone(),
    source: Source.INSTAGRAM,
    productOfInterest: 'Plan Empresarial',
    budget: 310000,
  },
  {
    fullName: 'Natalia Herrera',
    email: fakeEmail('Natalia Herrera'),
    phone: fakePhone(),
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Premium',
    budget: 195000,
  },
  {
    fullName: 'Alberto Castillo',
    email: fakeEmail('Alberto Castillo'),
    phone: fakePhone(),
    source: Source.REFERRAL,
    productOfInterest: 'Plan Profesional',
    budget: 255000,
  },
];

@Injectable()
export class SeedLeadsUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private repository: UserRepositoryPort,
  ) { }

  async execute(): Promise<IResponse<{ count: number; leads: SeedLeadData[]; }>> {
    try {
      const users = SEED_LEADS.map(
        (lead) =>
          new User({
            fullName: lead.fullName,
            email: lead.email,
            phone: lead.phone,
            source: lead.source,
            productOfInterest: lead.productOfInterest,
            budget: lead.budget,
          }),
      );

      const result = await this.repository.createMany(users);

      if (!result)
        return {
          status: ResponseStatus.ERROR,
          message: app.errors.tryAgain,
          data: { count: 0, leads: [] },
        };

      return {
        status: ResponseStatus.SUCCESS,
        message: app.success.register,
        data: { count: SEED_LEADS.length, leads: SEED_LEADS },
      };
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return {
        status: ResponseStatus.ERROR,
        message: app.errors.tryAgain,
        data: { count: 0, leads: [] },
      };
    }
  }
}