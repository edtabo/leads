import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { User } from '@/domain/entities/user.entity';
import { UserRepositoryPort } from '@/domain/ports/user.repository.port';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';
import { IFindStatsResponse, ILeadFilters } from '@/presentation/interfaces/leads';
import { LogType, Role } from '@/shared/enums';
import { logger } from '@/shared/utils/logger';

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private prisma: PrismaService) { }

  async findCount(where: Prisma.UserWhereInput): Promise<number | null> {
    try {
      const query = await this.prisma.user.count({
        where,
      });

      return query;
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return null;
    }
  }

  async findAll(props: {
    limit: number;
    page: number;
    where: Prisma.UserWhereInput;
  }): Promise<User[] | null> {
    const { limit, page, where } = props;

    try {
      if (!limit || !page) return null;

      const query = await this.prisma.user.findMany({
        where,
        select: {
          id: true,
          role: true,
          full_name: true,
          email: true,
          phone: true,
          source: true,
          product_of_interest: true,
          budget: true,
          created_at: true,
          updated_at: true,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { created_at: 'desc' },
      });

      return query.map(
        (item) =>
          new User({
            id: item.id.toString(),
            role: item.role,
            fullName: item.full_name,
            email: item.email,
            phone: item.phone,
            source: item.source,
            productOfInterest: item.product_of_interest,
            budget: item.budget,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          }),
      );
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return null;
    }
  }

  async findByWhere(where: Prisma.UserWhereInput): Promise<User | null> {
    try {
      const query = await this.prisma.user.findFirst({
        where,
        select: {
          id: true,
          role: true,
          full_name: true,
          email: true,
          phone: true,
          source: true,
          product_of_interest: true,
          budget: true,
          created_at: true,
          updated_at: true,
        },
      });

      return query
        ? new User({
          id: query.id.toString(),
          role: query.role,
          fullName: query.full_name,
          email: query.email,
          phone: query.phone,
          source: query.source,
          productOfInterest: query.product_of_interest,
          budget: query.budget,
          createdAt: query.created_at,
          updatedAt: query.updated_at,
        })
        : null;
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return null;
    }
  }

  async create(data: User): Promise<boolean | null> {
    try {
      if (!data.email || !data.fullName || !data.source)
        return null;

      const query = await this.prisma.user.create({
        data: {
          role: data.role ?? Role.USER,
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          source: data.source,
          product_of_interest: data.productOfInterest,
          budget: data.budget,
        },
      });

      return query ? true : false;
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return null;
    }
  }

  async createMany(data: User[]): Promise<boolean | null> {
    try {
      if (!data || data.length === 0)
        return null;

      const start = new Date(2026, 0, 1);
      const end = new Date(2026, 11, 31, 23, 59, 59);


      const usersData = data
        .filter((user) => user.fullName && user.email && user.source)
        .map((user) => {
          const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
          const randomDate = new Date(randomTime);
          return ({
            role: user.role ?? Role.USER,
            full_name: user.fullName!,
            email: user.email!,
            phone: user.phone,
            source: user.source!,
            product_of_interest: user.productOfInterest,
            budget: user.budget,
            created_at: randomDate,
          });
        });

      if (usersData.length === 0)
        return null;

      const query = await this.prisma.user.createMany({
        data: usersData,
        skipDuplicates: true,
      });

      return query.count > 0;
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return null;
    }
  }

  async update(data: User): Promise<boolean | null> {
    try {
      if (!data.id || !data.fullName || !data.source)
        return null;


      const query = await this.prisma.user.update({
        where: {
          id: BigInt(data.id),
          deleted: false,
        },
        data: {
          full_name: data.fullName,
          phone: data.phone,
          source: data.source,
          product_of_interest: data.productOfInterest,
          budget: data.budget,
        },
      });
      return query ? true : false;
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return null;
    }
  }

  async delete(id: string | number): Promise<boolean | null> {
    try {
      if (!id)
        return null;

      const query = await this.prisma.user.update({
        where: {
          id: BigInt(id),
          deleted: false,
        },
        data: {
          deleted: true,
        },
      });
      return query ? true : false;
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return null;
    }
  }

  async findStats(): Promise<IFindStatsResponse | null> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const totalLeads = await this.prisma.user.count({
        where: { deleted: false },
      });

      const leadsBySource = await this.prisma.user.groupBy({
        by: ['source'],
        where: { deleted: false },
        _count: { source: true },
      });

      const avgBudget = await this.prisma.user.aggregate({
        where: { deleted: false, budget: { not: null } },
        _avg: { budget: true },
      });

      const leadsLast7Days = await this.prisma.user.findMany({
        where: {
          deleted: false,
          created_at: { gte: sevenDaysAgo },
        },
        select: {
          id: true,
          full_name: true,
          email: true,
          phone: true,
          source: true,
          product_of_interest: true,
          budget: true,
          created_at: true,
        },
      });

      const formattedLeadsLast7Days = leadsLast7Days.map((item) => ({
        fullName: item.full_name,
        email: item.email,
        phone: item.phone,
        source: item.source,
        productOfInterest: item.product_of_interest,
        budget: item.budget,
        createdAt: item.created_at.toISOString().split('T')[0],
      }));

      return {
        totalLeads,
        leadsBySource: leadsBySource.map((item) => ({
          source: item.source,
          count: item._count.source,
        })),
        averageBudget: parseFloat(avgBudget._avg.budget?.toFixed(2) || '0'),
        leadsLast7Days: formattedLeadsLast7Days,
      };
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return null;
    }
  }

  async findByFilters(filters: ILeadFilters): Promise<User[] | null> {
    try {
      const where: Prisma.UserWhereInput = {
        deleted: false,
      };

      if (filters.source)
        where.source = filters.source;

      if (filters.startDate && filters.endDate) {
        where.created_at = {
          gte: new Date(filters.startDate + 'T00:00:00'),
          lte: new Date(filters.endDate + 'T23:59:59'),
        };
      } else if (!filters.source) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        where.created_at = { gte: sevenDaysAgo };
      }

      const query = await this.prisma.user.findMany({
        where,
        select: {
          id: true,
          role: true,
          full_name: true,
          email: true,
          phone: true,
          source: true,
          product_of_interest: true,
          budget: true,
          created_at: true,
          updated_at: true,
        },
        orderBy: { created_at: 'desc' },
      });

      return query.map(
        (item) =>
          new User({
            id: item.id.toString(),
            role: item.role,
            fullName: item.full_name,
            email: item.email,
            phone: item.phone,
            source: item.source,
            productOfInterest: item.product_of_interest,
            budget: item.budget,
            createdAt: item.created_at,
            updatedAt: item.updated_at
          }),
      );
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return null;
    }
  }
}


