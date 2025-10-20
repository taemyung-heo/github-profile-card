# Implementation Tasks: GitHub 프로필 카드 조회

**Feature**: GitHub 프로필 카드 조회
**Branch**: `001-github-profile-card`
**Date**: 2025-10-20
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)

## Overview

이 문서는 GitHub 프로필 카드 조회 기능을 구현하기 위한 실행 가능한 작업 목록입니다. 작업은 사용자 스토리별로 구성되어 있으며, 각 스토리는 독립적으로 구현 및 테스트 가능합니다.

## Task Summary

| Phase | User Story | Tasks | Parallelizable | Total |
|-------|------------|-------|----------------|-------|
| 1     | Setup      | 10    | 3              | 10    |
| 2     | Foundational | 5   | 2              | 5     |
| 3     | US1 (P1) - 기본 프로필 조회 | 6 | 3 | 6 |
| 4     | US2 (P2) - 오류 처리 | 3 | 2 | 3 |
| 5     | US3 (P3) - 입력 편의성 | 2 | 1 | 2 |
| 6     | Polish     | 4     | 2              | 4     |
| **Total** |            | **30** | **13**     | **30** |

## Implementation Strategy

**MVP Scope**: User Story 1 (기본 프로필 조회)만 구현하면 최소 기능 제품(MVP)이 완성됩니다.

**Incremental Delivery**:
1. **Phase 1-3 완료** → MVP 배포 가능 (US1 완성)
2. **Phase 4 추가** → 오류 처리 개선
3. **Phase 5 추가** → 사용성 향상
4. **Phase 6 추가** → 프로덕션 준비 완료

**Parallel Execution**: `[P]` 마커가 있는 작업은 병렬로 실행 가능 (다른 파일 작업, 의존성 없음)

---

## Phase 1: Setup

**Goal**: 프로젝트 초기화 및 개발 환경 구성

**Duration**: ~30분

### Tasks

- [X] T001 Create Vite + React + TypeScript project using `pnpm create vite github-profile-card --template react-ts`
- [X] T002 Install base dependencies: `pnpm install`
- [X] T003 [P] Install Tailwind CSS 3.x and plugins: `pnpm add -D tailwindcss@3 postcss autoprefixer && pnpx tailwindcss init -p` (중요: 4.x 사용 불가)
- [X] T004 [P] Install Zod for runtime validation: `pnpm add zod`
- [X] T005 [P] Install testing libraries (optional): `pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
- [X] T006 Configure Tailwind CSS in `tailwind.config.js` with content paths
- [X] T007 Update `src/index.css` with Tailwind directives (@tailwind base/components/utilities)
- [X] T008 Update `tsconfig.json` to enable TypeScript strict mode and path aliases
- [X] T009 Create directory structure: `src/components`, `src/services`, `src/types`, `src/hooks`, `tests/components`, `tests/services`, `tests/integration`
- [X] T010 Create placeholder avatar SVG in `public/placeholder-avatar.svg`

**Acceptance Criteria**:
- ✅ `pnpm dev` starts development server without errors
- ✅ TypeScript strict mode enabled in `tsconfig.json`
- ✅ Tailwind CSS compiles correctly
- ✅ All project directories created

---

## Phase 2: Foundational

**Goal**: 공통 인프라 및 유틸리티 구현 (모든 사용자 스토리의 전제조건)

**Duration**: ~45분

**Dependencies**: Phase 1 완료

### Tasks

- [X] T011 Define GitHubUser and ApiError types with Zod schema in `src/types/github.ts`
- [X] T012 [P] Implement formatNumber utility function in `src/services/formatters.ts` (FR-016: comma separator, abbreviation)
- [X] T013 [P] Implement githubApi.getUser service with 3-second timeout in `src/services/githubApi.ts` (FR-012: AbortController)
- [X] T014 Implement useGitHubUser custom hook in `src/hooks/useGitHubUser.ts` with loading/error/user state
- [X] T015 Create basic App.tsx structure with main layout and Tailwind classes

**Acceptance Criteria**:
- ✅ GitHubUserSchema validates API responses correctly (Zod parse)
- ✅ formatNumber handles numbers < 1M (comma) and >= 1M (M suffix) per FR-016
- ✅ githubApi.getUser implements 3-second timeout with AbortController
- ✅ useGitHubUser hook manages state transitions (initial → loading → success/error)
- ✅ TypeScript compiles without errors (strict mode)

**Foundational Test** (if testing enabled):
```typescript
// tests/services/githubApi.test.ts
test('fetchUser returns valid GitHubUser for "octocat"')
test('fetchUser times out after 3 seconds')
test('formatNumber formats 1234 as "1,234"')
test('formatNumber formats 1000000 as "1.0M"')
```

---

## Phase 3: User Story 1 - 기본 프로필 조회 (P1)

**Goal**: GitHub 아이디를 입력하여 프로필 카드를 조회하고 7가지 정보를 표시하는 MVP 기능 구현

**Priority**: P1 (최고 우선순위 - MVP)

**Dependencies**: Phase 2 완료

**Duration**: ~2시간

**Independent Test Criteria**:
- ✅ 사용자가 "octocat"을 입력하고 버튼 클릭 시 프로필 카드 표시
- ✅ 7가지 정보 모두 표시: 아바타, 이름, 아이디(링크), 자기소개, 팔로워, 팔로잉, 레포지토리
- ✅ 아이디 링크 클릭 시 GitHub 프로필 페이지로 이동
- ✅ 3초 이내에 결과 표시 (SC-001)
- ✅ 프로필 카드가 새 검색 또는 새로고침까지 유지됨 (FR-013)

### Tasks

- [X] T016 [US1] Implement SearchInput component in `src/components/SearchInput.tsx` with input field, button, form submission (FR-001, FR-002)
- [X] T017 [P] [US1] Implement LoadingSpinner component in `src/components/LoadingSpinner.tsx` with accessibility (aria-busy)
- [X] T018 [P] [US1] Implement Avatar component in `src/components/Avatar.tsx` with image load error handling and placeholder (FR-015)
- [X] T019 [P] [US1] Implement StatItem component in `src/components/StatItem.tsx` to display follower/following/repos with formatNumber
- [X] T020 [US1] Implement ProfileCard component in `src/components/ProfileCard.tsx` displaying 7 fields with StatItem, Avatar, and profile link (FR-004, FR-005)
- [X] T021 [US1] Integrate all components in App.tsx using useGitHubUser hook, handle loading state, display ProfileCard on success

**Acceptance Criteria** (User Story 1):
1. **Given** 사용자가 빈 입력 필드가 있는 페이지에 접속했을 때, **When** "octocat"를 입력하고 조회 버튼을 클릭하면, **Then** 프로필 카드가 3초 이내에 표시되고 7가지 정보(아바타, 이름, 아이디 링크, 자기소개, 팔로워 수, 팔로잉 수, 공개 레포지토리 개수)가 모두 포함됨
2. **Given** 프로필 카드가 표시된 상태에서, **When** 아이디 링크(@login)를 클릭하면, **Then** 새 탭에서 `https://github.com/octocat`로 이동
3. **Given** 프로필이 표시된 상태에서, **When** 다른 아이디를 입력하지 않으면, **Then** 프로필 카드가 계속 표시됨 (FR-013)

**Component Test Examples** (if testing enabled):
```typescript
// tests/components/SearchInput.test.tsx
test('SearchInput renders input and button')
test('SearchInput calls onSearch when button clicked')

// tests/components/ProfileCard.test.tsx
test('ProfileCard displays all 7 fields correctly')
test('ProfileCard formats numbers with formatNumber')
test('ProfileCard link points to correct GitHub URL')
```

**Integration Test** (if testing enabled):
```typescript
// tests/integration/ProfileSearch.test.tsx
test('User can search for "octocat" and see profile card')
test('Profile link opens correct GitHub URL')
```

**Parallel Execution Example** (US1):
```bash
# 병렬 실행 가능 (T017, T018, T019는 독립적인 컴포넌트)
Task T017 (LoadingSpinner) || Task T018 (Avatar) || Task T019 (StatItem)
```

---

## Phase 4: User Story 2 - 오류 처리 및 사용자 피드백 (P2)

**Goal**: 존재하지 않는 사용자, 네트워크 오류, API 제한 등의 오류를 사용자 친화적으로 처리

**Priority**: P2

**Dependencies**: Phase 3 완료 (US1 구현 완료)

**Duration**: ~1시간

**Independent Test Criteria**:
- ✅ 존재하지 않는 사용자 입력 시 명확한 오류 메시지 표시
- ✅ 네트워크 오류 발생 시 재시도 옵션 제공
- ✅ API 호출 중 로딩 인디케이터 표시 및 버튼 비활성화

### Tasks

- [X] T022 [P] [US2] Implement ErrorMessage component in `src/components/ErrorMessage.tsx` with error types and retry button (FR-006, FR-008)
- [X] T023 [P] [US2] Add error state handling to App.tsx, display ErrorMessage when error occurs
- [X] T024 [US2] Update SearchInput to disable button during loading, show visual feedback (FR-007: button disabled, aria-busy)

**Acceptance Criteria** (User Story 2):
1. **Given** 사용자가 존재하지 않는 아이디를 입력했을 때, **When** 조회 버튼을 클릭하면, **Then** "해당 사용자를 찾을 수 없습니다" 메시지 표시
2. **Given** API 호출이 진행 중일 때, **When** 로딩 상태이면, **Then** 로딩 인디케이터가 표시되고 버튼이 비활성화됨
3. **Given** 네트워크 오류가 발생했을 때, **When** 오류를 감지하면, **Then** "네트워크 오류가 발생했습니다. 다시 시도해주세요" 메시지와 재시도 버튼 표시

**Component Test** (if testing enabled):
```typescript
// tests/components/ErrorMessage.test.tsx
test('ErrorMessage displays correct message for 404 error')
test('ErrorMessage shows retry button for network errors')
test('ErrorMessage calls onRetry when retry button clicked')
```

**Integration Test** (if testing enabled):
```typescript
// tests/integration/ErrorHandling.test.tsx
test('Displays error message for non-existent user')
test('Shows loading spinner during API call')
test('Retry button re-fetches user data')
```

**Parallel Execution Example** (US2):
```bash
# 병렬 실행 가능 (T022, T023은 독립적)
Task T022 (ErrorMessage component) || Task T023 (App.tsx error handling)
```

---

## Phase 5: User Story 3 - 입력 편의성 개선 (P3)

**Goal**: Enter 키 지원, 빈 입력 검증으로 사용성 향상

**Priority**: P3

**Dependencies**: Phase 4 완료 (US2 구현 완료)

**Duration**: ~30분

**Independent Test Criteria**:
- ✅ Enter 키를 눌러도 검색 실행됨
- ✅ 빈 입력 시 API 호출 없이 안내 메시지 표시
- ✅ 플레이스홀더 텍스트 표시

### Tasks

- [X] T025 [P] [US3] Update SearchInput to handle Enter key press for form submission (FR-010)
- [X] T026 [US3] Add client-side validation in useGitHubUser: check for empty input, display validation error without API call (FR-009)

**Acceptance Criteria** (User Story 3):
1. **Given** 사용자가 유효한 아이디를 입력했을 때, **When** Enter 키를 누르면, **Then** 버튼 클릭과 동일하게 프로필 카드 표시
2. **Given** 입력 필드가 비어있을 때, **When** 버튼 클릭 또는 Enter 키를 누르면, **Then** "GitHub 아이디를 입력해주세요" 메시지 표시 (API 호출 없음)
3. **Given** 입력 필드를 포커스했을 때, **When** 필드가 비어있으면, **Then** "GitHub 아이디를 입력하세요" 플레이스홀더 표시

**Component Test** (if testing enabled):
```typescript
// tests/components/SearchInput.test.tsx
test('SearchInput submits on Enter key press')
test('SearchInput shows placeholder text')
```

**Integration Test** (if testing enabled):
```typescript
// tests/integration/InputValidation.test.tsx
test('Empty input shows validation error without API call')
test('Enter key triggers search')
```

**Parallel Execution Example** (US3):
```bash
# 병렬 실행 가능 (T025, T026은 독립적)
Task T025 (Enter key) || Task T026 (Validation)
```

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: 접근성, 반응형 디자인, 성능 최적화 등 프로덕션 준비

**Duration**: ~1.5시간

**Dependencies**: Phase 5 완료 (모든 User Stories 구현 완료)

### Tasks

- [X] T027 [P] Add responsive design with Tailwind breakpoints (mobile: 375px, tablet: 768px, desktop: 1280px+) to all components
- [X] T028 [P] Add keyboard navigation support: Tab order (Input → Button → Profile Link), Escape to close errors, ARIA attributes
- [X] T029 Verify color contrast ratios (4.5:1 minimum) using browser DevTools or axe DevTools
- [X] T030 Run Lighthouse audit and optimize: FCP < 1.5s, LCP < 2.5s, CLS < 0.1, Accessibility 90+

**Acceptance Criteria**:
- ✅ UI는 모바일(375px), 태블릿(768px), 데스크톱(1280px+)에서 정상 작동
- ✅ Tab 키로 모든 인터랙티브 요소 접근 가능
- ✅ 스크린 리더로 모든 컨텐츠 읽기 가능 (ARIA labels)
- ✅ Lighthouse Performance, Accessibility, Best Practices 점수 90+ 목표

**Accessibility Checklist**:
```markdown
- [ ] Semantic HTML (form, button, article, img with alt)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] ARIA attributes (aria-label, aria-live, aria-busy)
- [ ] Color contrast 4.5:1+
- [ ] Screen reader compatible
```

**Performance Checklist**:
```markdown
- [ ] FCP < 1.5s (Vite fast build)
- [ ] LCP < 2.5s (image lazy loading)
- [ ] CLS < 0.1 (reserved space for profile card)
- [ ] Bundle size < 200KB gzip
```

**Parallel Execution Example** (Polish):
```bash
# 병렬 실행 가능
Task T027 (Responsive design) || Task T028 (Keyboard navigation)
```

---

## Dependency Graph

### User Story Completion Order

```
Phase 1: Setup
    ↓
Phase 2: Foundational (Types, Services, Hooks)
    ↓
Phase 3: US1 (P1) - 기본 프로필 조회 ← MVP COMPLETE
    ↓
Phase 4: US2 (P2) - 오류 처리 ← depends on US1
    ↓
Phase 5: US3 (P3) - 입력 편의성 ← depends on US2 (or can be parallel to US2)
    ↓
Phase 6: Polish & Cross-Cutting
```

**Parallel Opportunities**:
- US2와 US3은 **거의 독립적** (US3는 US1만 있으면 구현 가능)
- 원한다면 US2와 US3를 병렬로 구현 가능:
  ```
  Phase 3: US1 완료
       ↓
    ┌──┴──┐
  US2    US3  (병렬)
    └──┬──┘
  Phase 6: Polish
  ```

### Task Dependencies (Detailed)

**Setup → Foundational**:
- T001-T010 (Setup) → T011-T015 (Foundational)

**Foundational → US1**:
- T011 (Types) → T013 (API Service) → T014 (Hook)
- T012 (Formatters) → T019 (StatItem)
- T014 (Hook) → T021 (App integration)

**US1 → US2**:
- T021 (App.tsx with ProfileCard) → T023 (Add error handling to App)

**US2 → US3**:
- T014 (useGitHubUser hook) → T026 (Add validation)

**All Stories → Polish**:
- T016-T026 (All components) → T027-T030 (Polish)

---

## Validation & Quality Gates

### Pre-Commit Checklist

- [ ] TypeScript compiles without errors (`pnpm tsc --noEmit`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] Prettier formatting applied (`pnpm format`)
- [ ] All tests pass (if testing enabled: `pnpm test`)

### Pre-Deployment Checklist

- [ ] All user stories (US1, US2, US3) independently testable
- [ ] All functional requirements (FR-001 ~ FR-016) implemented
- [ ] All success criteria (SC-001 ~ SC-005) met
- [ ] Constitution principles (I-V) validated
- [ ] Lighthouse scores: Performance 90+, Accessibility 90+, Best Practices 90+
- [ ] Manual testing on Chrome, Firefox, Safari
- [ ] Keyboard navigation verified
- [ ] Screen reader compatibility verified (optional but recommended)

---

## References

- **Specification**: [spec.md](./spec.md) - User stories and requirements
- **Implementation Plan**: [plan.md](./plan.md) - Tech stack and architecture
- **Data Model**: [data-model.md](./data-model.md) - TypeScript types and Zod schemas
- **API Contract**: [contracts/github-api.openapi.yaml](./contracts/github-api.openapi.yaml) - GitHub API specification
- **Quick Start**: [quickstart.md](./quickstart.md) - Development setup guide
- **Research**: [research.md](./research.md) - Technology decisions

---

## Notes

**MVP Definition**: Phase 1-3 완료 시 MVP 배포 가능 (US1만 구현)

**Test Strategy**: 테스트는 선택사항입니다. TDD를 원하면 각 Phase의 Test Examples를 참고하여 테스트를 먼저 작성하세요.

**Parallel Execution**: `[P]` 마커가 있는 작업은 병렬 실행 가능합니다. 예:
- Phase 1: T003, T004, T005 병렬
- Phase 2: T012, T013 병렬
- Phase 3: T017, T018, T019 병렬
- Phase 4: T022, T023 병렬
- Phase 5: T025, T026 병렬
- Phase 6: T027, T028 병렬

**Estimated Total Time**:
- Setup: 30분
- Foundational: 45분
- US1: 2시간
- US2: 1시간
- US3: 30분
- Polish: 1.5시간
- **Total: ~6.25시간** (병렬 실행 시 ~5시간)
