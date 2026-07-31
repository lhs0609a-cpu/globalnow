import { EventCategory, EventVenue } from '@/types/event';

export const EVENT_CATEGORIES: { id: EventCategory; label: string; icon: string }[] = [
  { id: 'conference', label: '컨퍼런스', icon: '🎤' },
  { id: 'exhibition', label: '전시회', icon: '🏛️' },
  { id: 'meetup', label: '사업가 모임', icon: '🤝' },
  { id: 'demoday', label: '데모데이', icon: '🚀' },
  { id: 'networking', label: '네트워킹', icon: '🍷' },
];

export const EVENT_VENUES: EventVenue[] = [
  { id: 'coex', name: 'COEX', nameKo: '코엑스', location: '서울 강남구' },
  { id: 'kintex', name: 'KINTEX', nameKo: '킨텍스', location: '경기 고양시' },
  { id: 'setec', name: 'SETEC', nameKo: 'SETEC', location: '서울 강남구' },
  { id: 'at-center', name: 'aT Center', nameKo: 'aT센터', location: '서울 서초구' },
  { id: 'ddp', name: 'DDP', nameKo: '동대문디자인플라자', location: '서울 중구' },
  { id: 'pangyo', name: 'Pangyo Startup Campus', nameKo: '판교 스타트업캠퍼스', location: '경기 성남시' },
  { id: 'sejong', name: 'Sejong Center', nameKo: '세종문화회관', location: '서울 종로구' },
  { id: 'nuritkum', name: 'Nuritkum Square', nameKo: '누리꿈스퀘어', location: '서울 마포구' },
];
