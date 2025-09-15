/**
 * 스크린 리더 사용자를 위한 스킵 링크 컴포넌트
 * 키보드 내비게이션 시 메인 콘텐츠로 바로 이동할 수 있게 해줍니다.
 */
export const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      메인 콘텐츠로 이동
    </a>
  );
};
