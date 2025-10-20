# Data Model: GitHub 프로필 카드 조회

**Feature**: GitHub 프로필 카드 조회
**Date**: 2025-10-20
**Status**: Complete

## Overview

이 문서는 GitHub 프로필 카드 조회 기능에서 사용하는 데이터 모델을 정의합니다. 모든 타입은 TypeScript로 명시되며, Zod 스키마를 사용하여 런타임 검증을 수행합니다.

## Entities

### 1. GitHubUser

GitHub 사용자 프로필 정보를 나타내는 핵심 엔티티입니다.

**Source**: GitHub REST API v3 `/users/{username}` endpoint

**TypeScript Interface**:
```typescript
export interface GitHubUser {
  login: string;              // GitHub 로그인 아이디 (@login)
  name: string | null;        // 사용자 이름 (설정하지 않은 경우 null)
  avatar_url: string;         // 프로필 이미지 URL
  bio: string | null;         // 자기소개 (설정하지 않은 경우 null)
  followers: number;          // 팔로워 수
  following: number;          // 팔로잉 수
  public_repos: number;       // 공개 레포지토리 개수
  html_url: string;           // GitHub 프로필 페이지 URL
}
```

**Zod Schema** (런타임 검증):
```typescript
import { z } from 'zod';

export const GitHubUserSchema = z.object({
  login: z.string().min(1),
  name: z.string().nullable(),
  avatar_url: z.string().url(),
  bio: z.string().nullable(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
  public_repos: z.number().int().nonnegative(),
  html_url: z.string().url(),
});

export type GitHubUser = z.infer<typeof GitHubUserSchema>;
```

**Validation Rules**:
- `login`: 필수, 최소 1자
- `name`: 선택적 (null 허용)
- `avatar_url`: 필수, 유효한 URL 형식
- `bio`: 선택적 (null 허용)
- `followers`: 필수, 0 이상의 정수
- `following`: 필수, 0 이상의 정수
- `public_repos`: 필수, 0 이상의 정수
- `html_url`: 필수, 유효한 URL 형식

**Field Mapping** (사양서 요구사항 → API 필드):
| 요구사항                  | API 필드       | 타입           | 필수 여부 |
| ------------------------- | -------------- | -------------- | --------- |
| 사용자 아바타             | `avatar_url`   | string (URL)   | 필수      |
| 이름                      | `name`         | string \| null | 선택적    |
| 아이디 (@login)           | `login`        | string         | 필수      |
| 자기소개                  | `bio`          | string \| null | 선택적    |
| 팔로워 수                 | `followers`    | number         | 필수      |
| 팔로잉 수                 | `following`    | number         | 필수      |
| 공개 레포지토리 개수      | `public_repos` | number         | 필수      |

**Relationships**: 없음 (단일 엔티티 조회)

### 2. ApiError

API 호출 중 발생하는 오류를 나타내는 엔티티입니다.

**TypeScript Interface**:
```typescript
export interface ApiError {
  type: 'not_found' | 'rate_limit' | 'network' | 'validation' | 'unknown';
  message: string;
  statusCode?: number;
}
```

**Error Type Mapping**:
| 오류 타입       | HTTP Status | 사용자 메시지                                                         |
| --------------- | ----------- | --------------------------------------------------------------------- |
| `not_found`     | 404         | "해당 사용자를 찾을 수 없습니다"                                      |
| `rate_limit`    | 403         | "일시적으로 요청이 제한되었습니다. 잠시 후 다시 시도해주세요"         |
| `network`       | N/A         | "네트워크 오류가 발생했습니다. 다시 시도해주세요"                     |
| `validation`    | N/A         | "잘못된 GitHub 아이디입니다"                                          |
| `unknown`       | Other       | "알 수 없는 오류가 발생했습니다"                                      |

**Validation Rules**:
- `type`: 5가지 오류 타입 중 하나 (enum)
- `message`: 필수, 사용자에게 표시할 오류 메시지
- `statusCode`: 선택적, HTTP 상태 코드

## State Transitions

### Application State Flow

```
┌─────────────┐
│   Initial   │ (빈 검색 필드, 프로필 카드 없음)
└─────┬───────┘
      │ User enters username + clicks button
      ▼
┌─────────────┐
│   Loading   │ (로딩 인디케이터 표시, 버튼 비활성화)
└─────┬───────┘
      │
      ├─── API Success ──────┐
      │                      ▼
      │              ┌───────────────┐
      │              │  Profile      │ (프로필 카드 표시,
      │              │  Displayed    │  검색어 유지)
      │              └───────┬───────┘
      │                      │
      │                      │ User searches again
      │                      └──────────────┐
      │                                     │
      └─── API Error ────────┐              │
                             ▼              │
                    ┌────────────────┐      │
                    │  Error         │      │
                    │  Displayed     │      │
                    └────────┬───────┘      │
                             │              │
                             └──────┐       │
                                    ▼       ▼
                             ┌─────────────┐
                             │  Loading    │ (다시 검색)
                             └─────────────┘
```

**States**:
1. **Initial**: 초기 상태, 프로필 카드 없음
2. **Loading**: API 호출 중, 로딩 인디케이터 표시
3. **Profile Displayed**: 프로필 카드 표시 (성공)
4. **Error Displayed**: 오류 메시지 표시 (실패)

**Transitions**:
- `Initial → Loading`: 사용자가 아이디 입력 후 검색 버튼 클릭
- `Loading → Profile Displayed`: API 호출 성공
- `Loading → Error Displayed`: API 호출 실패
- `Profile Displayed → Loading`: 사용자가 다시 검색
- `Error Displayed → Loading`: 사용자가 재시도

## Data Flow

### Fetch Profile Flow

```
┌─────────────┐
│ SearchInput │ → User enters "octocat"
└──────┬──────┘
       │ onClick
       ▼
┌──────────────────┐
│ useGitHubUser    │ → setState({ loading: true, error: null })
│ (Custom Hook)    │
└──────┬───────────┘
       │ fetchUser("octocat")
       ▼
┌──────────────────┐
│ githubApi        │ → fetch("https://api.github.com/users/octocat")
│ (Service)        │    with 3-second timeout (AbortController)
└──────┬───────────┘
       │
       ├─── Success ─────────┐
       │                     ▼
       │              ┌──────────────┐
       │              │ Zod Schema   │ → Validate response
       │              │ Validation   │
       │              └──────┬───────┘
       │                     │ Valid
       │                     ▼
       │              ┌──────────────┐
       │              │ setState     │ → { user: GitHubUser, loading: false }
       │              └──────┬───────┘
       │                     │
       │                     ▼
       │              ┌──────────────┐
       │              │ ProfileCard  │ → Render profile with formatters
       │              └──────────────┘
       │
       └─── Error ───────────┐
                             ▼
                      ┌──────────────┐
                      │ Error        │ → Map status code to ApiError
                      │ Handling     │
                      └──────┬───────┘
                             │
                             ▼
                      ┌──────────────┐
                      │ setState     │ → { error: string, loading: false }
                      └──────┬───────┘
                             │
                             ▼
                      ┌──────────────┐
                      │ ErrorMessage │ → Display user-friendly message
                      └──────────────┘
```

## Data Formatting

### Number Formatting (FR-016 요구사항)

**Function Signature**:
```typescript
function formatNumber(num: number): string
```

**Logic**:
```typescript
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    const millions = num / 1_000_000;
    return millions.toFixed(1) + 'M';  // 1.2M, 5.8M
  }
  return num.toLocaleString('en-US');  // 1,234
}
```

**Examples**:
| Input       | Output   |
| ----------- | -------- |
| 123         | "123"    |
| 1234        | "1,234"  |
| 999999      | "999,999"|
| 1000000     | "1.0M"   |
| 1234567     | "1.2M"   |
| 5800000     | "5.8M"   |

### String Formatting

**Profile Link**:
```typescript
// GitHub 프로필 URL 생성
const profileUrl = `https://github.com/${user.login}`;
```

**Display Name** (이름 없을 때):
```typescript
// 이름이 null이면 login 사용
const displayName = user.name ?? user.login;
```

**Bio Display** (자기소개 없을 때):
```typescript
// bio가 null이면 빈 상태 또는 "정보 없음" 표시
const bioText = user.bio ?? "";  // 또는 "정보 없음"
```

## Storage

**저장소 유형**: N/A (클라이언트 상태 관리만 사용)

**이유**: 사양서 가정사항에 따라 "프로필 카드는 최신 정보를 표시하며, 캐싱이나 데이터 저장은 고려하지 않는다"

**State Management**:
- React의 `useState` 훅 사용
- 전역 상태 관리 라이브러리 불필요 (단일 컴포넌트 계층)

## Constraints

### GitHub API Constraints

1. **Rate Limiting**:
   - 비인증 요청: 시간당 60회
   - 인증 요청: 시간당 5000회
   - **현재 구현**: 비인증 요청 (사양서 가정사항)

2. **Timeout**:
   - 클라이언트 측 타임아웃: 3초 (FR-012)
   - GitHub API 타임아웃: 약 10초 (서버 측)

3. **Response Size**:
   - 일반적으로 < 5KB (단일 사용자 정보)

### Data Validation Constraints

1. **Username Validation**:
   - 허용 문자: 영문자, 숫자, 하이픈 (-)
   - 최대 길이: 39자
   - 정규식: `/^[a-zA-Z0-9-]+$/`

2. **Image URL**:
   - 항상 HTTPS
   - GitHub CDN 도메인 (avatars.githubusercontent.com)

3. **Numbers**:
   - 모두 0 이상의 정수
   - 최대값: 이론적으로 무제한 (실제로는 수백만 이하)

## References

1. [GitHub REST API - Get a user](https://docs.github.com/en/rest/users/users#get-a-user)
2. [GitHub API Rate limiting](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)
3. [Zod Documentation](https://zod.dev/)
