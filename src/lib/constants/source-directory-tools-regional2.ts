import { DirectorySite } from '@/types/directory';

/**
 * 나라 안에서만 통하는 도구들 — 유럽·중동·아프리카·미주.
 *
 * 아시아권은 source-directory-tools-regional.ts 에 있다.
 *
 * 이 묶음에서 눈에 띄는 규칙이 둘 있다.
 * - 유럽은 나라마다 「국영철도 예매」와 「중고거래」가 따로 선다. 대륙 전체를
 *   덮는 서비스가 없어서, 그 나라 사이트를 모르면 표를 살 수 없다.
 * - 남아시아·아프리카·중남미는 결제와 신분증명이 앱으로 먼저 왔다. 은행 계좌
 *   보급률보다 전자지갑 보급률이 높은 나라가 많아, 그 나라 경제를 이해하려면
 *   해당 서비스를 봐야 한다.
 *
 * rank 는 유럽 60번대, 남반구·미주 80번대에서 시작한다. 카테고리 안에서
 * 전세계 공통 도구 → 아시아 → 유럽 → 그 외 순으로 놓기 위한 것이다.
 */
export const TOOLS_REGIONAL_SITES_2: DirectorySite[] = [
  // ══════════════════════════ 독일어권 ══════════════════════════
  { id: 't-r-bahn', name: 'Deutsche Bahn', nameKo: '도이체반', url: 'https://www.bahn.de', country: 'DE', group: 't-travel', rank: 60, free: true, note: '독일 철도 예매, 유럽 횡단 노선 검색도 된다' },
  { id: 't-r-kleinanzeigen', name: 'Kleinanzeigen', nameKo: '클라인안차이겐', url: 'https://www.kleinanzeigen.de', country: 'DE', group: 't-shop', rank: 60, free: true, note: '독일 최대 중고·생활 거래' },
  { id: 't-r-traderepublic', name: 'Trade Republic', nameKo: '트레이드 리퍼블릭', url: 'https://traderepublic.com', country: 'DE', group: 't-money', rank: 60, free: true, note: '독일 대표 모바일 증권' },
  { id: 't-r-stepstone', name: 'StepStone', nameKo: '스텝스톤', url: 'https://www.stepstone.de', country: 'DE', group: 't-career', rank: 60, free: true, note: '독일 최대 채용 사이트' },
  { id: 't-r-destatis', name: 'Destatis', nameKo: '독일 연방통계청', url: 'https://www.destatis.de', country: 'DE', group: 't-stat', rank: 60, free: true },
  { id: 't-r-netdoktor', name: 'NetDoktor', nameKo: '넷독토어', url: 'https://www.netdoktor.de', country: 'DE', group: 't-health', rank: 60, free: true, note: '독일어권 대표 건강 정보' },
  { id: 't-r-vhs', name: 'Volkshochschule', nameKo: '폴크스호흐슐레', url: 'https://www.volkshochschule.de', country: 'DE', group: 't-learn', rank: 60, free: true, note: '독일 전역 성인 평생교육 강좌' },
  { id: 't-r-oebb', name: 'ÖBB', nameKo: '외베베', url: 'https://www.oebb.at', country: 'AT', group: 't-travel', rank: 61, free: true, note: '오스트리아 철도, 야간열차가 강하다' },
  { id: 't-r-willhaben', name: 'willhaben', nameKo: '빌하벤', url: 'https://www.willhaben.at', country: 'AT', group: 't-shop', rank: 61, free: true, note: '오스트리아 최대 중고·부동산 장터' },
  { id: 't-r-karriereat', name: 'karriere.at', nameKo: '카리에레', url: 'https://www.karriere.at', country: 'AT', group: 't-career', rank: 61, free: true },
  { id: 't-r-sbb', name: 'SBB', nameKo: '스위스 연방철도', url: 'https://www.sbb.ch', country: 'CH', group: 't-travel', rank: 62, free: true, note: '스위스 전역 환승 안내의 기준' },
  { id: 't-r-ricardo', name: 'Ricardo', nameKo: '리카르도', url: 'https://www.ricardo.ch', country: 'CH', group: 't-shop', rank: 62, free: true, note: '스위스 최대 경매·중고' },
  { id: 't-r-comparis', name: 'Comparis', nameKo: '콤파리스', url: 'https://www.comparis.ch', country: 'CH', group: 't-money', rank: 62, free: true, note: '스위스 보험·통신 요금 비교' },
  { id: 't-r-jobsch', name: 'jobs.ch', nameKo: '잡스 스위스', url: 'https://www.jobs.ch', country: 'CH', group: 't-career', rank: 62, free: true },

  // ══════════════════════════ 프랑스 ══════════════════════════
  { id: 't-r-sncf', name: 'SNCF Connect', nameKo: 'SNCF 커넥트', url: 'https://www.sncf-connect.com', country: 'FR', group: 't-travel', rank: 63, free: true, note: '프랑스 기차표는 여기서 산다' },
  { id: 't-r-blablacar', name: 'BlaBlaCar', nameKo: '블라블라카', url: 'https://www.blablacar.fr', country: 'FR', group: 't-travel', rank: 64, free: true, note: '유럽 장거리 카풀의 사실상 표준' },
  { id: 't-r-leboncoin', name: 'leboncoin', nameKo: '르봉코엥', url: 'https://www.leboncoin.fr', country: 'FR', group: 't-shop', rank: 63, free: true, note: '프랑스 중고거래 1위' },
  { id: 't-r-boursorama', name: 'Boursorama', nameKo: '부르소라마', url: 'https://www.boursorama.com', country: 'FR', group: 't-money', rank: 63, free: true, note: '프랑스 증시 정보와 온라인 은행' },
  { id: 't-r-francetravail', name: 'France Travail', nameKo: '프랑스 트라바유', url: 'https://www.francetravail.fr', country: 'FR', group: 't-career', rank: 63, free: true, note: '프랑스 국립 고용청' },
  { id: 't-r-insee', name: 'INSEE', nameKo: '프랑스 국립통계청', url: 'https://www.insee.fr', country: 'FR', group: 't-stat', rank: 62, free: true },
  { id: 't-r-doctolib', name: 'Doctolib', nameKo: '독톨립', url: 'https://www.doctolib.fr', country: 'FR', group: 't-health', rank: 61, free: true, note: '프랑스·독일 병원 예약의 표준' },
  { id: 't-r-servicepublic', name: 'Service-Public.fr', nameKo: '서비스 퓌블릭', url: 'https://www.service-public.fr', country: 'FR', group: 't-gov', rank: 60, free: true, note: '프랑스 행정 절차 통합 안내' },
  { id: 't-r-openclassrooms', name: 'OpenClassrooms', nameKo: '오픈클래스룸', url: 'https://openclassrooms.com', country: 'FR', group: 't-learn', rank: 62, free: true, note: '프랑스 대표 직업 교육' },
  { id: 't-r-developpez', name: 'Developpez.com', nameKo: '데블로페', url: 'https://www.developpez.com', country: 'FR', group: 't-dev', rank: 60, free: true, note: '프랑스어권 개발자 커뮤니티' },
  { id: 't-r-qwant', name: 'Qwant', nameKo: '콴트', url: 'https://www.qwant.com', country: 'FR', group: 't-search', rank: 60, free: true, note: '프랑스산 프라이버시 검색엔진' },

  // ══════════════════════════ 남유럽 ══════════════════════════
  { id: 't-r-freepik', name: 'Freepik', nameKo: '프리픽', url: 'https://www.freepik.com', country: 'ES', group: 't-asset', rank: 60, free: true, note: '벡터·템플릿 수가 압도적, 출처 표기 조건' },
  { id: 't-r-renfe', name: 'Renfe', nameKo: '렌페', url: 'https://www.renfe.com', country: 'ES', group: 't-travel', rank: 65, free: true, note: '스페인 철도 예매' },
  { id: 't-r-wallapop', name: 'Wallapop', nameKo: '왈라팝', url: 'https://es.wallapop.com', country: 'ES', group: 't-shop', rank: 64, free: true, note: '스페인 중고거래 1위' },
  { id: 't-r-infojobs', name: 'InfoJobs', nameKo: '인포잡스', url: 'https://www.infojobs.net', country: 'ES', group: 't-career', rank: 64, free: true },
  { id: 't-r-ine', name: 'INE', nameKo: '스페인 국가통계청', url: 'https://www.ine.es', country: 'ES', group: 't-stat', rank: 63, free: true },
  { id: 't-r-forocoches', name: 'Forocoches', nameKo: '포로코체스', url: 'https://www.forocoches.com', country: 'ES', group: 't-forum', rank: 60, free: true, note: '이름은 자동차 포럼이지만 스페인 최대 종합 게시판' },
  { id: 't-r-trenitalia', name: 'Trenitalia', nameKo: '트렌이탈리아', url: 'https://www.trenitalia.com', country: 'IT', group: 't-travel', rank: 66, free: true, note: '이탈리아 철도 예매' },
  { id: 't-r-subito', name: 'Subito.it', nameKo: '수비토', url: 'https://www.subito.it', country: 'IT', group: 't-shop', rank: 65, free: true, note: '이탈리아 중고거래 1위' },
  { id: 't-r-jobrapido', name: 'Jobrapido', nameKo: '잡라피도', url: 'https://www.jobrapido.com', country: 'IT', group: 't-career', rank: 65, free: true },
  { id: 't-r-istat', name: 'ISTAT', nameKo: '이탈리아 국가통계청', url: 'https://www.istat.it', country: 'IT', group: 't-stat', rank: 64, free: true },
  { id: 't-r-issalute', name: 'ISSalute', nameKo: '이살루테', url: 'https://www.issalute.it', country: 'IT', group: 't-health', rank: 63, free: true, note: '이탈리아 보건원 공식 건강정보' },

  // ══════════════════════════ 베네룩스·북유럽 ══════════════════════════
  { id: 't-r-tweakers', name: 'Tweakers', nameKo: '트위커스', url: 'https://tweakers.net', country: 'NL', group: 't-dev', rank: 61, free: true, note: '네덜란드 IT 커뮤니티 겸 가격비교' },
  { id: 't-r-ns', name: 'NS', nameKo: '네덜란드 철도', url: 'https://www.ns.nl', country: 'NL', group: 't-travel', rank: 67, free: true },
  { id: 't-r-marktplaats', name: 'Marktplaats', nameKo: '마르크트플라츠', url: 'https://www.marktplaats.nl', country: 'NL', group: 't-shop', rank: 66, free: true, note: '네덜란드 중고거래 1위' },
  { id: 't-r-cbs', name: 'CBS', nameKo: '네덜란드 통계청', url: 'https://www.cbs.nl', country: 'NL', group: 't-stat', rank: 65, free: true },
  { id: 't-r-thuisarts', name: 'Thuisarts.nl', nameKo: '타위스아르츠', url: 'https://www.thuisarts.nl', country: 'NL', group: 't-health', rank: 64, free: true, note: '가정의학과 의사들이 직접 쓴 설명, 군더더기가 없다' },
  { id: 't-r-sj', name: 'SJ', nameKo: '스웨덴 철도', url: 'https://www.sj.se', country: 'SE', group: 't-travel', rank: 68, free: true },
  { id: 't-r-blocket', name: 'Blocket', nameKo: '블로켓', url: 'https://www.blocket.se', country: 'SE', group: 't-shop', rank: 67, free: true, note: '스웨덴 중고거래 1위' },
  { id: 't-r-avanza', name: 'Avanza', nameKo: '아반자', url: 'https://www.avanza.se', country: 'SE', group: 't-money', rank: 64, free: true, note: '스웨덴 최대 온라인 증권' },
  { id: 't-r-scb', name: 'SCB', nameKo: '스웨덴 통계청', url: 'https://www.scb.se', country: 'SE', group: 't-stat', rank: 66, free: true },
  { id: 't-r-1177', name: '1177 Vårdguiden', nameKo: '1177 바르드가이덴', url: 'https://www.1177.se', country: 'SE', group: 't-health', rank: 65, free: true, note: '스웨덴 공공 의료 상담·예약' },
  { id: 't-r-vy', name: 'Vy', nameKo: '노르웨이 철도', url: 'https://www.vy.no', country: 'NO', group: 't-travel', rank: 69, free: true },
  { id: 't-r-finn', name: 'FINN.no', nameKo: '핀', url: 'https://www.finn.no', country: 'NO', group: 't-shop', rank: 68, free: true, note: '노르웨이는 중고·부동산·구인이 한 사이트에 모여 있다' },
  { id: 't-r-nordnet', name: 'Nordnet', nameKo: '노드넷', url: 'https://www.nordnet.no', country: 'NO', group: 't-money', rank: 65, free: true, note: '북유럽 최대 온라인 증권' },
  { id: 't-r-helsenorge', name: 'Helsenorge', nameKo: '헬세노르게', url: 'https://www.helsenorge.no', country: 'NO', group: 't-health', rank: 66, free: true },
  { id: 't-r-dsb', name: 'DSB', nameKo: '덴마크 철도', url: 'https://www.dsb.dk', country: 'DK', group: 't-travel', rank: 70, free: true },
  { id: 't-r-dba', name: 'DBA', nameKo: 'DBA', url: 'https://www.dba.dk', country: 'DK', group: 't-shop', rank: 69, free: true, note: '덴마크 중고거래' },
  { id: 't-r-sundhed', name: 'Sundhed.dk', nameKo: '순헤드', url: 'https://www.sundhed.dk', country: 'DK', group: 't-health', rank: 67, free: true, note: '개인 의무기록·처방을 국민이 직접 연다' },
  { id: 't-r-vrfi', name: 'VR', nameKo: '핀란드 철도', url: 'https://www.vr.fi', country: 'FI', group: 't-travel', rank: 71, free: true },
  { id: 't-r-tori', name: 'Tori.fi', nameKo: '토리', url: 'https://www.tori.fi', country: 'FI', group: 't-shop', rank: 70, free: true, note: '핀란드 중고거래 1위' },
  { id: 't-r-suomifi', name: 'Suomi.fi', nameKo: '수오미', url: 'https://www.suomi.fi', country: 'FI', group: 't-gov', rank: 62, free: true, note: '핀란드 전자정부 통합 창구' },
  { id: 't-r-digid', name: 'DigiD', nameKo: '디지드', url: 'https://www.digid.nl', country: 'NL', group: 't-gov', rank: 61, free: true, note: '네덜란드 공공서비스 전자 신원' },

  // ══════════════════════════ 폴란드·러시아 ══════════════════════════
  { id: 't-r-allegro', name: 'Allegro', nameKo: '알레그로', url: 'https://allegro.pl', country: 'PL', group: 't-shop', rank: 71, free: true, note: '폴란드 최대 온라인 몰' },
  { id: 't-r-olxpl', name: 'OLX Polska', nameKo: 'OLX 폴란드', url: 'https://www.olx.pl', country: 'PL', group: 't-shop', rank: 72, free: true },
  { id: 't-r-koleo', name: 'Koleo', nameKo: '콜레오', url: 'https://koleo.pl', country: 'PL', group: 't-travel', rank: 72, free: true, note: '폴란드 철도 통합 예매' },
  { id: 't-r-pracuj', name: 'Pracuj.pl', nameKo: '프라추이', url: 'https://www.pracuj.pl', country: 'PL', group: 't-career', rank: 66, free: true },
  { id: 't-r-guspl', name: 'Statistics Poland', nameKo: '폴란드 통계청', url: 'https://stat.gov.pl', country: 'PL', group: 't-stat', rank: 67, free: true },
  { id: 't-r-4programmers', name: '4programmers.net', nameKo: '4프로그래머스', url: 'https://4programmers.net', country: 'PL', group: 't-dev', rank: 62, free: true, note: '폴란드 개발자 포럼' },
  { id: 't-r-habr', name: 'Habr', nameKo: '하브르', url: 'https://habr.com', country: 'RU', group: 't-dev', rank: 63, free: true, note: '러시아어권 최대 기술 커뮤니티, 번역해 읽을 값어치가 있다' },
  { id: 't-r-stepik', name: 'Stepik', nameKo: '스텝픽', url: 'https://stepik.org', country: 'RU', group: 't-learn', rank: 63, free: true, note: '러시아어권 대표 온라인 강좌' },
  { id: 't-r-yandexmaps', name: 'Yandex Maps', nameKo: '얀덱스 지도', url: 'https://yandex.com/maps', country: 'RU', group: 't-map', rank: 60, free: true, note: '러시아·구소련권은 구글 지도보다 정확하다' },
  { id: 't-r-avito', name: 'Avito', nameKo: '아비토', url: 'https://www.avito.ru', country: 'RU', group: 't-shop', rank: 73, free: true, note: '러시아 최대 중고·생활 거래' },
  { id: 't-r-wildberries', name: 'Wildberries', nameKo: '와일드베리스', url: 'https://www.wildberries.ru', country: 'RU', group: 't-shop', rank: 74, free: true, note: '러시아 최대 온라인 몰' },
  { id: 't-r-moex', name: 'Moscow Exchange', nameKo: '모스크바 거래소', url: 'https://www.moex.com', country: 'RU', group: 't-money', rank: 66, free: true },
  { id: 't-r-hhru', name: 'hh.ru', nameKo: '헤드헌터', url: 'https://hh.ru', country: 'RU', group: 't-career', rank: 67, free: true, note: '러시아 최대 채용 사이트' },
  { id: 't-r-gosuslugi', name: 'Gosuslugi', nameKo: '고스우슬루기', url: 'https://www.gosuslugi.ru', country: 'RU', group: 't-gov', rank: 63, free: true, note: '러시아 전자정부 포털' },

  // ══════════════════════════ 인도·남아시아 ══════════════════════════
  { id: 't-r-gfg', name: 'GeeksforGeeks', nameKo: '긱스포긱스', url: 'https://www.geeksforgeeks.org', country: 'IN', group: 't-dev', rank: 80, free: true, note: '알고리즘·면접 문제 설명이 방대하다' },
  { id: 't-r-byjus', name: 'BYJU’S', nameKo: '바이주스', url: 'https://byjus.com', country: 'IN', group: 't-learn', rank: 80, free: true, note: '인도 최대 에듀테크' },
  { id: 't-r-unacademy', name: 'Unacademy', nameKo: '언아카데미', url: 'https://unacademy.com', country: 'IN', group: 't-learn', rank: 81, free: true, note: '공무원·경쟁시험 대비의 중심' },
  { id: 't-r-irctc', name: 'IRCTC', nameKo: '인도철도 예매', url: 'https://www.irctc.co.in', country: 'IN', group: 't-travel', rank: 80, free: true, note: '인도 기차표는 여기서만 산다' },
  { id: 't-r-makemytrip', name: 'MakeMyTrip', nameKo: '메이크마이트립', url: 'https://www.makemytrip.com', country: 'IN', group: 't-travel', rank: 81, free: true },
  { id: 't-r-flipkart', name: 'Flipkart', nameKo: '플립카트', url: 'https://www.flipkart.com', country: 'IN', group: 't-shop', rank: 80, free: true, note: '인도 최대 온라인 몰' },
  { id: 't-r-phonepe', name: 'PhonePe', nameKo: '폰페', url: 'https://www.phonepe.com', country: 'IN', group: 't-money', rank: 80, free: true, note: '인도 UPI 결제 1위, 국가 결제망 위에 얹혀 있다' },
  { id: 't-r-paytm', name: 'Paytm', nameKo: '페이티엠', url: 'https://paytm.com', country: 'IN', group: 't-money', rank: 81, free: true },
  { id: 't-r-naukri', name: 'Naukri.com', nameKo: '나우크리', url: 'https://www.naukri.com', country: 'IN', group: 't-career', rank: 80, free: true, note: '인도 최대 채용 포털' },
  { id: 't-r-digilocker', name: 'DigiLocker', nameKo: '디지로커', url: 'https://www.digilocker.gov.in', country: 'IN', group: 't-gov', rank: 80, free: true, note: '정부 발급 서류를 국가가 보관해 주는 지갑' },
  { id: 't-r-practo', name: 'Practo', nameKo: '프락토', url: 'https://www.practo.com', country: 'IN', group: 't-health', rank: 80, free: true, note: '인도 최대 진료 예약' },
  { id: 't-r-teambhp', name: 'Team-BHP', nameKo: '팀BHP', url: 'https://www.team-bhp.com', country: 'IN', group: 't-forum', rank: 80, free: true, note: '인도 자동차 커뮤니티, 리뷰 깊이가 상당하다' },
  { id: 't-r-darazpk', name: 'Daraz', nameKo: '다라즈', url: 'https://www.daraz.pk', country: 'PK', group: 't-shop', rank: 81, free: true, note: '파키스탄 최대 온라인 몰' },
  { id: 't-r-jazzcash', name: 'JazzCash', nameKo: '재즈캐시', url: 'https://www.jazzcash.com.pk', country: 'PK', group: 't-money', rank: 82, free: true, note: '파키스탄 최대 모바일 지갑' },
  { id: 't-r-pathao', name: 'Pathao', nameKo: '파타오', url: 'https://pathao.com', country: 'BD', group: 't-travel', rank: 82, free: true, note: '방글라데시 이동·배달 슈퍼앱' },
  { id: 't-r-bkash', name: 'bKash', nameKo: '비카시', url: 'https://www.bkash.com', country: 'BD', group: 't-money', rank: 83, free: true, note: '은행 계좌 없이 돈을 주고받는 나라의 표준' },
  { id: 't-r-bdjobs', name: 'bdjobs.com', nameKo: '비디잡스', url: 'https://www.bdjobs.com', country: 'BD', group: 't-career', rank: 81, free: true },
  { id: 't-r-pickme', name: 'PickMe', nameKo: '픽미', url: 'https://pickme.lk', country: 'LK', group: 't-travel', rank: 83, free: true, note: '스리랑카 차량 호출 1위' },
  { id: 't-r-esewa', name: 'eSewa', nameKo: '이세와', url: 'https://esewa.com.np', country: 'NP', group: 't-money', rank: 84, free: true, note: '네팔 최초이자 최대 전자지갑' },

  // ══════════════════════════ 동남아시아 ══════════════════════════
  { id: 't-r-grab', name: 'Grab', nameKo: '그랩', url: 'https://www.grab.com', country: 'SG', group: 't-travel', rank: 84, free: true, note: '동남아 이동·배달·결제를 한 앱으로' },
  { id: 't-r-skillsfuture', name: 'SkillsFuture', nameKo: '스킬스퓨처', url: 'https://www.skillsfuture.gov.sg', country: 'SG', group: 't-learn', rank: 82, free: true, note: '싱가포르가 전 국민에게 교육비를 주는 제도' },
  { id: 't-r-mycareersfuture', name: 'MyCareersFuture', nameKo: '마이커리어퓨처', url: 'https://www.mycareersfuture.gov.sg', country: 'SG', group: 't-career', rank: 82, free: true, note: '싱가포르 정부 운영 채용 포털' },
  { id: 't-r-healthhub', name: 'HealthHub', nameKo: '헬스허브', url: 'https://www.healthhub.sg', country: 'SG', group: 't-health', rank: 81, free: true },
  { id: 't-r-shopeevn', name: 'Shopee Vietnam', nameKo: '쇼피 베트남', url: 'https://shopee.vn', country: 'VN', group: 't-shop', rank: 82, free: true, note: '베트남 이커머스 1위' },
  { id: 't-r-momovn', name: 'MoMo', nameKo: '모모', url: 'https://www.momo.vn', country: 'VN', group: 't-money', rank: 85, free: true, note: '베트남 국민 전자지갑' },
  { id: 't-r-vietnamworks', name: 'VietnamWorks', nameKo: '베트남웍스', url: 'https://www.vietnamworks.com', country: 'VN', group: 't-career', rank: 83, free: true },
  { id: 't-r-shopeeth', name: 'Shopee Thailand', nameKo: '쇼피 태국', url: 'https://shopee.co.th', country: 'TH', group: 't-shop', rank: 83, free: true },
  { id: 't-r-jobthai', name: 'JobThai', nameKo: '잡타이', url: 'https://www.jobthai.com', country: 'TH', group: 't-career', rank: 84, free: true },
  { id: 't-r-tokopedia', name: 'Tokopedia', nameKo: '토코피디아', url: 'https://www.tokopedia.com', country: 'ID', group: 't-shop', rank: 84, free: true, note: '인도네시아 최대 온라인 몰' },
  { id: 't-r-gojek', name: 'Gojek', nameKo: '고젝', url: 'https://www.gojek.com', country: 'ID', group: 't-travel', rank: 85, free: true, note: '오토바이 호출에서 시작한 인니 슈퍼앱' },
  { id: 't-r-halodoc', name: 'Halodoc', nameKo: '할로닥', url: 'https://www.halodoc.com', country: 'ID', group: 't-health', rank: 82, free: true, note: '인니 비대면 진료 1위' },
  { id: 't-r-shopeemy', name: 'Shopee Malaysia', nameKo: '쇼피 말레이시아', url: 'https://shopee.com.my', country: 'MY', group: 't-shop', rank: 85, free: true },
  { id: 't-r-tng', name: 'Touch ’n Go eWallet', nameKo: '터치앤고 이월렛', url: 'https://www.touchngo.com.my', country: 'MY', group: 't-money', rank: 86, free: true, note: '말레이시아 교통카드가 전자지갑이 됐다' },
  { id: 't-r-jobstreet', name: 'JobStreet', nameKo: '잡스트리트', url: 'https://my.jobstreet.com', country: 'MY', group: 't-career', rank: 85, free: true },
  { id: 't-r-shopeeph', name: 'Shopee Philippines', nameKo: '쇼피 필리핀', url: 'https://shopee.ph', country: 'PH', group: 't-shop', rank: 86, free: true },
  { id: 't-r-gcash', name: 'GCash', nameKo: '지캐시', url: 'https://www.gcash.com', country: 'PH', group: 't-money', rank: 87, free: true, note: '필리핀 국민 금융앱' },
  { id: 't-r-kalibrr', name: 'Kalibrr', nameKo: '칼리브르', url: 'https://www.kalibrr.com', country: 'PH', group: 't-career', rank: 86, free: true },

  // ══════════════════════════ 중동 ══════════════════════════
  { id: 't-r-careem', name: 'Careem', nameKo: '카림', url: 'https://www.careem.com', country: 'AE', group: 't-travel', rank: 86, free: true, note: '걸프 지역 차량 호출 슈퍼앱' },
  { id: 't-r-noon', name: 'noon', nameKo: '눈', url: 'https://www.noon.com', country: 'AE', group: 't-shop', rank: 87, free: true, note: '걸프권 최대 온라인 몰' },
  { id: 't-r-bayt', name: 'Bayt.com', nameKo: '베이트', url: 'https://www.bayt.com', country: 'AE', group: 't-career', rank: 87, free: true, note: '중동 최대 채용 사이트' },
  { id: 't-r-jarir', name: 'Jarir Bookstore', nameKo: '자리르 서점', url: 'https://www.jarir.com', country: 'SA', group: 't-shop', rank: 88, free: true, note: '사우디 서점 겸 전자제품 유통 1위' },
  { id: 't-r-absher', name: 'Absher', nameKo: '압셰르', url: 'https://www.absher.sa', country: 'SA', group: 't-gov', rank: 81, free: true, note: '사우디 생활 행정이 전부 이 앱을 거친다' },
  { id: 't-r-moovit', name: 'Moovit', nameKo: '무빗', url: 'https://moovit.com', country: 'IL', group: 't-map', rank: 80, free: true, note: '3,000여 개 도시 대중교통 길찾기' },
  { id: 't-r-alljobs', name: 'AllJobs', nameKo: '올잡스', url: 'https://www.alljobs.co.il', country: 'IL', group: 't-career', rank: 88, free: true },
  { id: 't-r-trendyol', name: 'Trendyol', nameKo: '트렌드욜', url: 'https://www.trendyol.com', country: 'TR', group: 't-shop', rank: 89, free: true, note: '튀르키예 최대 온라인 몰' },
  { id: 't-r-edevlet', name: 'e-Devlet', nameKo: '이데블레트', url: 'https://www.turkiye.gov.tr', country: 'TR', group: 't-gov', rank: 82, free: true, note: '튀르키예 전자정부 통합 포털' },
  { id: 't-r-papara', name: 'Papara', nameKo: '파파라', url: 'https://www.papara.com', country: 'TR', group: 't-money', rank: 88, free: true },

  // ══════════════════════════ 아프리카 ══════════════════════════
  { id: 't-r-mpesa', name: 'M-Pesa', nameKo: '엠페사', url: 'https://www.safaricom.co.ke/m-pesa', country: 'KE', group: 't-money', rank: 89, free: true, note: '휴대폰 문자로 돈을 보내는 모바일 금융의 원형' },
  { id: 't-r-jumiake', name: 'Jumia Kenya', nameKo: '주미아 케냐', url: 'https://www.jumia.co.ke', country: 'KE', group: 't-shop', rank: 90, free: true },
  { id: 't-r-brightermonday', name: 'BrighterMonday', nameKo: '브라이터먼데이', url: 'https://www.brightermonday.co.ke', country: 'KE', group: 't-career', rank: 89, free: true },
  { id: 't-r-ecitizen', name: 'eCitizen', nameKo: '이시티즌', url: 'https://www.ecitizen.go.ke', country: 'KE', group: 't-gov', rank: 83, free: true, note: '케냐 정부 민원 통합 창구' },
  { id: 't-r-paystack', name: 'Paystack', nameKo: '페이스택', url: 'https://paystack.com', country: 'NG', group: 't-dev', rank: 81, free: true, note: '아프리카 결제 API의 사실상 표준' },
  { id: 't-r-jumiang', name: 'Jumia Nigeria', nameKo: '주미아 나이지리아', url: 'https://www.jumia.com.ng', country: 'NG', group: 't-shop', rank: 91, free: true },
  { id: 't-r-piggyvest', name: 'PiggyVest', nameKo: '피기베스트', url: 'https://www.piggyvest.com', country: 'NG', group: 't-money', rank: 90, free: true, note: '나이지리아 저축·투자 앱' },
  { id: 't-r-nairaland', name: 'Nairaland', nameKo: '나이라랜드', url: 'https://www.nairaland.com', country: 'NG', group: 't-forum', rank: 81, free: true, note: '나이지리아 최대 온라인 커뮤니티' },
  { id: 't-r-takealot', name: 'Takealot', nameKo: '테이크얼랏', url: 'https://www.takealot.com', country: 'ZA', group: 't-shop', rank: 92, free: true, note: '남아공 최대 온라인 몰' },
  { id: 't-r-easyequities', name: 'EasyEquities', nameKo: '이지이퀴티즈', url: 'https://www.easyequities.co.za', country: 'ZA', group: 't-money', rank: 91, free: true, note: '주식을 소수점 단위로 사는 남아공 플랫폼' },
  { id: 't-r-pnet', name: 'Pnet', nameKo: '피넷', url: 'https://www.pnet.co.za', country: 'ZA', group: 't-career', rank: 90, free: true },
  { id: 't-r-offerzen', name: 'OfferZen', nameKo: '오퍼젠', url: 'https://www.offerzen.com', country: 'ZA', group: 't-career', rank: 91, free: true, note: '기업이 개발자에게 먼저 제안하는 역방향 채용' },
  { id: 't-r-wuzzuf', name: 'Wuzzuf', nameKo: '우주프', url: 'https://wuzzuf.net', country: 'EG', group: 't-career', rank: 92, free: true, note: '이집트 최대 채용 플랫폼' },
  { id: 't-r-vezeeta', name: 'Vezeeta', nameKo: '베제타', url: 'https://www.vezeeta.com', country: 'EG', group: 't-health', rank: 83, free: true, note: '중동·북아프리카 진료 예약' },
  { id: 't-r-fawry', name: 'Fawry', nameKo: '파우리', url: 'https://www.fawry.com', country: 'EG', group: 't-money', rank: 92, free: true, note: '이집트 공과금·전자결제망' },

  // ══════════════════════════ 중남미 ══════════════════════════
  { id: 't-r-mercadolivre', name: 'Mercado Livre', nameKo: '메르카도 리브레', url: 'https://www.mercadolivre.com.br', country: 'BR', group: 't-shop', rank: 93, free: true, note: '중남미 최대 이커머스' },
  { id: 't-r-nubank', name: 'Nubank', nameKo: '누뱅크', url: 'https://nubank.com.br', country: 'BR', group: 't-money', rank: 93, free: true, note: '중남미 최대 디지털 은행' },
  { id: 't-r-catho', name: 'Catho', nameKo: '카토', url: 'https://www.catho.com.br', country: 'BR', group: 't-career', rank: 93, free: true },
  { id: 't-r-mercadolibremx', name: 'Mercado Libre México', nameKo: '메르카도 리브레 멕시코', url: 'https://www.mercadolibre.com.mx', country: 'MX', group: 't-shop', rank: 94, free: true },
  { id: 't-r-occ', name: 'OCCMundial', nameKo: 'OCC 문디알', url: 'https://www.occ.com.mx', country: 'MX', group: 't-career', rank: 94, free: true },
  { id: 't-r-mercadopago', name: 'Mercado Pago', nameKo: '메르카도 파고', url: 'https://www.mercadopago.com.ar', country: 'AR', group: 't-money', rank: 94, free: true, note: '아르헨티나 결제·투자 앱' },
  { id: 't-r-bumeran', name: 'Bumeran', nameKo: '부메란', url: 'https://www.bumeran.com.ar', country: 'AR', group: 't-career', rank: 95, free: true },
  { id: 't-r-platzi', name: 'Platzi', nameKo: '플라치', url: 'https://platzi.com', country: 'CO', group: 't-learn', rank: 83, free: true, note: '스페인어권 최대 IT 교육' },
  { id: 't-r-nequi', name: 'Nequi', nameKo: '네키', url: 'https://www.nequi.com.co', country: 'CO', group: 't-money', rank: 95, free: true },
  { id: 't-r-elempleo', name: 'elempleo', nameKo: '엘엠플레오', url: 'https://www.elempleo.com', country: 'CO', group: 't-career', rank: 96, free: true },
  { id: 't-r-fintual', name: 'Fintual', nameKo: '핀투알', url: 'https://fintual.cl', country: 'CL', group: 't-money', rank: 96, free: true, note: '칠레 대표 온라인 자산운용' },
  { id: 't-r-chileatiende', name: 'ChileAtiende', nameKo: '칠레아티엔데', url: 'https://www.chileatiende.gob.cl', country: 'CL', group: 't-gov', rank: 84, free: true, note: '칠레 정부 민원 통합 안내' },
];
