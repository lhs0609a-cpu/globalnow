export type BadgeDefinition = {
  id: string;
  name: string;
  nameKo: string;
  icon: string;
  description: string;
  descriptionKo: string;
  requirement: number; // streak days
};

export const STREAK_BADGES: BadgeDefinition[] = [
  { id: 'newcomer', name: 'Newcomer', nameKo: '뉴비', icon: '🌱', description: 'First day reading', descriptionKo: '첫 번째 방문', requirement: 1 },
  { id: 'curious', name: 'Curious Mind', nameKo: '호기심쟁이', icon: '🔍', description: '3-day streak', descriptionKo: '3일 연속 방문', requirement: 3 },
  { id: 'regular', name: 'Regular Reader', nameKo: '정기 독자', icon: '📰', description: '7-day streak', descriptionKo: '7일 연속 방문', requirement: 7 },
  { id: 'dedicated', name: 'Dedicated', nameKo: '열혈 독자', icon: '🔥', description: '14-day streak', descriptionKo: '14일 연속 방문', requirement: 14 },
  { id: 'veteran', name: 'News Veteran', nameKo: '뉴스 베테랑', icon: '⭐', description: '30-day streak', descriptionKo: '30일 연속 방문', requirement: 30 },
  { id: 'master', name: 'News Master', nameKo: '뉴스 마스터', icon: '👑', description: '60-day streak', descriptionKo: '60일 연속 방문', requirement: 60 },
  { id: 'legend', name: 'News Legend', nameKo: '뉴스 레전드', icon: '🏆', description: '100-day streak', descriptionKo: '100일 연속 방문', requirement: 100 },
  { id: 'immortal', name: 'Immortal Reader', nameKo: '불멸의 독자', icon: '💎', description: '365-day streak', descriptionKo: '365일 연속 방문', requirement: 365 },
];
