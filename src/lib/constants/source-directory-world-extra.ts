import { DirectorySite } from '@/types/directory';

/**
 * 실측 트래픽 기준 보강분.
 *
 * 기존 디렉토리는 각국 기록신문(paper of record) 중심으로 편집자가 골랐기 때문에,
 * 그 나라에서 실제로 가장 많이 읽히는 포털·타블로이드가 여러 곳 빠져 있었다.
 * 이 파일은 Similarweb「News & Media Publishers」 글로벌 랭킹 및 국가별 랭킹
 * (2026년 7월 집계, 2026-08-01 갱신)을 근거로 그 구멍을 메운다.
 *
 * rank는 소수를 쓴다. 기존 항목의 정수 rank 사이에 끼워 넣어야 트래픽 순서가
 * 화면에 그대로 반영되기 때문이다. 정렬은 rank 오름차순이라 0.5는 1 앞에 온다.
 * 각 항목의 note에 근거가 된 순위를 적어 두었다.
 */
export const WORLD_EXTRA_SITES: DirectorySite[] = [
  // ═════════════════════════ 동아시아 ═════════════════════════
  // 일본 — 신문사보다 포털의 트래픽이 압도적이다
  { id: 'x-yahoonewsjp', name: 'Yahoo! News Japan', nameKo: '야후! 재팬 뉴스', url: 'https://news.yahoo.co.jp', country: 'JP', group: 'asia-east', rank: 0.1, free: true, note: '세계 뉴스 사이트 트래픽 3위, 일본인이 뉴스를 보는 기본 창구' },
  { id: 'x-auone', name: 'au One News', nameKo: 'au 원 뉴스', url: 'https://auone.jp', country: 'JP', group: 'asia-east', rank: 0.2, free: true, note: '세계 24위 · 일본 3위, KDDI가 운영하는 포털' },
  { id: 'x-livedoor', name: 'livedoor News', nameKo: '라이브도어 뉴스', url: 'https://news.livedoor.com', country: 'JP', group: 'asia-east', rank: 0.3, free: true, note: '세계 40위 · 일본 4위' },
  { id: 'x-nikkanspa', name: 'Nikkan SPA!', nameKo: '닛칸 스파!', url: 'https://nikkan-spa.jp', country: 'JP', group: 'asia-east', rank: 22.5, free: true, note: '주간지 계열 온라인 매체' },
  // 중국 — 관영지 외에 실제 트래픽을 가진 상업 포털
  { id: 'x-163news', name: 'NetEase News', nameKo: '왕이 뉴스(网易)', url: 'https://news.163.com', country: 'CN', group: 'asia-east', rank: 6.5, free: true, note: '세계 42위, 중국 최대 상업 뉴스 포털 중 하나' },
  { id: 'x-qqnews', name: 'Tencent News', nameKo: '텐센트 뉴스(腾讯)', url: 'https://news.qq.com', country: 'CN', group: 'asia-east', rank: 6.6, free: true, note: '세계 11위 qq.com의 뉴스 채널' },
  { id: 'x-toutiao', name: 'Toutiao', nameKo: '진르터우탸오(今日头条)', url: 'https://www.toutiao.com', country: 'CN', group: 'asia-east', rank: 6.7, free: true, note: '바이트댄스의 알고리즘 뉴스 앱' },
  { id: 'x-sinanews', name: 'Sina News', nameKo: '시나 뉴스(新浪)', url: 'https://news.sina.com.cn', country: 'CN', group: 'asia-east', rank: 6.8, free: true },
  // 대만·홍콩
  { id: 'x-ettoday', name: 'ETtoday', nameKo: 'ETtoday 뉴스윈', url: 'https://www.ettoday.net', country: 'TW', group: 'asia-east', rank: 16.5, free: true, note: '대만 4위' },
  { id: 'x-chinatimes', name: 'China Times', nameKo: '중국시보(中時)', url: 'https://www.chinatimes.com', country: 'TW', group: 'asia-east', rank: 16.6, free: true },
  { id: 'x-hk01', name: 'HK01', nameKo: '홍콩01', url: 'https://www.hk01.com', country: 'HK', group: 'asia-east', rank: 6.5, free: true, note: '홍콩 최대 온라인 뉴스' },

  // ═════════════════════════ 동남아시아 ═════════════════════════
  { id: 'x-asiaone', name: 'AsiaOne', nameKo: '아시아원', url: 'https://www.asiaone.com', country: 'SG', group: 'asia-southeast', rank: 2.5, free: true, note: '싱가포르 4위' },
  { id: 'x-tribunnews', name: 'Tribun News', nameKo: '트리분 뉴스', url: 'https://www.tribunnews.com', country: 'ID', group: 'asia-southeast', rank: 6.1, free: true, note: '인도네시아 4위' },
  { id: 'x-cnnindonesia', name: 'CNN Indonesia', nameKo: 'CNN 인도네시아', url: 'https://www.cnnindonesia.com', country: 'ID', group: 'asia-southeast', rank: 6.2, free: true, note: '인도네시아 5위' },
  { id: 'x-kumparan', name: 'kumparan', nameKo: '쿰파란', url: 'https://kumparan.com', country: 'ID', group: 'asia-southeast', rank: 6.3, free: true },
  { id: 'x-hmetro', name: 'Harian Metro', nameKo: '하리안 메트로', url: 'https://www.hmetro.com.my', country: 'MY', group: 'asia-southeast', rank: 8.1, free: true, note: '말레이시아 4위' },
  { id: 'x-bharian', name: 'Berita Harian', nameKo: '베리타 하리안', url: 'https://www.bharian.com.my', country: 'MY', group: 'asia-southeast', rank: 8.2, free: true, note: '말레이시아 5위' },
  { id: 'x-sanook', name: 'Sanook', nameKo: '사눅', url: 'https://www.sanook.com/news/', country: 'TH', group: 'asia-southeast', rank: 8.5, free: true, note: '태국 1위 포털' },
  { id: 'x-thairath', name: 'Thairath', nameKo: '타이랏', url: 'https://www.thairath.co.th', country: 'TH', group: 'asia-southeast', rank: 8.6, free: true, note: '태국 2위, 최대 발행부수 일간지' },
  { id: 'x-khaosod', name: 'Khaosod', nameKo: '카오솟(태국어)', url: 'https://www.khaosod.co.th', country: 'TH', group: 'asia-southeast', rank: 8.7, free: true, note: '태국 3위' },
  { id: 'x-tuoitre', name: 'Tuổi Trẻ', nameKo: '뚜오이째', url: 'https://tuoitre.vn', country: 'VN', group: 'asia-southeast', rank: 11.1, free: true, note: '베트남 2위' },
  { id: 'x-24hvn', name: '24h', nameKo: '24h 베트남', url: 'https://www.24h.com.vn', country: 'VN', group: 'asia-southeast', rank: 11.2, free: true, note: '베트남 3위' },
  { id: 'x-dantri', name: 'Dân Trí', nameKo: '전찌', url: 'https://dantri.com.vn', country: 'VN', group: 'asia-southeast', rank: 11.3, free: true, note: '베트남 5위' },

  // ═════════════════════════ 남아시아 ═════════════════════════
  { id: 'x-aajtak', name: 'Aaj Tak', nameKo: '아즈 탁', url: 'https://www.aajtak.in', country: 'IN', group: 'asia-south', rank: 1.1, free: true, note: '세계 32위 · 인도 2위, 힌디어 뉴스 채널' },
  { id: 'x-oneindia', name: 'OneIndia', nameKo: '원인디아', url: 'https://www.oneindia.com', country: 'IN', group: 'asia-south', rank: 1.2, free: true, note: '세계 34위 · 인도 4위, 다국어 뉴스' },
  { id: 'x-abplive', name: 'ABP Live', nameKo: 'ABP 라이브', url: 'https://news.abplive.com', country: 'IN', group: 'asia-south', rank: 1.3, free: true, note: '세계 뉴스 사이트 9위(월 1억 회)' },
  { id: 'x-jagran', name: 'Dainik Jagran', nameKo: '다이니크 자그란', url: 'https://www.jagran.com', country: 'IN', group: 'asia-south', rank: 1.4, free: true, note: '인도 최대 발행부수 힌디 일간지' },
  { id: 'x-bhaskar', name: 'Dainik Bhaskar', nameKo: '다이니크 바스카르', url: 'https://www.bhaskar.com', country: 'IN', group: 'asia-south', rank: 1.5, free: true },
  { id: 'x-amarujala', name: 'Amar Ujala', nameKo: '아마르 우잘라', url: 'https://www.amarujala.com', country: 'IN', group: 'asia-south', rank: 1.6, free: true },
  { id: 'x-news18', name: 'News18', nameKo: '뉴스18', url: 'https://www.news18.com', country: 'IN', group: 'asia-south', rank: 2.5, free: true },
  { id: 'x-hamariweb', name: 'HamariWeb', nameKo: '하마리웹', url: 'https://hamariweb.com/news/', country: 'PK', group: 'asia-south', rank: 7.1, free: true, note: '파키스탄 3위' },
  { id: 'x-propakistani', name: 'ProPakistani', nameKo: '프로파키스타니', url: 'https://propakistani.pk', country: 'PK', group: 'asia-south', rank: 7.2, free: true, note: '파키스탄 5위, 경제·IT 중심' },

  // ═════════════════════════ 중동 ═════════════════════════
  { id: 'x-aljazeera-ar', name: 'Al Jazeera Arabic', nameKo: '알자지라(아랍어)', url: 'https://www.aljazeera.net', country: 'QA', group: 'middle-east', rank: 0.5, free: true, note: '사우디 4위, 아랍어권 최대 뉴스' },
  { id: 'x-almarsd', name: 'Al Marsd', nameKo: '알마르사드', url: 'https://al-marsd.com', country: 'SA', group: 'middle-east', rank: 5.1, free: true, note: '사우디 1위' },
  { id: 'x-sabq', name: 'Sabq', nameKo: '사브크', url: 'https://sabq.org', country: 'SA', group: 'middle-east', rank: 5.2, free: true, note: '사우디 3위' },
  { id: 'x-sozcu', name: 'Sözcü', nameKo: '쇠즈쥐', url: 'https://www.sozcu.com.tr', country: 'TR', group: 'middle-east', rank: 9.1, free: true, lean: 'progressive', note: '튀르키예 1위, 야권 성향' },
  { id: 'x-hurriyet', name: 'Hürriyet', nameKo: '휘리예트(터키어)', url: 'https://www.hurriyet.com.tr', country: 'TR', group: 'middle-east', rank: 9.2, free: true, note: '튀르키예 2위' },
  { id: 'x-mynet', name: 'Mynet', nameKo: '미넷', url: 'https://www.mynet.com', country: 'TR', group: 'middle-east', rank: 9.3, free: true, note: '튀르키예 3위 포털' },
  { id: 'x-ensonhaber', name: 'En Son Haber', nameKo: '엔손하베르', url: 'https://www.ensonhaber.com', country: 'TR', group: 'middle-east', rank: 9.4, free: true, note: '튀르키예 4위' },
  { id: 'x-sondakika', name: 'Son Dakika', nameKo: '손다키카', url: 'https://www.sondakika.com', country: 'TR', group: 'middle-east', rank: 9.5, free: true, note: '튀르키예 5위' },
  { id: 'x-youm7', name: 'Youm7', nameKo: '알욤 알사비아', url: 'https://www.youm7.com', country: 'EG', group: 'middle-east', rank: 13.1, free: true, note: '이집트 1위' },
  { id: 'x-elbalad', name: 'Sada El Balad', nameKo: '사다 알발라드', url: 'https://www.elbalad.news', country: 'EG', group: 'middle-east', rank: 13.2, free: true, note: '이집트 2위' },
  { id: 'x-elwatan-eg', name: 'El Watan News', nameKo: '알와탄(이집트)', url: 'https://www.elwatannews.com', country: 'EG', group: 'middle-east', rank: 13.3, free: true, note: '이집트 3위' },
  { id: 'x-almasryalyoum', name: 'Al-Masry Al-Youm', nameKo: '알마스리 알욤', url: 'https://www.almasryalyoum.com', country: 'EG', group: 'middle-east', rank: 13.4, free: true, note: '이집트 4위, 대표 독립지' },
  { id: 'x-masrawy', name: 'Masrawy', nameKo: '마스라위', url: 'https://www.masrawy.com', country: 'EG', group: 'middle-east', rank: 13.5, free: true, note: '이집트 5위 포털' },
  { id: 'x-mako', name: 'Mako', nameKo: '마코(채널12)', url: 'https://www.mako.co.il', country: 'IL', group: 'middle-east', rank: 2.1, free: true, note: '이스라엘 2위' },
  { id: 'x-walla', name: 'Walla', nameKo: '왈라', url: 'https://news.walla.co.il', country: 'IL', group: 'middle-east', rank: 2.2, free: true, note: '이스라엘 3위' },
  { id: 'x-maariv', name: 'Maariv', nameKo: '마리브', url: 'https://www.maariv.co.il', country: 'IL', group: 'middle-east', rank: 2.3, free: true, note: '이스라엘 4위' },
  { id: 'x-kan', name: 'Kan', nameKo: '칸(이스라엘 공영방송)', url: 'https://www.kan.org.il/news/', country: 'IL', group: 'middle-east', rank: 2.4, free: true, note: '이스라엘 5위' },

  // ═════════════════════════ 러시아 ═════════════════════════
  { id: 'x-rbc', name: 'RBC', nameKo: 'RBC', url: 'https://www.rbc.ru', country: 'RU', group: 'russia', rank: 0.5, free: true, note: '세계 35위 · 러시아 1위, 경제 중심 종합 매체' },
  { id: 'x-rambler', name: 'Rambler', nameKo: '람블러', url: 'https://news.rambler.ru', country: 'RU', group: 'russia', rank: 0.6, free: true, note: '러시아 2위 포털' },
  { id: 'x-mailnews', name: 'Mail.ru News', nameKo: '메일루 뉴스', url: 'https://news.mail.ru', country: 'RU', group: 'russia', rank: 0.7, free: true, note: '러시아 5위' },
  { id: 'x-kp', name: 'Komsomolskaya Pravda', nameKo: '콤소몰스카야 프라우다', url: 'https://www.kp.ru', country: 'RU', group: 'russia', rank: 4.5, free: true, note: '최대 발행부수 타블로이드' },

  // ═════════════════════════ 서유럽 ═════════════════════════
  { id: 'x-tonline', name: 'T-Online', nameKo: '티온라인', url: 'https://www.t-online.de', country: 'DE', group: 'europe-west', rank: 2.1, free: true, note: '세계 36위 · 독일 2위 포털' },
  { id: 'x-ntv', name: 'n-tv', nameKo: 'n-tv', url: 'https://www.n-tv.de', country: 'DE', group: 'europe-west', rank: 2.2, free: true, note: '세계 37위 · 독일 3위 뉴스 채널' },
  { id: 'x-web-de', name: 'WEB.DE News', nameKo: 'WEB.DE 뉴스', url: 'https://web.de/magazine/', country: 'DE', group: 'europe-west', rank: 2.3, free: true },
  { id: 'x-franceinfo', name: 'franceinfo', nameKo: '프랑스앵포', url: 'https://www.franceinfo.fr', country: 'FR', group: 'europe-west', rank: 3.5, free: true, note: '프랑스 2위, 공영 라디오·TV 통합 뉴스' },
  { id: 'x-ouestfrance', name: 'Ouest-France', nameKo: '웨스트 프랑스', url: 'https://www.ouest-france.fr', country: 'FR', group: 'europe-west', rank: 13.5, free: true, note: '프랑스 4위, 최대 발행부수 지역지' },
  { id: 'x-bfmtv', name: 'BFM TV', nameKo: 'BFM TV', url: 'https://www.bfmtv.com', country: 'FR', group: 'europe-west', rank: 13.6, free: true },
  { id: 'x-nunl', name: 'NU.nl', nameKo: 'NU.nl', url: 'https://www.nu.nl', country: 'NL', group: 'europe-west', rank: 23.5, free: true, note: '세계 46위 · 네덜란드 1위' },
  { id: 'x-adnl', name: 'Algemeen Dagblad', nameKo: '알헤메인 다흐블라트', url: 'https://www.ad.nl', country: 'NL', group: 'europe-west', rank: 23.6, free: true, note: '네덜란드 2위' },

  // ═════════════════════════ 중·동유럽 ═════════════════════════
  { id: 'x-wp', name: 'Wirtualna Polska', nameKo: '비르투알나 폴스카', url: 'https://www.wp.pl', country: 'PL', group: 'europe-east', rank: 1.1, free: true, note: '세계 25위 · 폴란드 2위' },
  { id: 'x-interia', name: 'Interia', nameKo: '인테리아', url: 'https://www.interia.pl', country: 'PL', group: 'europe-east', rank: 1.2, free: true, note: '세계 31위 · 폴란드 3위' },
  { id: 'x-fakt', name: 'Fakt', nameKo: '팍트', url: 'https://www.fakt.pl', country: 'PL', group: 'europe-east', rank: 1.3, free: true, note: '폴란드 4위, 최대 타블로이드' },
  { id: 'x-o2pl', name: 'o2', nameKo: 'o2.pl', url: 'https://www.o2.pl', country: 'PL', group: 'europe-east', rank: 1.4, free: true, note: '폴란드 5위' },
  { id: 'x-novinky', name: 'Novinky.cz', nameKo: '노빈키', url: 'https://www.novinky.cz', country: 'CZ', group: 'europe-east', rank: 2.5, free: true, note: '세계 47위 · 체코 1위' },
  { id: 'x-blesk', name: 'Blesk', nameKo: '블레스크', url: 'https://www.blesk.cz', country: 'CZ', group: 'europe-east', rank: 3.1, free: true, note: '체코 5위, 최대 타블로이드' },
  { id: 'x-ukrnet', name: 'Ukr.net', nameKo: '우크르넷', url: 'https://www.ukr.net', country: 'UA', group: 'europe-east', rank: 3.5, free: true, note: '우크라이나 1위 뉴스 애그리게이터' },
  { id: 'x-obozrevatel', name: 'Obozrevatel', nameKo: '오보즈레바텔', url: 'https://www.obozrevatel.com', country: 'UA', group: 'europe-east', rank: 10.1, free: true, note: '우크라이나 3위' },
  { id: 'x-unian', name: 'UNIAN', nameKo: '우니안 통신', url: 'https://www.unian.ua', country: 'UA', group: 'europe-east', rank: 10.2, free: true, note: '우크라이나 4위' },
  { id: 'x-24tv', name: '24 Kanal', nameKo: '24 채널', url: 'https://24tv.ua', country: 'UA', group: 'europe-east', rank: 10.3, free: true, note: '우크라이나 5위' },

  // ═════════════════════════ 남유럽 ═════════════════════════
  { id: 'x-okdiario', name: 'OKDiario', nameKo: 'OK디아리오', url: 'https://okdiario.com', country: 'ES', group: 'europe-south', rank: 4.1, free: true, lean: 'conservative', note: '스페인 3위' },
  { id: 'x-20minutos', name: '20minutos', nameKo: '20미누토스', url: 'https://www.20minutos.es', country: 'ES', group: 'europe-south', rank: 4.2, free: true, note: '스페인 4위, 무가지 출신' },
  { id: 'x-libero', name: 'Libero', nameKo: '리베로', url: 'https://www.liberoquotidiano.it', country: 'IT', group: 'europe-south', rank: 12.4, free: true, lean: 'conservative', note: '이탈리아 4위' },
  { id: 'x-newsit', name: 'Newsit', nameKo: '뉴스잇', url: 'https://www.newsit.gr', country: 'GR', group: 'europe-south', rank: 19.1, free: true, note: '그리스 2위' },
  { id: 'x-news247', name: 'News247', nameKo: '뉴스247', url: 'https://www.news247.gr', country: 'GR', group: 'europe-south', rank: 19.2, free: true, note: '그리스 3위' },
  { id: 'x-newsbomb', name: 'Newsbomb', nameKo: '뉴스봄', url: 'https://www.newsbomb.gr', country: 'GR', group: 'europe-south', rank: 19.3, free: true, note: '그리스 4위' },
  { id: 'x-newsbeast', name: 'Newsbeast', nameKo: '뉴스비스트', url: 'https://www.newsbeast.gr', country: 'GR', group: 'europe-south', rank: 19.4, free: true, note: '그리스 5위' },

  // ═════════════════════════ 북유럽 ═════════════════════════
  { id: 'x-gp', name: 'Göteborgs-Posten', nameKo: '예테보리 포스텐', url: 'https://www.gp.se', country: 'SE', group: 'europe-nordic', rank: 8.1, note: '스웨덴 4위' },
  { id: 'x-nettavisen', name: 'Nettavisen', nameKo: '네타비센', url: 'https://www.nettavisen.no', country: 'NO', group: 'europe-nordic', rank: 9.5, free: true, note: '노르웨이 3위' },
  { id: 'x-e24', name: 'E24', nameKo: 'E24', url: 'https://e24.no', country: 'NO', group: 'europe-nordic', rank: 9.6, free: true, note: '노르웨이 4위, 경제 전문' },
  { id: 'x-ekstrabladet', name: 'Ekstra Bladet', nameKo: '엑스트라 블라데트', url: 'https://ekstrabladet.dk', country: 'DK', group: 'europe-nordic', rank: 11.5, free: true, note: '덴마크 1위 타블로이드' },
  { id: 'x-btdk', name: 'B.T.', nameKo: 'B.T.', url: 'https://www.bt.dk', country: 'DK', group: 'europe-nordic', rank: 11.6, free: true, note: '덴마크 2위' },

  // ═════════════════════════ 중남미 ═════════════════════════
  { id: 'x-cnnbrasil', name: 'CNN Brasil', nameKo: 'CNN 브라질', url: 'https://www.cnnbrasil.com.br', country: 'BR', group: 'latam', rank: 1.1, free: true, note: '브라질 4위' },
  { id: 'x-abril', name: 'Veja / Abril', nameKo: '베자(아브릴)', url: 'https://veja.abril.com.br', country: 'BR', group: 'latam', rank: 1.2, free: true, note: '브라질 5위, 최대 시사주간지' },
  { id: 'x-r7', name: 'R7', nameKo: 'R7', url: 'https://noticias.r7.com', country: 'BR', group: 'latam', rank: 1.3, free: true },
  { id: 'x-terrabr', name: 'Terra', nameKo: '테하', url: 'https://www.terra.com.br', country: 'BR', group: 'latam', rank: 1.4, free: true },
  { id: 'x-tnar', name: 'Todo Noticias', nameKo: 'TN(토도 노티시아스)', url: 'https://tn.com.ar', country: 'AR', group: 'latam', rank: 2.1, free: true, note: '아르헨티나 4위' },
  { id: 'x-elfinanciero', name: 'El Financiero', nameKo: '엘 피난시에로', url: 'https://www.elfinanciero.com.mx', country: 'MX', group: 'latam', rank: 7.1, free: true, note: '멕시코 4위, 경제 일간지' },
  { id: 'x-noticiascaracol', name: 'Noticias Caracol', nameKo: '노티시아스 카라콜', url: 'https://www.noticiascaracol.com', country: 'CO', group: 'latam', rank: 8.1, free: true, note: '콜롬비아 3위' },
  { id: 'x-elcolombiano', name: 'El Colombiano', nameKo: '엘 콜롬비아노', url: 'https://www.elcolombiano.com', country: 'CO', group: 'latam', rank: 8.2, free: true, note: '콜롬비아 5위' },

  // ═════════════════════════ 아프리카 ═════════════════════════
  { id: 'x-citizenza', name: 'The Citizen', nameKo: '더 시티즌(남아공)', url: 'https://www.citizen.co.za', country: 'ZA', group: 'africa', rank: 1.1, free: true, note: '남아공 3위' },
  { id: 'x-thefuse', name: 'The Fuse', nameKo: '더 퓨즈', url: 'https://www.thefuse.co.za', country: 'ZA', group: 'africa', rank: 1.05, free: true, note: '남아공 2위' },
  { id: 'x-sowetanlive', name: 'SowetanLIVE', nameKo: '소웨탄 라이브', url: 'https://www.sowetanlive.co.za', country: 'ZA', group: 'africa', rank: 1.2, free: true },
  { id: 'x-tuko', name: 'Tuko', nameKo: '투코', url: 'https://www.tuko.co.ke', country: 'KE', group: 'africa', rank: 2.1, free: true, note: '케냐 최대 디지털 네이티브 매체' },
  { id: 'x-citizendigital', name: 'Citizen Digital', nameKo: '시티즌 디지털', url: 'https://www.citizen.digital', country: 'KE', group: 'africa', rank: 2.2, free: true },
  { id: 'x-legitng', name: 'Legit.ng', nameKo: '레짓 나이지리아', url: 'https://www.legit.ng', country: 'NG', group: 'africa', rank: 3.1, free: true, note: '나이지리아 뉴스·시사 부문 트래픽 1위' },
  { id: 'x-dailypost', name: 'Daily Post Nigeria', nameKo: '데일리 포스트(나이지리아)', url: 'https://dailypost.ng', country: 'NG', group: 'africa', rank: 3.2, free: true, note: '나이지리아 트래픽 상위권' },
  { id: 'x-pulseng', name: 'Pulse Nigeria', nameKo: '펄스 나이지리아', url: 'https://www.pulse.ng', country: 'NG', group: 'africa', rank: 3.3, free: true },
  { id: 'x-nairaland', name: 'Nairaland', nameKo: '나이라랜드', url: 'https://www.nairaland.com', country: 'NG', group: 'africa', rank: 3.4, free: true, note: '나이지리아 최대 커뮤니티 포럼' },
  { id: 'x-thecable', name: 'TheCable', nameKo: '더 케이블', url: 'https://www.thecable.ng', country: 'NG', group: 'africa', rank: 10.5, free: true, note: '탐사보도 중심 독립 매체' },
];
