# Quick Start: GitHub 프로필 카드 조회

**Feature**: GitHub 프로필 카드 조회
**Date**: 2025-10-20
**Target Audience**: 개발자

## Prerequisites

시작하기 전에 다음 도구들이 설치되어 있어야 합니다:

- **Node.js**: 18.x 이상 ([다운로드](https://nodejs.org/))
- **pnpm**: 8.x 이상 (권장) 또는 npm 9.x 이상
  ```bash
  npm install -g pnpm
  ```
- **Git**: 최신 버전
- **Code Editor**: VS Code 권장 (TypeScript, ESLint, Prettier 확장 포함)

## 1. 프로젝트 초기 설정

### 1.1 Vite + React + TypeScript 프로젝트 생성

```bash
# pnpm 사용
pnpm create vite github-profile-card --template react-ts

# 또는 npm 사용
npm create vite@latest github-profile-card -- --template react-ts

# 프로젝트 디렉토리로 이동
cd github-profile-card
```

### 1.2 의존성 설치

```bash
# pnpm 사용
pnpm install

# 또는 npm 사용
npm install
```

### 1.3 추가 라이브러리 설치

```bash
# Tailwind CSS 3.x + 필수 플러그인 (중요: 4.x는 호환성 문제로 사용 불가)
pnpm add -D tailwindcss@3 postcss autoprefixer

# Tailwind 초기화
pnpx tailwindcss init -p

# Zod (타입 검증)
pnpm add zod

# 테스트 도구 (선택적)
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## 2. Tailwind CSS 설정

### 2.1 `tailwind.config.js` 수정

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 2.2 `src/index.css` 업데이트

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 3. TypeScript 설정

### 3.1 `tsconfig.json` 업데이트 (Strict Mode 활성화)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting - Strict Mode */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path Mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 4. 프로젝트 구조 생성

```bash
# 디렉토리 구조 생성
mkdir -p src/components src/services src/types src/hooks tests/components tests/services tests/integration

# 플레이스홀더 아바타 준비 (나중에 실제 SVG 파일로 교체)
mkdir -p public
```

## 5. 핵심 파일 생성

### 5.1 타입 정의: `src/types/github.ts`

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

export interface ApiError {
  type: 'not_found' | 'rate_limit' | 'network' | 'validation' | 'unknown';
  message: string;
  statusCode?: number;
}
```

### 5.2 숫자 포맷터: `src/services/formatters.ts`

```typescript
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    const millions = num / 1_000_000;
    return millions.toFixed(1) + 'M';
  }
  return num.toLocaleString('en-US');
}
```

### 5.3 GitHub API 서비스: `src/services/githubApi.ts`

```typescript
import { GitHubUser, GitHubUserSchema, ApiError } from '../types/github';

export const githubApi = {
  async getUser(username: string): Promise<GitHubUser> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(
        `https://api.github.com/users/${username}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('사용자를 찾을 수 없습니다');
        }
        if (response.status === 403) {
          throw new Error('일시적으로 요청이 제한되었습니다. 잠시 후 다시 시도해주세요');
        }
        throw new Error('네트워크 오류가 발생했습니다');
      }

      const data = await response.json();
      return GitHubUserSchema.parse(data);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('네트워크 오류가 발생했습니다. 다시 시도해주세요');
        }
        throw error;
      }
      throw new Error('알 수 없는 오류가 발생했습니다');
    } finally {
      clearTimeout(timeoutId);
    }
  },
};
```

### 5.4 커스텀 훅: `src/hooks/useGitHubUser.ts`

```typescript
import { useState, useCallback } from 'react';
import { GitHubUser } from '../types/github';
import { githubApi } from '../services/githubApi';

export function useGitHubUser() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (username: string) => {
    if (!username.trim()) {
      setError('GitHub 아이디를 입력해주세요');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await githubApi.getUser(username);
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, fetchUser };
}
```

## 6. 개발 서버 실행

```bash
# 개발 서버 시작
pnpm dev

# 브라우저에서 http://localhost:5173 접속
```

## 7. 테스트 실행 (선택적)

### 7.1 `vitest.config.ts` 생성

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
});
```

### 7.2 `tests/setup.ts` 생성

```typescript
import '@testing-library/jest-dom';
```

### 7.3 테스트 실행

```bash
# 단위 테스트 실행
pnpm test

# 커버리지 포함
pnpm test --coverage
```

## 8. 빌드 및 프리뷰

```bash
# 프로덕션 빌드
pnpm build

# 빌드 결과 프리뷰
pnpm preview
```

## 9. 다음 단계

핵심 인프라가 준비되었으니 이제 다음 작업을 진행합니다:

1. **컴포넌트 구현**:
   - `SearchInput.tsx`: 검색 입력 필드 + 버튼
   - `ProfileCard.tsx`: 프로필 카드 메인 컴포넌트
   - `Avatar.tsx`: 프로필 이미지 (플레이스홀더 포함)
   - `StatItem.tsx`: 통계 항목
   - `ErrorMessage.tsx`: 오류 메시지
   - `LoadingSpinner.tsx`: 로딩 인디케이터

2. **App.tsx 통합**: 모든 컴포넌트를 조립하여 완전한 기능 구현

3. **테스트 작성**: 각 컴포넌트 및 서비스에 대한 단위 테스트

4. **접근성 검증**: 키보드 네비게이션 및 ARIA 속성 확인

5. **성능 최적화**: Lighthouse 점수 확인 및 최적화

## 10. 유용한 명령어

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 타입 체크
pnpm tsc --noEmit

# 린트 검사
pnpm lint

# 테스트 실행
pnpm test

# 빌드
pnpm build

# 빌드 결과 프리뷰
pnpm preview
```

## 11. 문제 해결

### TypeScript 오류가 발생하는 경우

```bash
# TypeScript 캐시 삭제
rm -rf node_modules/.vite

# 의존성 재설치
pnpm install
```

### Tailwind CSS가 적용되지 않는 경우

1. **Tailwind CSS 버전 확인**: 반드시 3.x 버전이어야 합니다
   ```bash
   # package.json에서 확인
   grep "tailwindcss" package.json

   # 4.x가 설치된 경우 3.x로 다운그레이드
   npm remove tailwindcss @tailwindcss/postcss
   npm add -D tailwindcss@3 postcss autoprefixer
   ```

2. **PostCSS 설정 확인**: `postcss.config.js`가 Tailwind 3.x 형식인지 확인
   ```javascript
   // 올바른 설정 (Tailwind 3.x)
   export default {
     plugins: {
       tailwindcss: {},      // 'tailwindcss' 사용
       autoprefixer: {},
     },
   }

   // 잘못된 설정 (Tailwind 4.x)
   export default {
     plugins: {
       '@tailwindcss/postcss': {},  // 4.x용 플러그인 - 사용 불가
       autoprefixer: {},
     },
   }
   ```

3. `index.css`에 Tailwind directives가 있는지 확인
4. `main.tsx`에서 `index.css`를 import하는지 확인
5. `tailwind.config.js`의 content 경로 확인

**중요**: Tailwind CSS 4.x는 새로운 엔진을 사용하며 현재 호환성 문제가 있습니다. 반드시 3.x 버전을 사용하세요.

### CORS 오류가 발생하는 경우

GitHub API는 CORS를 지원하므로 정상적으로 호출 가능합니다. CORS 오류가 발생한다면:
- 브라우저 콘솔에서 정확한 오류 메시지 확인
- 네트워크 탭에서 요청 헤더 확인
- GitHub API URL이 정확한지 확인 (`https://api.github.com/users/{username}`)

## References

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [GitHub REST API](https://docs.github.com/en/rest)
