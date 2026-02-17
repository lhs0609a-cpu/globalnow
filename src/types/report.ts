export type IndustryId =
  | 'semiconductor'
  | 'ai'
  | 'battery'
  | 'ev'
  | 'fintech'
  | 'bio'
  | 'energy'
  | 'defense'
  | 'cloud';

export type ReportIssue = {
  title: string;
  summary: string;
  impact: 'positive' | 'negative' | 'neutral';
};

export type WeeklyReportContent = {
  headline: string;
  topIssues: ReportIssue[];
  marketImpact: string;
  outlook: string;
  upcomingEvents: string[];
};

export type WeeklyReport = {
  id: string;
  industry: IndustryId;
  weekStart: string; // YYYY-MM-DD (Monday)
  weekEnd: string;   // YYYY-MM-DD (Sunday)
  content: WeeklyReportContent;
  generatedAt: string;
};
