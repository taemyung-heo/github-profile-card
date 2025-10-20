# Implementation Plan: GitHub 프로필 카드 조회

**Branch**: `001-github-profile-card` | **Date**: 2025-10-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-github-profile-card/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

GitHub 아이디를 입력하여 사용자 프로필 정보를 조회하고 카드 형태로 표시하는 단일 페이지 웹 애플리케이션을 구축합니다. React + TypeScript로 구현하며, GitHub REST API를 사용하여 아바타, 이름, 아이디, 자기소개, 팔로워/팔로잉/레포지토리 통계를 실시간으로 가져옵니다. 반응형 디자인, 접근성, 오류 처리를 중점으로 사용자 경험을 최적화합니다.

## Technical Context

**Language/Version**: TypeScript 5.x + React 18.x
**Primary Dependencies**: React, Vite (빌드 도구), Tailwind CSS (스타일링), Zod (타입 검증)
**Storage**: N/A (상태 관리만 필요, 데이터 영속화 없음)
**Testing**: Vitest (단위 테스트), React Testing Library (컴포넌트 테스트)
**Target Platform**: 웹 브라우저 (Chrome, Firefox, Safari, Edge 최신 2개 버전)
**Project Type**: 단일 웹 프론트엔드 애플리케이션
**Performance Goals**:
- First Contentful Paint (FCP) < 1.5초
- API 응답 처리 및 렌더링 < 500ms
- 번들 크기 < 200KB (gzip)

**Constraints**:
- API 호출 타임아웃 3초 (사양서 FR-012)
- GitHub API Rate Limit: 시간당 60회 (비인증 요청)
- 100% 클라이언트 사이드 렌더링 (CSR)
- 오프라인 지원 불필요 (인터넷 연결 필수)

**Scale/Scope**:
- 단일 페이지 애플리케이션
- 1개 주요 화면 (검색 + 프로필 카드)
- 약 5-7개 React 컴포넌트
- API 엔드포인트 1개 (GET /users/{username})

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Component-First Architecture

**평가**: PASS
**근거**: React 기반 프로젝트로 컴포넌트 우선 아키텍처가 자연스럽게 적용됨. 계획된 컴포넌트:
- `SearchInput`: GitHub 아이디 입력 및 검색 버튼
- `ProfileCard`: 프로필 정보 표시 카드
- `Avatar`: 프로필 이미지 (로딩 실패 시 플레이스홀더)
- `StatItem`: 팔로워/팔로잉/레포지토리 통계 항목
- `ErrorMessage`: 오류 메시지 표시
- `LoadingSpinner`: 로딩 상태 표시

각 컴포넌트는 단일 책임 원칙을 따르며 독립적으로 테스트 가능.

### ✅ II. Type Safety & Validation

**평가**: PASS
**근거**:
- TypeScript strict mode 사용
- Zod를 활용한 GitHub API 응답 런타임 검증
- 모든 컴포넌트 Props 인터페이스 명시적 정의
- `any` 타입 사용 금지 정책 준수

**검증 계획**:
```typescript
// GitHub API 응답 스키마 (Zod)
const GitHubUserSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  avatar_url: z.string().url(),
  bio: z.string().nullable(),
  followers: z.number(),
  following: z.number(),
  public_repos: z.number(),
});
```

### ✅ III. Responsive Design First

**평가**: PASS
**근거**:
- Tailwind CSS의 mobile-first 브레이크포인트 사용 (sm:, md:, lg:)
- 3가지 주요 화면 크기 테스트 계획:
  - 모바일: 375px (iPhone SE 기준)
  - 태블릿: 768px (iPad 기준)
  - 데스크톱: 1280px 이상
- 터치 인터페이스 고려 (최소 터치 영역 44x44px)

### ✅ IV. Accessibility Standards (WCAG 2.1 AA)

**평가**: PASS
**근거**:
- 의미론적 HTML 사용 계획:
  - `<form>` for search input
  - `<button>` for submit
  - `<article>` for profile card
  - `<img>` with alt text for avatar
- 키보드 네비게이션 지원:
  - Tab으로 입력 필드 및 버튼 접근
  - Enter 키로 검색 실행 (FR-010)
  - Escape 키로 오류 메시지 닫기
- ARIA 속성 활용:
  - `aria-label` for buttons
  - `aria-live="polite"` for dynamic content updates
  - `aria-busy` for loading states
- 색상 대비 4.5:1 이상 유지 (Tailwind의 접근성 고려 색상 팔레트 사용)

### ✅ V. Performance & Optimization

**평가**: PASS
**근거**:
- 목표 달성 계획:
  - **FCP < 1.5초**: Vite의 빠른 빌드 + 최소 의존성
  - **LCP < 2.5초**: 이미지 lazy loading + 코드 스플리팅
  - **CLS < 0.1**: 프로필 카드 영역 사전 할당
  - **TTI < 3.5초**: React 18의 Concurrent Features 활용
- 최적화 전략:
  - 이미지: `loading="lazy"` + WebP 포맷 지원
  - 번들링: Vite의 자동 코드 스플리팅
  - 리렌더링 최적화: React.memo for ProfileCard
  - API 호출: AbortController를 사용한 타임아웃 처리

### 종합 평가

**결과**: ✅ **모든 헌법 원칙 준수**
**이유**: 프로젝트 특성상 단순한 웹 프론트엔드 애플리케이션으로, 헌법의 모든 원칙이 자연스럽게 적용됩니다. 복잡성 정당화 테이블 불필요.

## Project Structure

### Documentation (this feature)

```
specs/001-github-profile-card/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── github-api.openapi.yaml
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── components/
│   ├── SearchInput.tsx       # 검색 입력 필드 + 버튼
│   ├── ProfileCard.tsx       # 프로필 카드 메인 컴포넌트
│   ├── Avatar.tsx            # 프로필 이미지 (플레이스홀더 포함)
│   ├── StatItem.tsx          # 팔로워/팔로잉/레포지토리 통계
│   ├── ErrorMessage.tsx      # 오류 메시지 표시
│   └── LoadingSpinner.tsx    # 로딩 인디케이터
├── services/
│   ├── githubApi.ts          # GitHub API 호출 로직
│   └── formatters.ts         # 숫자 포맷팅 유틸리티 (쉼표, 축약)
├── types/
│   └── github.ts             # GitHub User 타입 정의
├── hooks/
│   └── useGitHubUser.ts      # GitHub 사용자 조회 커스텀 훅
├── App.tsx                   # 루트 컴포넌트
├── main.tsx                  # 앱 진입점
└── index.css                 # Tailwind CSS imports

tests/
├── components/               # 컴포넌트 단위 테스트
│   ├── SearchInput.test.tsx
│   ├── ProfileCard.test.tsx
│   └── Avatar.test.tsx
├── services/                 # 서비스 단위 테스트
│   ├── githubApi.test.ts
│   └── formatters.test.ts
└── integration/              # 통합 테스트
    └── ProfileSearch.test.tsx

public/
└── placeholder-avatar.svg    # 기본 아바타 플레이스홀더
```

**Structure Decision**: 단일 웹 프론트엔드 프로젝트 구조를 선택했습니다. 백엔드가 필요 없고 GitHub API를 직접 호출하므로 클라이언트 사이드만 구현합니다. Vite + React + TypeScript 스택을 사용하여 빠른 개발 환경을 제공하고, Tailwind CSS로 스타일링을 간소화합니다.

## Complexity Tracking

*이 프로젝트는 Constitution Check에서 모든 항목을 통과했으므로 복잡성 정당화가 필요하지 않습니다.*
