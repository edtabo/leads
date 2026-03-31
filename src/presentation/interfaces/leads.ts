export interface IFindStatsResponse {
  totalLeads: number;
  leadsBySource: Array<{ source: string; count: number; }>;
  averageBudget: number | null;
  leadsLast7Days: Array<{
    fullName: string;
    email: string;
    phone: string | null;
    source: string;
    productOfInterest: string | null;
    budget: number | null;
    createdAt: string;
  }>;
}