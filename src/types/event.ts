export type EventCategory = 'conference' | 'exhibition' | 'meetup' | 'demoday' | 'networking';

export type EventStatus = 'upcoming' | 'ongoing' | 'ended';

export type KoreaEvent = {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  category: EventCategory;
  venue: string;
  startDate: string;
  endDate: string;
  url: string;
  tags: string[];
  isFree: boolean;
  source: 'curated' | 'festa' | 'eventbrite';
  status?: EventStatus;
};

export type EventVenue = {
  id: string;
  name: string;
  nameKo: string;
  location: string;
};

export type EventFilterParams = {
  category?: EventCategory;
  month?: number;
  venue?: string;
  search?: string;
};
