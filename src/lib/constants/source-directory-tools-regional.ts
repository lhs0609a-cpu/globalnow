import { DirectorySite } from '@/types/directory';

/**
 * 나라 안에서만 통하는 도구들.
 *
 * 앞의 두 파일이 전세계 어디서나 같은 것을 쓰는 서비스라면, 여기 모은 것은
 * 그 나라 사람이 아니면 이름조차 모르지만 현지에서는 대체재가 없는 사이트다.
 * 일본에서 환승을 검색할 때 구글 지도보다 야후 노선정보를 먼저 여는 식이다.
 *
 * rank 는 40번대부터 시작한다. 같은 카테고리 안에서 전세계 공통 도구가
 * 먼저 오고 그 뒤에 지역 도구가 붙게 하려는 것이다.
 */
export const TOOLS_REGIONAL_SITES: DirectorySite[] = [
  // ══════════════════════════ 일본 ══════════════════════════
  { id: 't-r-yahootransit', name: 'Yahoo! 路線情報', nameKo: '야후 노선정보', url: 'https://transit.yahoo.co.jp', country: 'JP', group: 't-travel', rank: 40, free: true, note: '일본 환승 검색의 국민 표준' },
  { id: 't-r-jalan', name: 'じゃらん', nameKo: '자란', url: 'https://www.jalan.net', country: 'JP', group: 't-travel', rank: 41, free: true, note: '료칸·온천 숙소는 여기가 가장 촘촘하다' },
  { id: 't-r-rakutentravel', name: '楽天トラベル', nameKo: '라쿠텐 트래블', url: 'https://travel.rakuten.co.jp', country: 'JP', group: 't-travel', rank: 42, free: true, note: '포인트를 쓰는 일본인이 가장 많이 쓴다' },
  { id: 't-r-qiita', name: 'Qiita', nameKo: '키이타', url: 'https://qiita.com', country: 'JP', group: 't-dev', rank: 40, free: true, note: '일본 최대 개발자 지식 공유' },
  { id: 't-r-zenn', name: 'Zenn', nameKo: '젠', url: 'https://zenn.dev', country: 'JP', group: 't-dev', rank: 41, free: true, note: '요즘 일본 개발자가 글을 쓰는 곳' },
  { id: 't-r-teratail', name: 'teratail', nameKo: '테라테일', url: 'https://teratail.com', country: 'JP', group: 't-dev', rank: 42, free: true, note: '일본어 프로그래밍 질의응답' },
  { id: 't-r-irasutoya', name: 'いらすとや', nameKo: '이라스토야', url: 'https://www.irasutoya.com', country: 'JP', group: 't-asset', rank: 40, free: true, note: '일본 공공기관 자료에서 늘 보이는 무료 일러스트' },
  { id: 't-r-pakutaso', name: 'ぱくたそ', nameKo: '파쿠타소', url: 'https://www.pakutaso.com', country: 'JP', group: 't-asset', rank: 41, free: true, note: '가입 없이 받는 일본 무료 사진' },
  { id: 't-r-chatwork', name: 'Chatwork', nameKo: '챗워크', url: 'https://www.chatwork.com', country: 'JP', group: 't-work', rank: 40, free: true, note: '일본 중소기업의 업무 채팅 표준' },
  { id: 't-r-backlog', name: 'Backlog', nameKo: '백로그', url: 'https://backlog.com', country: 'JP', group: 't-work', rank: 41, free: true, note: '일본에서 널리 쓰는 프로젝트 관리' },
  { id: 't-r-schoo', name: 'Schoo', nameKo: '스쿠', url: 'https://schoo.jp', country: 'JP', group: 't-learn', rank: 40, free: true, note: '직장인 대상 생방송 강의' },
  { id: 't-r-progate', name: 'Progate', nameKo: '프로게이트', url: 'https://prog-8.com', country: 'JP', group: 't-learn', rank: 41, free: true, note: '일본 코딩 입문의 첫 관문' },
  { id: 't-r-yahoofinancejp', name: 'Yahoo!ファイナンス', nameKo: '야후 파이낸스 재팬', url: 'https://finance.yahoo.co.jp', country: 'JP', group: 't-money', rank: 40, free: true, note: '일본 주식 시세는 여기가 기본' },
  { id: 't-r-suumo', name: 'SUUMO', nameKo: '스모', url: 'https://suumo.jp', country: 'JP', group: 't-money', rank: 41, free: true, note: '일본 부동산 매물·시세의 표준' },
  { id: 't-r-rikunabi', name: 'リクナビ', nameKo: '리쿠나비', url: 'https://job.rikunabi.com', country: 'JP', group: 't-career', rank: 40, free: true, note: '일본 신입 공채의 관문' },
  { id: 't-r-mynavi', name: 'マイナビ', nameKo: '마이나비', url: 'https://mynavi.jp', country: 'JP', group: 't-career', rank: 41, free: true, note: '취업·이직 종합 포털' },
  { id: 't-r-openwork', name: 'OpenWork', nameKo: '오픈워크', url: 'https://www.openwork.jp', country: 'JP', group: 't-career', rank: 42, free: true, note: '일본판 글래스도어, 재직자 리뷰' },
  { id: 't-r-estat', name: 'e-Stat', nameKo: 'e-Stat 일본 정부통계', url: 'https://www.e-stat.go.jp', country: 'JP', group: 't-stat', rank: 40, free: true, note: '일본 통계의 1차 출처' },
  { id: 't-r-medley', name: 'MEDLEY', nameKo: '메들리', url: 'https://medley.life', country: 'JP', group: 't-health', rank: 40, free: true, note: '의사가 감수한 일본어 질병 사전' },
  { id: 't-r-chiebukuro', name: 'Yahoo!知恵袋', nameKo: '야후 치에부쿠로', url: 'https://chiebukuro.yahoo.co.jp', country: 'JP', group: 't-forum', rank: 40, free: true, note: '일본 최대 지식 Q&A' },
  { id: 't-r-weblio', name: 'Weblio', nameKo: '웨블리오', url: 'https://www.weblio.jp', country: 'JP', group: 't-lang', rank: 40, free: true, note: '500여 개 일본어 사전을 한 번에 검색' },

  // ══════════════════════════ 중국 ══════════════════════════
  { id: 't-r-icourse163', name: '中国大学MOOC', nameKo: '중국대학 MOOC', url: 'https://www.icourse163.org', country: 'CN', group: 't-learn', rank: 45, free: true, note: '중국 대학 정규 학점 강의' },
  { id: 't-r-xuetangx', name: '学堂在线', nameKo: '쉐탕짜이셴', url: 'https://www.xuetangx.com', country: 'CN', group: 't-learn', rank: 46, free: true, note: '칭화대가 주도하는 MOOC' },
  { id: 't-r-csdn', name: 'CSDN', nameKo: 'CSDN', url: 'https://www.csdn.net', country: 'CN', group: 't-dev', rank: 45, free: true, note: '중국 최대 개발자 커뮤니티' },
  { id: 't-r-juejin', name: '掘金', nameKo: '쥐진', url: 'https://juejin.cn', country: 'CN', group: 't-dev', rank: 46, free: true, note: '프론트엔드 중심 기술 커뮤니티' },
  { id: 't-r-gitee', name: 'Gitee', nameKo: '기티', url: 'https://gitee.com', country: 'CN', group: 't-dev', rank: 47, free: true, note: '중국 안에서 쓰는 깃허브 대체재' },
  { id: 't-r-zcool', name: '站酷 ZCOOL', nameKo: '짠쿠', url: 'https://www.zcool.com.cn', country: 'CN', group: 't-design', rank: 40, free: true, note: '중국 최대 디자이너 포트폴리오' },
  { id: 't-r-tencentdocs', name: '腾讯文档', nameKo: '텐센트 문서', url: 'https://docs.qq.com', country: 'CN', group: 't-work', rank: 45, free: true, note: '위챗과 붙어 있는 실시간 협업 문서' },
  { id: 't-r-wps', name: 'WPS Office', nameKo: 'WPS 오피스', url: 'https://www.wps.com', country: 'CN', group: 't-work', rank: 46, free: true, note: '중국 대표 오피스, 무료판이 쓸 만하다' },
  { id: 't-r-ctrip', name: '携程 Ctrip', nameKo: '씨트립', url: 'https://www.ctrip.com', country: 'CN', group: 't-travel', rank: 45, free: true, note: '중국 최대 여행 예약, 국제선도 강하다' },
  { id: 't-r-qunar', name: '去哪儿 Qunar', nameKo: '취날', url: 'https://www.qunar.com', country: 'CN', group: 't-travel', rank: 46, free: true, note: '중국 내 항공·숙소 가격비교' },
  { id: 't-r-12306', name: '中国铁路12306', nameKo: '중국철도 12306', url: 'https://www.12306.cn', country: 'CN', group: 't-travel', rank: 47, free: true, note: '중국 기차표는 여기서만 정가로 산다' },
  { id: 't-r-amap', name: '高德地图 Amap', nameKo: '가오더 지도', url: 'https://www.amap.com', country: 'CN', group: 't-map', rank: 40, free: true, note: '중국에서 구글 지도 대신 쓰는 내비게이션' },
  { id: 't-r-taobao', name: '淘宝 Taobao', nameKo: '타오바오', url: 'https://www.taobao.com', country: 'CN', group: 't-shop', rank: 45, free: true, note: '중국 최대 오픈마켓' },
  { id: 't-r-jd', name: '京东 JD.com', nameKo: '징둥', url: 'https://www.jd.com', country: 'CN', group: 't-shop', rank: 46, free: true, note: '정품·자체배송이 강점' },
  { id: 't-r-smzdm', name: '什么值得买', nameKo: '션머즈더마이', url: 'https://www.smzdm.com', country: 'CN', group: 't-shop', rank: 47, free: true, note: '중국판 핫딜 커뮤니티' },
  { id: 't-r-eastmoney', name: '东方财富', nameKo: '둥팡차이푸', url: 'https://www.eastmoney.com', country: 'CN', group: 't-money', rank: 45, free: true, note: '중국 A주 시세와 공시의 관문' },
  { id: 't-r-zhipin', name: 'BOSS直聘', nameKo: '보스즈핀', url: 'https://www.zhipin.com', country: 'CN', group: 't-career', rank: 45, free: true, note: '대표와 바로 대화하는 채용 방식' },
  { id: 't-r-statscn', name: '国家统计局', nameKo: '중국 국가통계국', url: 'https://www.stats.gov.cn', country: 'CN', group: 't-stat', rank: 45, free: true, note: '중국 공식 통계 원본' },
  { id: 't-r-dxy', name: '丁香医生', nameKo: '딩샹 의사', url: 'https://dxy.com', country: 'CN', group: 't-health', rank: 45, free: true, note: '의사가 검증하는 중국 의료정보' },
  { id: 't-r-baike', name: '百度百科', nameKo: '바이두백과', url: 'https://baike.baidu.com', country: 'CN', group: 't-search', rank: 40, free: true, note: '중국어권 최대 백과사전' },
  { id: 't-r-youdao', name: '有道词典', nameKo: '유다오 사전', url: 'https://www.youdao.com', country: 'CN', group: 't-lang', rank: 45, free: true, note: '중국어 학습자용 사전·번역' },
  { id: 't-r-baidufanyi', name: '百度翻译', nameKo: '바이두 번역', url: 'https://fanyi.baidu.com', country: 'CN', group: 't-lang', rank: 46, free: true, note: '중국 안에서 쓰는 번역기' },

  // ══════════════════════════ 대만·홍콩 ══════════════════════════
  { id: 't-r-hahow', name: 'Hahow 好學校', nameKo: '하하우', url: 'https://hahow.in', country: 'TW', group: 't-learn', rank: 50, free: true, note: '대만 대표 온라인 강의' },
  { id: 't-r-ithelp', name: 'iT邦幫忙', nameKo: 'IT방빵망', url: 'https://ithelp.ithome.com.tw', country: 'TW', group: 't-dev', rank: 50, free: true, note: '대만 개발자 Q&A와 연재 대회' },
  { id: 't-r-thsr', name: '台灣高鐵 THSR', nameKo: '대만 고속철도', url: 'https://www.thsrc.com.tw', country: 'TW', group: 't-travel', rank: 50, free: true, note: '대만 고속철 예매·시각표' },
  { id: 't-r-twrailway', name: '台灣鐵路', nameKo: '대만 철도', url: 'https://www.railway.gov.tw', country: 'TW', group: 't-travel', rank: 51, free: true, note: '대만 재래선 시각표·예매' },
  { id: 't-r-backpackers', name: '背包客棧', nameKo: '배낭객잔', url: 'https://www.backpackers.com.tw', country: 'TW', group: 't-travel', rank: 52, free: true, note: '대만 최대 여행 정보 커뮤니티' },
  { id: 't-r-momoshop', name: 'momo購物網', nameKo: '모모 쇼핑', url: 'https://www.momoshop.com.tw', country: 'TW', group: 't-shop', rank: 50, free: true, note: '대만 최대 온라인 몰' },
  { id: 't-r-pchome24h', name: 'PChome 24h', nameKo: 'PC홈 24시', url: 'https://24h.pchome.com.tw', country: 'TW', group: 't-shop', rank: 51, free: true, note: '24시간 배송으로 자리잡았다' },
  { id: 't-r-goodinfo', name: 'Goodinfo! 台灣股市資訊網', nameKo: '굿인포 대만증시', url: 'https://goodinfo.tw', country: 'TW', group: 't-money', rank: 50, free: true, note: '대만 주식 재무·시세 분석' },
  { id: 't-r-cnyes', name: '鉅亨網 cnYES', nameKo: '쥐헝왕', url: 'https://www.cnyes.com', country: 'TW', group: 't-money', rank: 51, free: true, note: '대만 금융 정보 포털' },
  { id: 't-r-591', name: '591房屋交易網', nameKo: '591 부동산', url: 'https://www.591.com.tw', country: 'TW', group: 't-money', rank: 52, free: true, note: '대만 부동산 매매·임대 시세' },
  { id: 't-r-104', name: '104人力銀行', nameKo: '104 인력은행', url: 'https://www.104.com.tw', country: 'TW', group: 't-career', rank: 50, free: true, note: '대만 최대 채용 사이트' },
  { id: 't-r-datagovtw', name: '政府資料開放平臺', nameKo: '대만 공공데이터 포털', url: 'https://data.gov.tw', country: 'TW', group: 't-stat', rank: 50, free: true },
  { id: 't-r-dcard', name: 'Dcard', nameKo: '디카드', url: 'https://www.dcard.tw', country: 'TW', group: 't-forum', rank: 50, free: true, note: '대만 청년층 익명 커뮤니티' },
  { id: 't-r-ptt', name: '批踢踢實業坊 PTT', nameKo: 'PTT', url: 'https://www.ptt.cc', country: 'TW', group: 't-forum', rank: 51, free: true, note: '대만 여론이 시작되는 BBS' },
  { id: 't-r-mtr', name: 'MTR 港鐵', nameKo: '홍콩 MTR', url: 'https://www.mtr.com.hk', country: 'HK', group: 't-travel', rank: 55, free: true, note: '홍콩 지하철 노선·요금' },
  { id: 't-r-openrice', name: 'OpenRice', nameKo: '오픈라이스', url: 'https://www.openrice.com', country: 'HK', group: 't-travel', rank: 56, free: true, note: '홍콩 맛집 검색의 표준' },
  { id: 't-r-hktvmall', name: 'HKTVmall', nameKo: 'HKTV몰', url: 'https://www.hktvmall.com', country: 'HK', group: 't-shop', rank: 55, free: true, note: '홍콩 최대 온라인 쇼핑' },
  { id: 't-r-pricehk', name: 'Price.com.hk', nameKo: '프라이스 홍콩', url: 'https://www.price.com.hk', country: 'HK', group: 't-shop', rank: 56, free: true, note: '홍콩 가격비교' },
  { id: 't-r-hkex', name: 'HKEX', nameKo: '홍콩거래소', url: 'https://www.hkex.com.hk', country: 'HK', group: 't-money', rank: 55, free: true, note: '홍콩 상장사 공시 원문' },
  { id: 't-r-aastocks', name: 'AAStocks', nameKo: '아스탁스', url: 'https://www.aastocks.com', country: 'HK', group: 't-money', rank: 56, free: true, note: '홍콩 주식 실시간 시세' },
  { id: 't-r-jobsdbhk', name: 'JobsDB Hong Kong', nameKo: '잡스디비 홍콩', url: 'https://hk.jobsdb.com', country: 'HK', group: 't-career', rank: 55, free: true, note: '홍콩 대표 채용 사이트' },
  { id: 't-r-lihkg', name: 'LIHKG', nameKo: 'LIHKG', url: 'https://lihkg.com', country: 'HK', group: 't-forum', rank: 55, free: true, note: '홍콩판 레딧' },
  { id: 't-r-datagovhk', name: 'data.gov.hk', nameKo: '홍콩 공공데이터', url: 'https://data.gov.hk', country: 'HK', group: 't-stat', rank: 55, free: true },
];
