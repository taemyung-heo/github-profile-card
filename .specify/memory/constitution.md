<!--
Sync Impact Report:
- Version: 0.0.0 → 1.0.0 (Initial constitution ratification)
- New principles established:
  1. Component-First Architecture
  2. Type Safety & Validation
  3. Responsive Design First
  4. Accessibility Standards
  5. Performance & Optimization
- New sections added:
  - Development Standards
  - Quality Gates
- Templates status:
  ✅ plan-template.md: Constitution check section present
  ✅ spec-template.md: Requirements section aligns with principles
  ✅ tasks-template.md: Task phases support principle-driven development
- Follow-up TODOs: None
-->

# GitHub Profile Card 프로젝트 헌법

## 핵심 원칙

### I. Component-First Architecture

모든 UI 기능은 재사용 가능한 React 컴포넌트로 시작합니다.

**규칙**:
- 각 컴포넌트는 단일 책임을 가져야 합니다
- 컴포넌트는 독립적으로 테스트 가능해야 합니다
- Props 인터페이스는 명확하게 정의되어야 합니다
- 컴포넌트는 재사용성을 고려하여 설계합니다

**근거**: 컴포넌트 기반 아키텍처는 코드 재사용성을 높이고, 유지보수를 용이하게 하며,
독립적인 개발과 테스트를 가능하게 합니다.

### II. Type Safety & Validation

TypeScript를 활용한 엄격한 타입 안정성을 유지합니다.

**규칙**:
- 모든 함수, 컴포넌트, 변수는 명시적 타입 선언 필수
- `any` 타입 사용 금지 (정당한 사유가 있는 경우 문서화 필요)
- 외부 API 응답은 타입 가드로 검증
- Zod 또는 유사 라이브러리로 런타임 검증 수행

**근거**: 타입 안정성은 개발 단계에서 오류를 조기 발견하고,
리팩토링 시 안정성을 보장하며, 코드 의도를 명확히 전달합니다.

### III. Responsive Design First

모바일부터 데스크톱까지 모든 화면 크기를 지원합니다.

**규칙**:
- Mobile-first 접근 방식 사용 (Tailwind의 sm:, md:, lg: 브레이크포인트 활용)
- 모든 컴포넌트는 최소 3가지 화면 크기에서 테스트
- 터치 인터페이스와 마우스 인터페이스 모두 고려
- 고정 픽셀 크기 대신 상대 단위(rem, %, vw/vh) 우선 사용

**근거**: 다양한 디바이스 환경에서 일관된 사용자 경험을 제공하고,
접근성과 사용성을 극대화합니다.

### IV. Accessibility Standards (WCAG 2.1 AA 준수)

모든 사용자가 접근 가능한 인터페이스를 구축합니다.

**규칙**:
- 의미론적 HTML 요소 사용 (div 남용 금지)
- 키보드 네비게이션 완전 지원 (Tab, Enter, Escape 등)
- ARIA 속성 적절히 활용 (role, aria-label, aria-describedby 등)
- 색상 대비 비율 최소 4.5:1 유지 (텍스트)
- 스크린 리더 호환성 검증

**근거**: 접근성은 법적 요구사항이며, 더 많은 사용자에게 서비스를 제공하고,
전반적인 사용성을 향상시킵니다.

### V. Performance & Optimization

빠른 로딩과 부드러운 사용자 경험을 보장합니다.

**목표**:
- First Contentful Paint (FCP) < 1.5초
- Largest Contentful Paint (LCP) < 2.5초
- Cumulative Layout Shift (CLS) < 0.1
- Time to Interactive (TTI) < 3.5초

**규칙**:
- 이미지 최적화 및 lazy loading 적용
- 코드 스플리팅 및 동적 import 활용
- 불필요한 리렌더링 방지 (React.memo, useMemo, useCallback)
- 번들 크기 모니터링 (주요 청크 < 200KB gzip)

**근거**: 성능은 사용자 만족도, SEO, 전환율에 직접적인 영향을 미칩니다.

## 개발 표준

### 코드 품질 도구

- **Linter**: ESLint (airbnb-typescript 기반 설정)
- **Formatter**: Prettier (2 spaces, single quotes, trailing comma)
- **Type Checker**: TypeScript strict mode
- **Pre-commit**: Husky + lint-staged

### 브랜치 전략

- `main`: 프로덕션 배포 브랜치 (보호됨)
- `develop`: 개발 통합 브랜치
- `feature/###-description`: 기능 개발 브랜치
- `fix/###-description`: 버그 수정 브랜치

### 커밋 컨벤션

Conventional Commits 형식 사용:
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

## 품질 게이트

### Pull Request 요구사항

1. **코드 리뷰**: 최소 1명 승인 필요
2. **자동화 검사**:
   - ESLint 오류 0개
   - TypeScript 컴파일 성공
   - 모든 테스트 통과 (있는 경우)
3. **접근성 검증**:
   - 키보드 네비게이션 확인
   - 색상 대비 검증
4. **성능 검증**:
   - Lighthouse 점수 (Performance, Accessibility, Best Practices 모두 90+ 목표)

### 배포 전 체크리스트

- [ ] 모든 브레이크포인트에서 UI 정상 동작 확인
- [ ] 브라우저 호환성 테스트 (Chrome, Firefox, Safari, Edge)
- [ ] 스크린 리더 테스트 (최소 1개 도구 사용)
- [ ] 성능 메트릭 확인 (Lighthouse CI)
- [ ] 번들 크기 확인 및 최적화

## 거버넌스

### 헌법 개정 절차

1. 개정 제안서 작성 (이유, 영향 범위, 마이그레이션 계획 포함)
2. 팀 리뷰 및 토론
3. 합의 도달 후 문서 업데이트
4. 버전 번호 증가 및 개정 일자 기록
5. 관련 템플릿 및 문서 동기화

### 버전 관리 정책

- **MAJOR**: 기존 원칙 제거 또는 근본적 변경 (하위 호환성 없음)
- **MINOR**: 새로운 원칙 추가 또는 기존 원칙 확장
- **PATCH**: 문구 명확화, 오타 수정, 비의미적 개선

### 준수 검토

- **코드 리뷰 시**: 모든 PR은 헌법 원칙 준수 여부 확인
- **정기 검토**: 분기별 헌법 준수 감사 및 개선 제안
- **예외 처리**: 원칙 위반 시 명확한 정당화 및 문서화 필요

### 복잡성 정당화

헌법 원칙을 위반하는 복잡한 구현이 필요한 경우:
1. 기술 부채 이슈 생성
2. 더 단순한 대안을 시도하고 실패한 이유 문서화
3. 리팩토링 계획 수립
4. 팀 리뷰 및 승인 필요

**Version**: 1.0.0 | **Ratified**: 2025-10-20 | **Last Amended**: 2025-10-20
