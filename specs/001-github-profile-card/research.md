# Research: GitHub 프로필 카드 조회

**Feature**: GitHub 프로필 카드 조회
**Date**: 2025-10-20
**Status**: Complete

## Overview

이 문서는 GitHub 프로필 카드 조회 기능 구현을 위한 기술 스택 선택, 아키텍처 패턴, 모범 사례 연구 결과를 정리합니다.

## Technical Stack Decisions

### 1. Frontend Framework: React 18.x + TypeScript 5.x

**Decision**: React 18 with TypeScript를 사용한 단일 페이지 애플리케이션

**Rationale**:
- **컴포넌트 기반 아키텍처**: 헌법 원칙 I (Component-First Architecture)과 완벽히 일치
- **타입 안정성**: TypeScript strict mode로 헌법 원칙 II (Type Safety) 준수
- **생태계**: 검증된 라이브러리 생태계 (Tailwind CSS, Zod, React Testing Library 등)
- **성능**: React 18의 Concurrent Features로 사용자 경험 최적화
- **학습 곡선**: 널리 사용되는 프레임워크로 유지보수성 향상

**Alternatives Considered**:
1. **Vue 3 + TypeScript**
   - 장점: 더 간단한 API, 빠른 학습 곡선
   - 단점: React보다 작은 생태계, 헌법에서 React 기반 원칙 명시
   - 거부 이유: 프로젝트 헌법이 React/TypeScript 기반 원칙을 명시함

2. **Vanilla JavaScript**
   - 장점: 의존성 없음, 번들 크기 최소화
   - 단점: 컴포넌트 재사용성 낮음, 타입 안정성 부족
   - 거부 이유: 헌법 원칙 I, II 위반

3. **Svelte**
   - 장점: 빠른 성능, 작은 번들 크기
   - 단점: 작은 생태계, TypeScript 통합 제한적
   - 거부 이유: 프로젝트 헌법 및 기존 컨벤션과 불일치

### 2. Build Tool: Vite

**Decision**: Vite를 빌드 도구 및 개발 서버로 사용

**Rationale**:
- **빠른 개발 경험**: HMR (Hot Module Replacement)로 즉각적인 피드백
- **최적화된 빌드**: Rollup 기반으로 작은 번들 크기 (목표 < 200KB gzip)
- **TypeScript 지원**: 기본적으로 TypeScript 지원, 추가 설정 불필요
- **React 18 호환성**: 공식 React 템플릿 제공
- **성능**: 헌법 원칙 V (Performance & Optimization) 달성에 유리

**Alternatives Considered**:
1. **Create React App (CRA)**
   - 장점: 검증된 도구, 많은 사용자
   - 단점: 느린 빌드 속도, 최신 기능 지원 느림
   - 거부 이유: 성능 목표 (FCP < 1.5초) 달성에 불리

2. **Webpack**
   - 장점: 유연한 설정, 성숙한 생태계
   - 단점: 복잡한 설정, 느린 개발 서버
   - 거부 이유: 개발 경험 및 성능 측면에서 Vite에 비해 열등

3. **Parcel**
   - 장점: 제로 설정, 자동 최적화
   - 단점: TypeScript 설정 제한적, 커뮤니티 규모 작음
   - 거부 이유: Vite보다 성능 및 생태계 측면에서 열등

### 3. Styling: Tailwind CSS

**Decision**: Tailwind CSS를 스타일링 프레임워크로 사용

**Rationale**:
- **Responsive Design**: Mobile-first 브레이크포인트로 헌법 원칙 III 준수
- **접근성**: 색상 팔레트가 WCAG 2.1 AA 기준 준수 (헌법 원칙 IV)
- **성능**: Unused CSS 자동 제거로 번들 크기 최소화
- **개발 속도**: Utility-first 접근으로 빠른 프로토타이핑
- **일관성**: 디자인 시스템 토큰으로 일관된 스타일 유지

**Alternatives Considered**:
1. **CSS Modules**
   - 장점: 스코프 격리, TypeScript 통합
   - 단점: 반응형 디자인 구현 복잡, 개발 속도 느림
   - 거부 이유: Tailwind보다 생산성 낮음

2. **Styled Components**
   - 장점: CSS-in-JS, 동적 스타일링
   - 단점: 런타임 오버헤드, 번들 크기 증가
   - 거부 이유: 성능 목표 (번들 < 200KB) 달성에 불리

3. **Plain CSS**
   - 장점: 의존성 없음, 완전한 제어
   - 단점: 반응형 디자인 수동 구현, 일관성 유지 어려움
   - 거부 이유: 헌법 원칙 III (Responsive Design First) 달성에 불리

### 4. Data Validation: Zod

**Decision**: Zod를 런타임 타입 검증 라이브러리로 사용

**Rationale**:
- **TypeScript 통합**: 스키마에서 TypeScript 타입 자동 추론
- **헌법 준수**: 헌법 원칙 II (Type Safety & Validation)에서 Zod 명시적 권장
- **간결한 API**: 직관적인 스키마 정의
- **오류 처리**: 명확한 검증 오류 메시지
- **번들 크기**: 경량 라이브러리 (< 8KB gzip)

**Alternatives Considered**:
1. **Yup**
   - 장점: 성숙한 라이브러리, 많은 사용자
   - 단점: TypeScript 타입 추론 제한적, Zod보다 큰 번들
   - 거부 이유: Zod보다 TypeScript 통합 열등

2. **io-ts**
   - 장점: 함수형 프로그래밍 스타일, 강력한 타입 추론
   - 단점: 학습 곡선 높음, 복잡한 API
   - 거부 이유: 프로젝트 복잡도에 비해 과도한 추상화

3. **Manual Validation**
   - 장점: 의존성 없음, 완전한 제어
   - 단점: 타입 안정성 부족, 반복 코드 증가
   - 거부 이유: 헌법 원칙 II 위반

### 5. Testing: Vitest + React Testing Library

**Decision**: Vitest를 테스트 러너로, React Testing Library를 컴포넌트 테스트 도구로 사용

**Rationale**:
- **Vite 통합**: Vite와 동일한 설정 및 플러그인 공유
- **빠른 실행**: ESM 기반으로 빠른 테스트 실행
- **React Testing Library**: 사용자 관점 테스트로 접근성 검증
- **TypeScript 지원**: 기본적으로 TypeScript 지원
- **Jest 호환**: Jest API 호환으로 마이그레이션 용이

**Alternatives Considered**:
1. **Jest + React Testing Library**
   - 장점: 성숙한 생태계, 많은 리소스
   - 단점: 느린 실행 속도, Vite와 별도 설정 필요
   - 거부 이유: Vitest보다 설정 및 성능 측면에서 열등

2. **Cypress**
   - 장점: E2E 테스트 강력, 시각적 디버깅
   - 단점: 단위/통합 테스트에는 과도, 무거운 의존성
   - 거부 이유: 프로젝트 규모에 비해 과도한 도구

## Architecture Patterns

### 1. Custom Hooks for Business Logic

**Pattern**: useGitHubUser 커스텀 훅으로 비즈니스 로직 캡슐화

**Implementation**:
```typescript
export function useGitHubUser() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await githubApi.getUser(username);
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, fetchUser };
}
```

**Rationale**:
- 비즈니스 로직과 UI 분리
- 테스트 용이성 향상
- 재사용성 향상

### 2. Service Layer for API Calls

**Pattern**: githubApi 서비스로 API 호출 로직 중앙화

**Implementation**:
```typescript
const githubApi = {
  async getUser(username: string): Promise<GitHubUser> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3초 타임아웃

    try {
      const response = await fetch(`https://api.github.com/users/${username}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error('사용자를 찾을 수 없습니다');
        if (response.status === 403) throw new Error('API 요청 제한을 초과했습니다');
        throw new Error('네트워크 오류가 발생했습니다');
      }

      const data = await response.json();
      return GitHubUserSchema.parse(data); // Zod 검증
    } finally {
      clearTimeout(timeoutId);
    }
  },
};
```

**Rationale**:
- API 호출 로직 중앙화
- 타임아웃 처리 (FR-012)
- 오류 처리 일관성

### 3. Number Formatting Strategy

**Pattern**: formatters 유틸리티로 숫자 표시 형식 통일

**Implementation**:
```typescript
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'; // 1.2M
  }
  return num.toLocaleString('en-US'); // 1,234
}
```

**Rationale**:
- FR-016 요구사항 준수 (100만 이상 축약)
- 일관된 숫자 표시
- 재사용성

## Best Practices

### 1. GitHub API Integration

**Best Practice**: GitHub REST API v3 사용

**Documentation**: https://docs.github.com/en/rest/users/users#get-a-user

**Rate Limiting**:
- 비인증 요청: 시간당 60회
- 인증 요청: 시간당 5000회
- **선택**: 비인증 요청 (사양서 가정사항에 따라 인증 불필요)

**Error Handling**:
- 404: 사용자 없음
- 403: Rate limit 초과
- Network Error: 타임아웃 또는 연결 실패

### 2. Accessibility Implementation

**Best Practices** (WCAG 2.1 AA 준수):

1. **키보드 네비게이션**:
   - Tab 순서: Input → Button → Profile Link
   - Enter: Form 제출
   - Escape: 오류 메시지 닫기

2. **ARIA 속성**:
   ```jsx
   <form role="search" aria-label="GitHub 사용자 검색">
     <input aria-label="GitHub 아이디" />
     <button aria-label="검색">검색</button>
   </form>

   <div role="status" aria-live="polite" aria-busy={loading}>
     {loading && "프로필 로딩 중..."}
   </div>
   ```

3. **색상 대비**:
   - 텍스트: 최소 4.5:1 (Tailwind gray-900 on white)
   - 버튼: 최소 4.5:1 (Tailwind blue-600 on white)

4. **이미지 대체 텍스트**:
   ```jsx
   <img alt={`${user.name || user.login}의 프로필 이미지`} />
   ```

### 3. Performance Optimization

**Best Practices**:

1. **Code Splitting**: Vite의 자동 코드 스플리팅 활용
2. **Image Optimization**:
   ```jsx
   <img loading="lazy" decoding="async" />
   ```
3. **React.memo**: ProfileCard 컴포넌트 메모이제이션
4. **debounce**: 입력 필드 디바운싱 (선택적 - 현재 요구사항에 없음)

### 4. Error Handling Strategy

**Best Practices**:

1. **사용자 친화적 메시지**:
   - 404: "해당 사용자를 찾을 수 없습니다"
   - 403: "일시적으로 요청이 제한되었습니다. 잠시 후 다시 시도해주세요"
   - Network: "네트워크 오류가 발생했습니다. 다시 시도해주세요"

2. **재시도 옵션**: ErrorMessage 컴포넌트에 "다시 시도" 버튼 제공

3. **로깅**: 개발 모드에서 console.error로 상세 오류 기록

## Technology Summary

| Category          | Technology                  | Version | Rationale                           |
| ----------------- | --------------------------- | ------- | ----------------------------------- |
| Language          | TypeScript                  | 5.x     | 타입 안정성, 헌법 원칙 II           |
| Framework         | React                       | 18.x    | 컴포넌트 아키텍처, 헌법 원칙 I      |
| Build Tool        | Vite                        | 5.x     | 빠른 개발 경험, 성능 최적화         |
| Styling           | Tailwind CSS                | 3.x     | 반응형 디자인, 헌법 원칙 III        |
| Validation        | Zod                         | 3.x     | 런타임 검증, 헌법 원칙 II           |
| Testing           | Vitest + React Testing Library | latest  | 빠른 테스트, 접근성 검증            |
| HTTP Client       | Fetch API                   | Native  | 브라우저 기본 API, 의존성 없음      |

## Open Questions

*이 프로젝트는 모든 기술적 결정이 완료되었으므로 open questions가 없습니다.*

## References

1. [React 18 Documentation](https://react.dev/)
2. [TypeScript Handbook](https://www.typescriptlang.org/docs/)
3. [Vite Guide](https://vitejs.dev/guide/)
4. [Tailwind CSS Documentation](https://tailwindcss.com/docs)
5. [Zod Documentation](https://zod.dev/)
6. [GitHub REST API](https://docs.github.com/en/rest)
7. [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
8. [Web Vitals](https://web.dev/vitals/)
