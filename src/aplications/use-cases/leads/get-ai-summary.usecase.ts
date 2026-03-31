import { Inject, Injectable } from '@nestjs/common';

import { UserRepositoryPort } from '@/domain/ports/user.repository.port';
import { ILeadFilters } from '@/presentation/interfaces/leads';
import { LogType, ResponseStatus } from '@/shared/enums';
import { IResponse } from '@/shared/interfaces';
import { app } from '@/shared/localizations';
import { logger } from '@/shared/utils/logger';

@Injectable()
export class GetAISummaryUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private repository: UserRepositoryPort,
  ) { }

  async execute(filters: ILeadFilters): Promise<IResponse<string>> {
    try {
      const leads = await this.repository.findByFilters(filters);

      if (!leads || leads.length === 0) {
        return {
          status: ResponseStatus.SUCCESS,
          data: app.aiSummary.noLeads,
        };
      }

      const periodText = filters.startDate && filters.endDate
        ? `desde ${filters.startDate} hasta ${filters.endDate}`
        : 'últimos 7 días';

      const totalLeads = leads.length;
      const sources: Record<string, number> = {};
      const products: Record<string, number> = {};
      let totalBudget = 0;
      let budgetCount = 0;

      for (const lead of leads) {
        if (lead.source) {
          sources[lead.source] = (sources[lead.source] || 0) + 1;
        }
        if (lead.productOfInterest) {
          products[lead.productOfInterest] = (products[lead.productOfInterest] || 0) + 1;
        }
        if (lead.budget) {
          totalBudget += lead.budget;
          budgetCount++;
        }
      }

      const mainSource = Object.entries(sources).sort((a, b) => b[1] - a[1])[0];
      const mainProduct = Object.entries(products).sort((a, b) => b[1] - a[1])[0];
      const avgBudget = budgetCount > 0 ? (totalBudget / budgetCount).toFixed(2) : '0';

      const summary = await this.generateSummaryWithDeepSeek({
        periodText,
        totalLeads,
        sources,
        mainSource: mainSource ? mainSource[0] : 'N/A',
        mainSourceCount: mainSource ? mainSource[1] : 0,
        products,
        mainProduct: mainProduct ? mainProduct[0] : 'N/A',
        mainProductCount: mainProduct ? mainProduct[1] : 0,
        avgBudget,
      });

      return {
        status: ResponseStatus.SUCCESS,
        data: summary,
      };
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return { status: ResponseStatus.ERROR, message: app.errors.tryAgain };
    }
  }

  private async generateSummaryWithDeepSeek(data: {
    periodText: string;
    totalLeads: number;
    sources: Record<string, number>;
    mainSource: string;
    mainSourceCount: number;
    products: Record<string, number>;
    mainProduct: string;
    mainProductCount: number;
    avgBudget: string;
  }): Promise<string> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

    if (!apiKey) {
      return this.generateFallbackSummary(data);
    }

    const sourcesList = Object.entries(data.sources)
      .map(([source, count]) => `- ${source}: ${count} leads`)
      .join('\n');

    const productsList = Object.entries(data.products)
      .map(([product, count]) => `- ${product}: ${count} leads`)
      .join('\n');

    const prompt = `You are a business analyst with 10 years of experience in the real estate industry.
    Create an executive summary in Spanish about the leads for the period ${data.periodText}.

DATA:
- Total of leads: ${data.totalLeads}
- Sources:
${sourcesList}
- Main source: ${data.mainSource} (${data.mainSourceCount} leads)
- Products of interest:
${productsList}
- Most demanded product: ${data.mainProduct} (${data.mainProductCount} leads)
- Average budget: $${data.avgBudget}

INSTRUCTIONS:
Generate an executive summary in Spanish with the following sections:
1. GENERAL ANALYSIS: A brief description of the lead behavior in the period.
2. MAIN SOURCE: Identify the most important source and its contribution.
3. RECOMMENDATIONS: Give 2-3 strategic suggestions based on the data.
4. BUDGET: The average budget of the leads is $${data.avgBudget}.
5. PRODUCTS: The most demanded product is ${data.mainProduct} with ${data.mainProductCount} interested.

The summary must be concise, in Spanish, and in clear text format. Do not use emojis, use plain text and well structured.`;

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        return this.generateFallbackSummary(data);
      }

      const result = await response.json() as { choices?: Array<{ message?: { content?: string; }; }>; };
      return result.choices?.[0]?.message?.content || this.generateFallbackSummary(data);
    } catch (error) {
      void logger({ error: error as Error, type: LogType.ERROR });
      return this.generateFallbackSummary(data);
    }
  }

  private generateFallbackSummary(data: {
    periodText: string;
    totalLeads: number;
    sources: Record<string, number>;
    mainSource: string;
    mainSourceCount: number;
    products: Record<string, number>;
    mainProduct: string;
    mainProductCount: number;
    avgBudget: string;
  }): string {
    const sourcesList = Object.entries(data.sources)
      .map(([source, count]) => `${source}: ${count} leads`)
      .join(', ');

    const productsList = Object.entries(data.products)
      .map(([product, count]) => `${product}: ${count} leads`)
      .join(', ');

    return `RESUMEN EJECUTIVO - Período: ${data.periodText}

ANÁLISIS GENERAL:
Durante el período ${data.periodText}, se registraron ${data.totalLeads} leads. La distribución por fuentes indica que: ${sourcesList}.

PRINCIPAL FUENTE:
La fuente principal de leads es ${data.mainSource} con ${data.mainSourceCount} leads captados, representando el ${((data.mainSourceCount / data.totalLeads) * 100).toFixed(1)}% del total.

PRODUCTOS DE INTERÉS:
Los productos más solicitados son: ${productsList}.
El producto más popular es ${data.mainProduct} con ${data.mainProductCount} interesados.

PRESUPUESTO:
El presupuesto promedio de los leads es de $${data.avgBudget}.

RECOMENDACIONES:
1. Focalizar recursos de marketing en la fuente ${data.mainSource} para maximizar la captación de leads.
2. Desarrollar estrategias de ventas para el producto ${data.mainProduct} dado su alto interés.
3. Considerar campañas de remarketing dirigidas a leads con presupuesto superior al promedio.`;
  }
}