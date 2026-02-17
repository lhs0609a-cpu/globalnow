import { IndustryId } from '@/types/report';

export type IndustryDef = {
  id: IndustryId;
  name: string;
  nameKo: string;
  icon: string;
  keywords: string[];
};

export const INDUSTRIES: IndustryDef[] = [
  {
    id: 'semiconductor',
    name: 'Semiconductor',
    nameKo: '반도체',
    icon: '🔬',
    keywords: ['semiconductor', 'chip', 'wafer', 'TSMC', 'Samsung Electronics', 'SK hynix', 'ASML', 'NVIDIA', 'Intel', 'foundry', 'HBM', 'DRAM', 'NAND', '반도체', '파운드리'],
  },
  {
    id: 'ai',
    name: 'AI',
    nameKo: 'AI/인공지능',
    icon: '🤖',
    keywords: ['artificial intelligence', 'AI', 'GPT', 'LLM', 'machine learning', 'deep learning', 'OpenAI', 'Anthropic', 'Google DeepMind', 'transformer', '인공지능', '생성형'],
  },
  {
    id: 'battery',
    name: 'Battery',
    nameKo: '2차전지',
    icon: '🔋',
    keywords: ['battery', 'lithium', 'cathode', 'anode', 'solid-state', 'LG Energy', 'CATL', 'Samsung SDI', 'SK On', 'BYD', '2차전지', '배터리', '양극재', '음극재'],
  },
  {
    id: 'ev',
    name: 'EV',
    nameKo: '전기차',
    icon: '🚗',
    keywords: ['electric vehicle', 'EV', 'Tesla', 'BYD', 'Rivian', 'Lucid', 'Hyundai', 'autonomous driving', 'self-driving', 'charging', '전기차', '자율주행'],
  },
  {
    id: 'fintech',
    name: 'Fintech',
    nameKo: '핀테크',
    icon: '💳',
    keywords: ['fintech', 'digital payment', 'blockchain', 'DeFi', 'neobank', 'Stripe', 'Square', 'PayPal', 'crypto', 'CBDC', '핀테크', '디지털결제'],
  },
  {
    id: 'bio',
    name: 'Bio/Pharma',
    nameKo: '바이오/제약',
    icon: '🧬',
    keywords: ['biotech', 'pharma', 'drug', 'FDA', 'clinical trial', 'gene therapy', 'mRNA', 'Pfizer', 'Moderna', 'Samsung Biologics', '바이오', '제약', '임상'],
  },
  {
    id: 'energy',
    name: 'Energy',
    nameKo: '에너지',
    icon: '⚡',
    keywords: ['energy', 'solar', 'wind', 'nuclear', 'hydrogen', 'oil', 'natural gas', 'renewable', 'carbon', 'ESG', '에너지', '신재생', '원전', '수소'],
  },
  {
    id: 'defense',
    name: 'Defense',
    nameKo: '방산',
    icon: '🛡️',
    keywords: ['defense', 'military', 'missile', 'fighter jet', 'Lockheed Martin', 'Raytheon', 'BAE Systems', 'Hanwha Aerospace', 'Korea Aerospace', '방산', '국방', '무기'],
  },
  {
    id: 'cloud',
    name: 'Cloud',
    nameKo: '클라우드/SaaS',
    icon: '☁️',
    keywords: ['cloud', 'AWS', 'Azure', 'Google Cloud', 'SaaS', 'data center', 'serverless', 'Kubernetes', 'Snowflake', 'Salesforce', '클라우드', '데이터센터'],
  },
];

export function getIndustry(id: IndustryId): IndustryDef | undefined {
  return INDUSTRIES.find(i => i.id === id);
}
