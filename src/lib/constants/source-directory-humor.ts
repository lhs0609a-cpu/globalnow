import { DirectorySite } from '@/types/directory';

/**
 * 유머·밈·풍자·웹코믹 디렉토리.
 *
 * 순위 근거
 * - meme / humor: Similarweb「Arts & Entertainment > Humor」 글로벌 및 국가별
 *   랭킹(2026년 7월 집계, 2026-08-01 갱신)의 방문자 수 순서를 그대로 따랐다.
 * - satire: Wikipedia「List of satirical news websites」의 국가별 목록을
 *   기준으로 삼고, Feedspot 풍자 매체 랭킹으로 상위권을 정렬했다.
 * - comic: 구독자·연재 기간이 검증된 장수 웹코믹 위주로 편집 기준 정렬.
 *
 * 제외 기준
 * - 성인물·불법 스트리밍·인스타 스토리 조회기처럼 Humor 카테고리에 분류되어
 *   있으나 유머 사이트가 아닌 것(sex-studentki.sale, watchluna.com,
 *   insta-stories-viewer.com 등)은 넣지 않았다.
 * - 특정 개인을 겨냥한 괴롭힘으로 여러 나라에서 차단된 kiwifarms 계열도 제외.
 * - pinimg.com은 Pinterest 이미지 CDN 도메인이라 사이트로 취급하지 않는다.
 */
export const HUMOR_DIRECTORY_SITES: DirectorySite[] = [
  // ══════════════════════ 밈 플랫폼 (글로벌) ══════════════════════
  { id: 'h-9gag', name: '9GAG', nameKo: '나인개그', url: 'https://9gag.com', country: 'HK', group: 'meme', rank: 1, free: true, note: '전세계 밈 유통의 중심, 월 7,800만 방문' },
  { id: 'h-imgur', name: 'Imgur', nameKo: '임구르', url: 'https://imgur.com', country: 'US', group: 'meme', rank: 2, free: true, note: '레딧과 함께 자란 이미지 호스팅 겸 밈 피드' },
  { id: 'h-imgflip', name: 'Imgflip', nameKo: '임그플립', url: 'https://imgflip.com', country: 'US', group: 'meme', rank: 3, free: true, note: '밈 생성기 1위, 템플릿 검색이 강점' },
  { id: 'h-knowyourmeme', name: 'Know Your Meme', nameKo: '노유어밈', url: 'https://knowyourmeme.com', country: 'US', group: 'meme', rank: 4, free: true, note: '밈의 기원과 확산 경로를 문서화하는 백과사전' },
  { id: 'h-ifunny', name: 'iFunny', nameKo: '아이퍼니', url: 'https://ifunny.co', country: 'US', group: 'meme', rank: 5, free: true, note: '모바일 중심 밈 피드' },
  { id: 'h-memedroid', name: 'Memedroid', nameKo: '밈드로이드', url: 'https://www.memedroid.com', country: 'ES', group: 'meme', rank: 6, free: true, note: '스페인발 밈 앱, 다국어 지원' },
  { id: 'h-boredpanda', name: 'Bored Panda', nameKo: '보어드판다', url: 'https://www.boredpanda.com', country: 'LT', group: 'meme', rank: 7, free: true, note: '리투아니아발 바이럴 큐레이션, 유머·아트 혼합' },
  { id: 'h-cheezburger', name: 'Cheezburger', nameKo: '치즈버거', url: 'https://cheezburger.com', country: 'US', group: 'meme', rank: 8, free: true, note: 'I Can Has Cheezburger·FAIL Blog 계열' },
  { id: 'h-thechive', name: 'theCHIVE', nameKo: '더 차이브', url: 'https://thechive.com', country: 'US', group: 'meme', rank: 9, free: true },
  { id: 'h-ebaumsworld', name: 'eBaum’s World', nameKo: '이바움스 월드', url: 'https://www.ebaumsworld.com', country: 'US', group: 'meme', rank: 10, free: true, note: '2001년 시작한 1세대 유머 사이트' },
  { id: 'h-funnyjunk', name: 'FunnyJunk', nameKo: '퍼니정크', url: 'https://funnyjunk.com', country: 'US', group: 'meme', rank: 12, free: true },
  { id: 'h-someecards', name: 'Someecards', nameKo: '썸이카드', url: 'https://www.someecards.com', country: 'US', group: 'meme', rank: 14, free: true, note: '빈정대는 전자 카드에서 출발한 유머 매체' },
  { id: 'h-pleatedjeans', name: 'Pleated-Jeans', nameKo: '플리티드진스', url: 'https://pleated-jeans.com', country: 'US', group: 'meme', rank: 15, free: true },
  { id: 'h-uselessweb', name: 'The Useless Web', nameKo: '유즐리스웹', url: 'https://theuselessweb.com', country: 'US', group: 'meme', rank: 17, free: true, note: '버튼 하나로 쓸모없는 사이트로 순간이동' },

  // ══════════════════════ 국가별 유머 사이트 ══════════════════════
  // ── 러시아·구소련 (Similarweb Humor 글로벌 1위가 러시아 사이트다) ──
  { id: 'h-pikabu', name: 'Pikabu', nameKo: '피카부', url: 'https://pikabu.ru', country: 'RU', group: 'humor', rank: 1, free: true, note: 'Similarweb 유머 카테고리 세계 1위, 러시아판 레딧' },
  { id: 'h-yaplakal', name: 'YaPlakal', nameKo: '야플라칼', url: 'https://www.yaplakal.com', country: 'RU', group: 'humor', rank: 2, free: true, note: '“나는 울었다”라는 뜻의 대형 유머 포럼' },
  { id: 'h-fishki', name: 'Fishki.net', nameKo: '피시키', url: 'https://fishki.net', country: 'RU', group: 'humor', rank: 3, free: true },
  { id: 'h-anekdot', name: 'Anekdot.ru', nameKo: '아넥도트', url: 'https://www.anekdot.ru', country: 'RU', group: 'humor', rank: 4, free: true, note: '1995년 개설된 러시아 유머 아카이브' },
  { id: 'h-joyreactor', name: 'JoyReactor', nameKo: '조이리액터', url: 'https://joyreactor.cc', country: 'RU', group: 'humor', rank: 5, free: true },

  // ── 폴란드 (인구 대비 유머 사이트 트래픽이 가장 높은 나라) ──
  { id: 'h-joemonster', name: 'Joe Monster', nameKo: '조몬스터', url: 'https://joemonster.org', country: 'PL', group: 'humor', rank: 6, free: true, note: '폴란드 유머 사이트 1위' },
  { id: 'h-demotywatory', name: 'Demotywatory', nameKo: '데모티바토리', url: 'https://demotywatory.pl', country: 'PL', group: 'humor', rank: 7, free: true },
  { id: 'h-kwejk', name: 'Kwejk', nameKo: '크베이크', url: 'https://kwejk.pl', country: 'PL', group: 'humor', rank: 8, free: true },
  { id: 'h-mistrzowie', name: 'Mistrzowie', nameKo: '미스트조비에', url: 'https://mistrzowie.org', country: 'PL', group: 'humor', rank: 9, free: true },
  { id: 'h-sadol', name: 'Sadol', nameKo: '사돌', url: 'https://sadol.pl', country: 'PL', group: 'humor', rank: 10, free: true },

  // ── 스페인·중남미 ──
  { id: 'h-finofilipino', name: 'Fino Filipino', nameKo: '피노 필리피노', url: 'https://finofilipino.org', country: 'ES', group: 'humor', rank: 11, free: true, note: '스페인 유머 사이트 1위' },
  { id: 'h-cuantarazon', name: 'Cuánta Razón', nameKo: '쿠안타 라손', url: 'https://www.cuantarazon.com', country: 'ES', group: 'humor', rank: 12, free: true },
  { id: 'h-vistoenlasredes', name: 'Visto en las Redes', nameKo: '비스토 엔 라스 레데스', url: 'https://vistoenlasredes.com', country: 'ES', group: 'humor', rank: 13, free: true },
  { id: 'h-naointendo', name: 'Não Intendo', nameKo: '나웅 인텐도', url: 'https://naointendo.com.br', country: 'BR', group: 'humor', rank: 14, free: true, note: '브라질 유머 사이트 상위권' },

  // ── 서유럽 ──
  { id: 'h-demotivateur', name: 'Démotivateur', nameKo: '데모티바퇴르', url: 'https://www.demotivateur.fr', country: 'FR', group: 'humor', rank: 15, free: true, note: '프랑스 유머 사이트 1위' },
  { id: 'h-webfail', name: 'Webfail', nameKo: '웹페일', url: 'https://webfail.com', country: 'DE', group: 'humor', rank: 16, free: true },
  { id: 'h-dumpert', name: 'Dumpert', nameKo: '뒴퍼르트', url: 'https://www.dumpert.nl', country: 'NL', group: 'humor', rank: 17, free: true, note: '네덜란드 최대 유머 영상 사이트' },

  // ── 일본 ──
  { id: 'h-bokete', name: 'Bokete', nameKo: '보케테', url: 'https://bokete.jp', country: 'JP', group: 'humor', rank: 18, free: true, note: '사진에 개그 자막을 붙이는 일본식 참여형 유머' },
  { id: 'h-renote', name: 'RENOTE', nameKo: '리노트', url: 'https://renote.net', country: 'JP', group: 'humor', rank: 20, free: true },
  { id: 'h-netorabo', name: 'ITmedia ねとらぼ', nameKo: '넷토라보', url: 'https://nlab.itmedia.co.jp', country: 'JP', group: 'humor', rank: 21, free: true, note: '괴짜 뉴스와 인터넷 화제를 다루는 ITmedia 채널' },

  // ── 영미권 커뮤니티 ──
  { id: 'h-reddit-funny', name: 'r/funny', nameKo: '레딧 r/funny', url: 'https://www.reddit.com/r/funny/', country: 'US', group: 'humor', rank: 22, free: true, note: '레딧 최대 유머 서브레딧' },
  { id: 'h-reddit-memes', name: 'r/memes', nameKo: '레딧 r/memes', url: 'https://www.reddit.com/r/memes/', country: 'US', group: 'humor', rank: 23, free: true },
  { id: 'h-reddit-notonion', name: 'r/nottheonion', nameKo: '레딧 r/nottheonion', url: 'https://www.reddit.com/r/nottheonion/', country: 'US', group: 'humor', rank: 24, free: true, note: '풍자인 줄 알았는데 진짜인 뉴스' },
  { id: 'h-reddit-programmerhumor', name: 'r/ProgrammerHumor', nameKo: '레딧 r/ProgrammerHumor', url: 'https://www.reddit.com/r/ProgrammerHumor/', country: 'US', group: 'humor', rank: 25, free: true, note: '수집기가 실제로 긁어오는 소스' },

  // ══════════════════════ GIF·짤 저장소 ══════════════════════
  { id: 'h-tenor', name: 'Tenor', nameKo: '테너', url: 'https://tenor.com', country: 'US', group: 'gif', rank: 1, free: true, note: '구글 인수, 안드로이드 키보드 기본 GIF 소스' },
  { id: 'h-giphy', name: 'GIPHY', nameKo: '기피', url: 'https://giphy.com', country: 'US', group: 'gif', rank: 2, free: true, note: '쇼피파이 소유, 최대 GIF 라이브러리' },
  { id: 'h-gifer', name: 'Gifer', nameKo: '기퍼', url: 'https://gifer.com', country: 'US', group: 'gif', rank: 3, free: true },
  { id: 'h-reddit-gifs', name: 'r/gifs', nameKo: '레딧 r/gifs', url: 'https://www.reddit.com/r/gifs/', country: 'US', group: 'gif', rank: 4, free: true },
  { id: 'h-reddit-highqualitygifs', name: 'r/HighQualityGifs', nameKo: '레딧 r/HighQualityGifs', url: 'https://www.reddit.com/r/HighQualityGifs/', country: 'US', group: 'gif', rank: 5, free: true },
  { id: 'h-ezgif', name: 'EZGIF', nameKo: '이지기프', url: 'https://ezgif.com', country: 'US', group: 'gif', rank: 6, free: true, note: '브라우저에서 바로 쓰는 GIF 편집 도구' },

  // ══════════════════════ 풍자 뉴스 ══════════════════════
  // ── 미국 ──
  { id: 'h-theonion', name: 'The Onion', nameKo: '디 어니언', url: 'https://theonion.com', country: 'US', group: 'satire', rank: 1, free: true, note: '풍자 뉴스의 원형, 1988년 창간' },
  { id: 'h-cracked', name: 'Cracked', nameKo: '크랙트', url: 'https://www.cracked.com', country: 'US', group: 'satire', rank: 2, free: true, note: '1958년 인쇄 잡지로 시작해 2005년 웹으로 전환' },
  { id: 'h-babylonbee', name: 'The Babylon Bee', nameKo: '바빌론 비', url: 'https://babylonbee.com', country: 'US', group: 'satire', rank: 3, free: true, lean: 'conservative', note: '기독교·보수 성향 풍자' },
  { id: 'h-clickhole', name: 'ClickHole', nameKo: '클릭홀', url: 'https://clickhole.com', country: 'US', group: 'satire', rank: 4, free: true, note: '바이럴 미디어 문법 자체를 조롱' },
  { id: 'h-reductress', name: 'Reductress', nameKo: '리덕트리스', url: 'https://reductress.com', country: 'US', group: 'satire', rank: 5, free: true, note: '여성지 화법을 비트는 풍자' },
  { id: 'h-hardtimes', name: 'The Hard Times', nameKo: '하드 타임스', url: 'https://thehardtimes.net', country: 'US', group: 'satire', rank: 6, free: true, note: '펑크·하드코어 씬 풍자' },
  { id: 'h-duffelblog', name: 'Duffel Blog', nameKo: '더플 블로그', url: 'https://www.duffelblog.com', country: 'US', group: 'satire', rank: 7, free: true, note: '미군 내부 사정을 아는 사람만 웃는 군대 풍자' },
  { id: 'h-harddrive', name: 'Hard Drive', nameKo: '하드 드라이브', url: 'https://hard-drive.net', country: 'US', group: 'satire', rank: 8, free: true, note: '게임업계 풍자' },
  { id: 'h-humortimes', name: 'Humor Times', nameKo: '유머 타임스', url: 'https://www.humortimes.com', country: 'US', group: 'satire', rank: 9, free: true, note: '정치 만평 모음을 겸한다' },
  { id: 'h-newyorker-humor', name: 'The New Yorker: Humor', nameKo: '뉴요커 유머', url: 'https://www.newyorker.com/humor', country: 'US', group: 'satire', rank: 10, note: '“Shouts & Murmurs”와 만평' },
  { id: 'h-borowitz', name: 'Borowitz Report', nameKo: '보로위츠 리포트', url: 'https://borowitzreport.com', country: 'US', group: 'satire', rank: 11, free: true, note: '뉴요커 연재를 거쳐 독립' },
  { id: 'h-weeklyworldnews', name: 'Weekly World News', nameKo: '위클리 월드 뉴스', url: 'https://weeklyworldnews.com', country: 'US', group: 'satire', rank: 12, free: true, note: '“배트 보이”로 유명한 타블로이드 패러디' },
  { id: 'h-satirewire', name: 'SatireWire', nameKo: '새타이어와이어', url: 'https://satirewire.com', country: 'US', group: 'satire', rank: 13, free: true },
  { id: 'h-apnews-oddities', name: 'AP News: Oddities', nameKo: 'AP 기묘한 뉴스', url: 'https://apnews.com/hub/oddities', country: 'US', group: 'satire', rank: 14, free: true, note: '풍자가 아니라 진짜인데 더 이상한 실화' },
  { id: 'h-upi-odd', name: 'UPI: Odd News', nameKo: 'UPI 오드 뉴스', url: 'https://www.upi.com/Odd_News/', country: 'US', group: 'satire', rank: 15, free: true },

  // ── 영국·아일랜드 ──
  { id: 'h-dailymash', name: 'The Daily Mash', nameKo: '데일리 매시', url: 'https://www.thedailymash.co.uk', country: 'UK', group: 'satire', rank: 16, free: true, note: '영국판 어니언' },
  { id: 'h-privateeye', name: 'Private Eye', nameKo: '프라이빗 아이', url: 'https://www.private-eye.co.uk', country: 'UK', group: 'satire', rank: 17, note: '1961년 창간, 풍자와 탐사보도를 겸한다' },
  { id: 'h-newsthump', name: 'NewsThump', nameKo: '뉴스덤프', url: 'https://newsthump.com', country: 'UK', group: 'satire', rank: 18, free: true },
  { id: 'h-newsbiscuit', name: 'NewsBiscuit', nameKo: '뉴스비스킷', url: 'https://www.newsbiscuit.com', country: 'UK', group: 'satire', rank: 19, free: true },
  { id: 'h-dailysquib', name: 'Daily Squib', nameKo: '데일리 스퀴브', url: 'https://www.dailysquib.co.uk', country: 'UK', group: 'satire', rank: 20, free: true },
  { id: 'h-thepoke', name: 'The Poke', nameKo: '더 포크', url: 'https://www.thepoke.com', country: 'UK', group: 'satire', rank: 21, free: true },
  { id: 'h-rochdaleherald', name: 'The Rochdale Herald', nameKo: '로치데일 헤럴드', url: 'https://rochdaleherald.co.uk', country: 'UK', group: 'satire', rank: 22, free: true },
  { id: 'h-waterfordwhispers', name: 'Waterford Whispers News', nameKo: '워터퍼드 위스퍼스', url: 'https://waterfordwhispersnews.com', country: 'IE', group: 'satire', rank: 23, free: true, note: '아일랜드 대표 풍자 매체' },

  // ── 오세아니아·캐나다 ──
  { id: 'h-betoota', name: 'The Betoota Advocate', nameKo: '베투타 애드보킷', url: 'https://www.betootaadvocate.com', country: 'AU', group: 'satire', rank: 24, free: true, note: '가상의 시골 마을 신문 설정' },
  { id: 'h-chaser', name: 'The Chaser', nameKo: '더 체이서', url: 'https://chaser.com.au', country: 'AU', group: 'satire', rank: 25, free: true },
  { id: 'h-theshovel', name: 'The Shovel', nameKo: '더 셔블', url: 'https://theshovel.com.au', country: 'AU', group: 'satire', rank: 26, free: true },
  { id: 'h-beaverton', name: 'The Beaverton', nameKo: '더 비버턴', url: 'https://www.thebeaverton.com', country: 'CA', group: 'satire', rank: 28, free: true, note: '캐나다 대표 풍자 매체' },
  { id: 'h-walkingeagle', name: 'Walking Eagle News', nameKo: '워킹 이글 뉴스', url: 'https://walkingeaglenews.com', country: 'CA', group: 'satire', rank: 29, free: true, note: '캐나다 원주민 시각의 풍자' },

  // ── 유럽 비영어권 ──
  { id: 'h-postillon', name: 'Der Postillon', nameKo: '데어 포스틸론', url: 'https://www.der-postillon.com', country: 'DE', group: 'satire', rank: 30, free: true, note: '독일판 어니언, 2008년 시작' },
  { id: 'h-legorafi', name: 'Le Gorafi', nameKo: '르 고라피', url: 'https://www.legorafi.fr', country: 'FR', group: 'satire', rank: 31, free: true, note: 'Le Figaro의 철자를 뒤섞은 이름' },
  { id: 'h-elmundotoday', name: 'El Mundo Today', nameKo: '엘 문도 투데이', url: 'https://www.elmundotoday.com', country: 'ES', group: 'satire', rank: 32, free: true },
  { id: 'h-lercio', name: 'Lercio', nameKo: '레르초', url: 'https://www.lercio.it', country: 'IT', group: 'satire', rank: 33, free: true },
  { id: 'h-tagespresse', name: 'Die Tagespresse', nameKo: '디 타게스프레세', url: 'https://dietagespresse.com', country: 'AT', group: 'satire', rank: 34, free: true },
  { id: 'h-despeld', name: 'De Speld', nameKo: '데 스펠트', url: 'https://speld.nl', country: 'NL', group: 'satire', rank: 35, free: true },
  { id: 'h-nieuwspaal', name: 'De Nieuwspaal', nameKo: '데 니우스팔', url: 'https://www.nieuwspaal.nl', country: 'NL', group: 'satire', rank: 36, free: true },
  { id: 'h-nordpresse', name: 'Nordpresse', nameKo: '노르드프레스', url: 'https://nordpresse.be', country: 'BE', group: 'satire', rank: 37, free: true },
  { id: 'h-aszdziennik', name: 'ASZdziennik', nameKo: 'ASZ지엔니크', url: 'https://aszdziennik.pl', country: 'PL', group: 'satire', rank: 38, free: true },
  { id: 'h-timesnewroman', name: 'Times New Roman', nameKo: '타임스 뉴 로만', url: 'https://www.timesnewroman.ro', country: 'RO', group: 'satire', rank: 39, free: true, note: '루마니아 풍자 매체' },
  { id: 'h-njuz', name: 'Njuz.net', nameKo: '뉴즈넷', url: 'https://www.njuz.net', country: 'RS', group: 'satire', rank: 40, free: true, note: '세르비아 풍자 매체' },
  { id: 'h-panorama-pub', name: 'Panorama', nameKo: '파노라마', url: 'https://panorama.pub', country: 'RU', group: 'satire', rank: 41, free: true, note: '러시아 풍자 매체, 종종 진짜 뉴스로 오인된다' },

  // ── 아시아·중동·아프리카·중남미 ──
  { id: 'h-zaytung', name: 'Zaytung', nameKo: '자이퉁', url: 'https://www.zaytung.com', country: 'TR', group: 'satire', rank: 42, free: true, note: '튀르키예 대표 풍자 매체' },
  { id: 'h-alhudood', name: 'Al-Hudood', nameKo: '알후두드', url: 'https://alhudood.net', country: 'JO', group: 'satire', rank: 43, free: true, note: '아랍권 풍자 매체, 요르단 기반' },
  { id: 'h-thefauxy', name: 'The Fauxy', nameKo: '더 폭시', url: 'https://www.thefauxy.com', country: 'IN', group: 'satire', rank: 44, free: true },
  { id: 'h-kyokoshimbun', name: 'Kyoko Shimbun', nameKo: '허구신문', url: 'https://kyoko-np.net', country: 'JP', group: 'satire', rank: 46, free: true, note: '“虚構新聞”, 일본 풍자 신문' },
  { id: 'h-chiguirebipolar', name: 'El Chigüire Bipolar', nameKo: '엘 치기레 비폴라르', url: 'https://www.elchiguirebipolar.net', country: 'VE', group: 'satire', rank: 48, free: true, note: '베네수엘라 정권을 겨냥한 풍자' },

  // ══════════════════════ 웹코믹·카툰 ══════════════════════
  { id: 'h-xkcd', name: 'xkcd', nameKo: 'xkcd', url: 'https://xkcd.com', country: 'US', group: 'comic', rank: 1, free: true, note: '수집기가 실제로 긁어오는 소스, JSON API 공개' },
  { id: 'h-explosm', name: 'Cyanide & Happiness', nameKo: '시안화물과 행복', url: 'https://explosm.net', country: 'US', group: 'comic', rank: 2, free: true },
  { id: 'h-smbc', name: 'SMBC', nameKo: 'SMBC', url: 'https://www.smbc-comics.com', country: 'US', group: 'comic', rank: 3, free: true, note: 'Saturday Morning Breakfast Cereal, 과학·철학 개그' },
  { id: 'h-theoatmeal', name: 'The Oatmeal', nameKo: '디 오트밀', url: 'https://theoatmeal.com', country: 'US', group: 'comic', rank: 4, free: true },
  { id: 'h-gocomics', name: 'GoComics', nameKo: '고코믹스', url: 'https://www.gocomics.com', country: 'US', group: 'comic', rank: 5, free: true, note: '가필드·피너츠 등 신문 연재만화 아카이브' },
  { id: 'h-pennyarcade', name: 'Penny Arcade', nameKo: '페니 아케이드', url: 'https://www.penny-arcade.com', country: 'US', group: 'comic', rank: 6, free: true, note: '게임 문화 웹코믹의 원조' },
  { id: 'h-webtoons', name: 'WEBTOON', nameKo: '웹툰(영문)', url: 'https://www.webtoons.com', country: 'KR', group: 'comic', rank: 7, free: true, note: '네이버웹툰의 글로벌 서비스' },
  { id: 'h-tapas', name: 'Tapas', nameKo: '타파스', url: 'https://tapas.io', country: 'US', group: 'comic', rank: 8, free: true },
  { id: 'h-poorlydrawnlines', name: 'Poorly Drawn Lines', nameKo: '푸얼리 드론 라인스', url: 'https://poorlydrawnlines.com', country: 'US', group: 'comic', rank: 9, free: true },
  { id: 'h-falseknees', name: 'False Knees', nameKo: '폴스 니스', url: 'https://falseknees.com', country: 'CA', group: 'comic', rank: 10, free: true, note: '새들이 험한 말을 한다' },
  { id: 'h-safelyendangered', name: 'Safely Endangered', nameKo: '세이플리 인데인저드', url: 'https://safelyendangered.com', country: 'UK', group: 'comic', rank: 11, free: true },
  { id: 'h-warandpeas', name: 'War and Peas', nameKo: '워앤피스', url: 'https://warandpeas.com', country: 'DE', group: 'comic', rank: 12, free: true },
  { id: 'h-mrlovenstein', name: 'Mr. Lovenstein', nameKo: '미스터 러븐스타인', url: 'https://www.mrlovenstein.com', country: 'US', group: 'comic', rank: 13, free: true },
  { id: 'h-pbfcomics', name: 'The Perry Bible Fellowship', nameKo: '페리 바이블 펠로십', url: 'https://pbfcomics.com', country: 'US', group: 'comic', rank: 14, free: true },
  { id: 'h-commitstrip', name: 'CommitStrip', nameKo: '커밋스트립', url: 'https://www.commitstrip.com/en/', country: 'FR', group: 'comic', rank: 15, free: true, note: '수집기가 실제로 긁어오는 소스, 개발자 개그' },
  { id: 'h-monkeyuser', name: 'MonkeyUser', nameKo: '몽키유저', url: 'https://www.monkeyuser.com', country: 'RO', group: 'comic', rank: 16, free: true, note: '개발자 웹코믹' },
  { id: 'h-wumo', name: 'WuMo', nameKo: '부모', url: 'https://wumo.com', country: 'DK', group: 'comic', rank: 17, free: true, note: '덴마크발, 전세계 신문에 연재' },

  // ══════════════════════ 국내 유머·짤 ══════════════════════
  { id: 'h-kr-ruliweb-humor', name: 'Ruliweb Humor', nameKo: '루리웹 유머게시판', url: 'https://bbs.ruliweb.com/community/board/300143', country: 'KR', group: 'kr-humor', rank: 2, free: true, note: '국내 커뮤니티 방문 수 3위 루리웹의 유머 게시판' },
  { id: 'h-kr-fmkorea-humor', name: 'FMKorea Humor', nameKo: '에펨코리아 유머·움짤', url: 'https://www.fmkorea.com/humor', country: 'KR', group: 'kr-humor', rank: 3, free: true, note: 'Similarweb 뉴스 카테고리 세계 27위, 국내 밈의 진원지' },
  { id: 'h-kr-dcbest', name: 'DCinside Hit Gallery', nameKo: '디시인사이드 힛갤', url: 'https://gall.dcinside.com/board/lists?id=hit', country: 'KR', group: 'kr-humor', rank: 4, free: true, note: '국내 밈이 가장 먼저 만들어지는 곳' },
  { id: 'h-kr-instiz-pt', name: 'Instiz Pann Talk', nameKo: '인스티즈 이슈', url: 'https://www.instiz.net/pt', country: 'KR', group: 'kr-humor', rank: 5, free: true },
  { id: 'h-kr-humoruniv-best', name: 'Humoruniv Best', nameKo: '웃긴대학 베스트', url: 'https://web.humoruniv.com/board/humor/list.html?table=pds', country: 'KR', group: 'kr-humor', rank: 6, free: true, note: '1999년 개설, 국내 유머 사이트의 원형' },
  { id: 'h-kr-dogdrip-best', name: 'Dogdrip Best', nameKo: '개드립 베스트', url: 'https://www.dogdrip.net/index.php?mid=dogdrip&sort_index=popular', country: 'KR', group: 'kr-humor', rank: 7, free: true },
  { id: 'h-kr-todayhumor-best', name: 'Todayhumor Best', nameKo: '오늘의유머 베스트', url: 'https://www.todayhumor.co.kr/board/list.php?table=humorbest', country: 'KR', group: 'kr-humor', rank: 8, free: true },
  { id: 'h-kr-bobaedream-best', name: 'Bobaedream Best', nameKo: '보배드림 베스트', url: 'https://www.bobaedream.co.kr/list?code=best', country: 'KR', group: 'kr-humor', rank: 9, free: true },
  { id: 'h-kr-etoland-best', name: 'Etoland Best', nameKo: '이토랜드 베스트', url: 'https://www.etoland.co.kr/bbs/board.php?bo_table=etohumor05', country: 'KR', group: 'kr-humor', rank: 10, free: true },
  { id: 'h-kr-ppomppu-humor', name: 'Ppomppu Humor', nameKo: '뽐뿌 유머', url: 'https://www.ppomppu.co.kr/zboard/zboard.php?id=humor', country: 'KR', group: 'kr-humor', rank: 11, free: true },
  { id: 'h-kr-ygosu-humor', name: 'Ygosu Humor', nameKo: '와이고수 유머', url: 'https://www.ygosu.com/board/yeobo', country: 'KR', group: 'kr-humor', rank: 12, free: true },
  { id: 'h-kr-inven-humor', name: 'Inven Humor', nameKo: '인벤 유머', url: 'https://www.inven.co.kr/board/webzine/2097', country: 'KR', group: 'kr-humor', rank: 13, free: true },
  { id: 'h-kr-theqoo-hot', name: 'Theqoo Hot', nameKo: '더쿠 핫게', url: 'https://theqoo.net/hot', country: 'KR', group: 'kr-humor', rank: 14, free: true },
  { id: 'h-kr-natepann-talk', name: 'Nate Pann Talk', nameKo: '네이트판 톡톡', url: 'https://pann.nate.com/talk', country: 'KR', group: 'kr-humor', rank: 15, free: true },

  // ══════════════════════ 국내 웹툰 ══════════════════════
  { id: 'h-kr-naverwebtoon', name: 'Naver Webtoon', nameKo: '네이버웹툰', url: 'https://comic.naver.com/webtoon', country: 'KR', group: 'kr-webtoon', rank: 1, free: true, note: '국내 웹툰 시장 점유율 1위' },
  { id: 'h-kr-kakaowebtoon', name: 'Kakao Webtoon', nameKo: '카카오웹툰', url: 'https://webtoon.kakao.com', country: 'KR', group: 'kr-webtoon', rank: 2, free: true },
  { id: 'h-kr-kakaopage', name: 'KakaoPage', nameKo: '카카오페이지', url: 'https://page.kakao.com', country: 'KR', group: 'kr-webtoon', rank: 3, free: true },
  { id: 'h-kr-lezhin', name: 'Lezhin Comics', nameKo: '레진코믹스', url: 'https://www.lezhin.com/ko', country: 'KR', group: 'kr-webtoon', rank: 4 },
  { id: 'h-kr-bomtoon', name: 'Bomtoon', nameKo: '봄툰', url: 'https://www.bomtoon.com', country: 'KR', group: 'kr-webtoon', rank: 5 },
  { id: 'h-kr-toptoon', name: 'Toptoon', nameKo: '탑툰', url: 'https://toptoon.com', country: 'KR', group: 'kr-webtoon', rank: 6 },
  { id: 'h-kr-ridi', name: 'RIDI Webtoon', nameKo: '리디 웹툰', url: 'https://ridibooks.com/webtoon', country: 'KR', group: 'kr-webtoon', rank: 7 },
];
