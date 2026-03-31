import { Inject, Injectable } from '@nestjs/common';

import { User } from '@/domain/entities/user.entity';
import { UserRepositoryPort } from '@/domain/ports/user.repository.port';
import { LogType, ResponseStatus, Source } from '@/shared/enums';
import { IResponse } from '@/shared/interfaces';
import { app } from '@/shared/localizations';
import { logger } from '@/shared/utils/logger';

export interface SeedLeadData {
  fullName: string;
  email: string;
  phone: string;
  source: string;
  productOfInterest: string;
  budget: number;
}

const SEED_LEADS: SeedLeadData[] = [
  {
    fullName: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '+573001234567',
    source: Source.OTHER,
    productOfInterest: 'Plan Premium',
    budget: 150000,
  },
  {
    fullName: 'María García',
    email: 'maria.garcia@example.com',
    phone: '+573002345678',
    source: Source.FACEBOOK,
    productOfInterest: 'Plan Básico',
    budget: 80000,
  },
  {
    fullName: 'Carlos López',
    email: 'carlos.lopez@example.com',
    phone: '+573003456789',
    source: Source.INSTAGRAM,
    productOfInterest: 'Plan Empresarial',
    budget: 250000,
  },
  {
    fullName: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    phone: '+573004567890',
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Premium',
    budget: 180000,
  },
  {
    fullName: 'Pedro Sánchez',
    email: 'pedro.sanchez@example.com',
    phone: '+573005678901',
    source: Source.REFERRAL,
    productOfInterest: 'Plan Profesional',
    budget: 200000,
  },
  {
    fullName: 'Laura Rodríguez',
    email: 'laura.rodriguez@example.com',
    phone: '+573006789012',
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Básico',
    budget: 75000,
  },
  {
    fullName: 'Miguel Torres',
    email: 'miguel.torres@example.com',
    phone: '+573007890123',
    source: Source.FACEBOOK,
    productOfInterest: 'Plan Empresarial',
    budget: 300000,
  },
  {
    fullName: 'Sofia Díaz',
    email: 'sofia.diaz@example.com',
    phone: '+573008901234',
    source: Source.INSTAGRAM,
    productOfInterest: 'Plan Premium',
    budget: 160000,
  },
  {
    fullName: 'Jorge Hernández',
    email: 'jorge.hernandez@example.com',
    phone: '+573009012345',
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Profesional',
    budget: 220000,
  },
  {
    fullName: 'Isabel Flores',
    email: 'isabel.flores@example.com',
    phone: '+573010123456',
    source: Source.REFERRAL,
    productOfInterest: 'Plan Básico',
    budget: 90000,
  },
  {
    fullName: 'Diego Ramírez',
    email: 'diego.ramirez@example.com',
    phone: '+573011234567',
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Empresarial',
    budget: 280000,
  },
  {
    fullName: 'Carmen Castillo',
    email: 'carmen.castillo@example.com',
    phone: '+573012345678',
    source: Source.FACEBOOK,
    productOfInterest: 'Plan Premium',
    budget: 175000,
  },
  {
    fullName: 'Fernando Ruiz',
    email: 'fernando.ruiz@example.com',
    phone: '+573013456789',
    source: Source.INSTAGRAM,
    productOfInterest: 'Plan Profesional',
    budget: 210000,
  },
  {
    fullName: 'Patricia González',
    email: 'patricia.gonzalez@example.com',
    phone: '+573014567890',
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Básico',
    budget: 85000,
  },
  {
    fullName: 'Alejandro Morales',
    email: 'alejandro.morales@example.com',
    phone: '+573015678901',
    source: Source.REFERRAL,
    productOfInterest: 'Plan Empresarial',
    budget: 320000,
  },
  {
    fullName: 'Claudia Suárez',
    email: 'claudia.suarez@example.com',
    phone: '+573016789012',
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Premium',
    budget: 190000,
  },
  {
    fullName: 'Roberto Vega',
    email: 'roberto.vega@example.com',
    phone: '+573017890123',
    source: Source.FACEBOOK,
    productOfInterest: 'Plan Profesional',
    budget: 230000,
  },
  {
    fullName: 'Elena Jiménez',
    email: 'elena.jimenez@example.com',
    phone: '+573018901234',
    source: Source.INSTAGRAM,
    productOfInterest: 'Plan Básico',
    budget: 95000,
  },
  {
    fullName: 'Gabriel Ortega',
    email: 'gabriel.ortega@example.com',
    phone: '+573019012345',
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Empresarial',
    budget: 290000,
  },
  {
    fullName: 'Lucía Mendoza',
    email: 'lucia.mendoza@example.com',
    phone: '+573020123456',
    source: Source.REFERRAL,
    productOfInterest: 'Plan Premium',
    budget: 185000,
  },
  {
    fullName: 'Andrés Cruz',
    email: 'andres.cruz@example.com',
    phone: '+573021234567',
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Profesional',
    budget: 240000,
  },
  {
    fullName: 'Verónica Rubio',
    email: 'veronica.rubio@example.com',
    phone: '+573022345678',
    source: Source.FACEBOOK,
    productOfInterest: 'Plan Básico',
    budget: 82000,
  },
  {
    fullName: 'Sergio Núñez',
    email: 'sergio.nunez@example.com',
    phone: '+573023456789',
    source: Source.INSTAGRAM,
    productOfInterest: 'Plan Empresarial',
    budget: 310000,
  },
  {
    fullName: 'Natalia Herrera',
    email: 'natalia.herrera@example.com',
    phone: '+573024567890',
    source: Source.LANDING_PAGE,
    productOfInterest: 'Plan Premium',
    budget: 195000,
  },
  {
    fullName: 'Alberto Castillo',
    email: 'alberto.castillo@example.com',
    phone: '+573025678901',
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