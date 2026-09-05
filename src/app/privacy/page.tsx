export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-[42rem]">
        <h1 className="mb-6 t-headline-xl tracking-tight text-slate-100">
          개인정보처리방침
        </h1>
        <div className="space-y-6 surface p-6 t-body text-slate-300 [&_h2]:mb-2.5 [&_h2]:t-headline-lg [&_h2]:text-slate-100 [&_li]:mt-1 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
          <section>
            <h2>1. 수집하는 개인정보</h2>
            <p>서비스는 회원가입 시 다음 정보를 수집합니다:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>이메일 주소 (필수)</li>
              <li>닉네임 (필수)</li>
              <li>비밀번호 (암호화 저장)</li>
              <li>소셜 로그인 시 프로필 정보 (선택)</li>
            </ul>
          </section>
          <section>
            <h2>2. 개인정보의 이용 목적</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>서비스 제공 및 회원 관리</li>
              <li>개인화된 뉴스 추천 (뉴스 DNA)</li>
              <li>이메일 알림 및 뉴스레터 발송</li>
              <li>서비스 이용 통계 분석</li>
            </ul>
          </section>
          <section>
            <h2>3. 개인정보의 보관 기간</h2>
            <p>회원 탈퇴 시 즉시 파기합니다. 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
          </section>
          <section>
            <h2>4. 개인정보의 제3자 제공</h2>
            <p>서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 의한 요청이 있는 경우는 예외로 합니다.</p>
          </section>
          <section>
            <h2>5. 개인정보의 안전성 확보 조치</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>비밀번호 암호화 저장 (Supabase Auth)</li>
              <li>HTTPS 통신 암호화</li>
              <li>접근 권한 관리</li>
            </ul>
          </section>
          <section>
            <h2>6. 이용자의 권리</h2>
            <p>이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있으며, 설정 페이지에서 계정을 삭제할 수 있습니다.</p>
          </section>
          <section>
            <h2>7. 쿠키 사용</h2>
            <p>서비스는 로그인 세션 유지를 위해 쿠키를 사용합니다. 브라우저 설정에서 쿠키를 거부할 수 있으나, 이 경우 서비스 이용이 제한될 수 있습니다.</p>
          </section>
        </div>
        <p className="text-slate-500 t-body-sm mt-4 text-center">최종 수정일: 2026년 2월 7일</p>
      </div>
    </div>
  );
}
