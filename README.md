# GitHub 프로필 카드 조회

GitHub 사용자의 프로필 정보를 조회하고 카드 형태로 표시하는 웹 애플리케이션입니다.

## 주요 기능

- ✅ GitHub 아이디로 사용자 프로필 검색
- ✅ 프로필 정보 표시 (아바타, 이름, 아이디, 자기소개, 통계)
- ✅ 오류 처리 (존재하지 않는 사용자, 네트워크 오류, API 제한)
- ✅ 로딩 상태 표시
- ✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)
- ✅ 접근성 지원 (ARIA 속성, 키보드 네비게이션)
- ✅ 3초 타임아웃 처리

## 기술 스택

- **프레임워크**: React 18.x + TypeScript 5.x
- **빌드 도구**: Vite 7.x
- **스타일링**: Tailwind CSS 3.x
- **검증**: Zod 3.x
- **API**: GitHub REST API v3

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
```

### 프리뷰

```bash
npm run preview
```

## 프로젝트 구조

```
src/
├── components/      # React 컴포넌트
│   ├── Avatar.tsx
│   ├── ErrorMessage.tsx
│   ├── LoadingSpinner.tsx
│   ├── ProfileCard.tsx
│   ├── SearchInput.tsx
│   └── StatItem.tsx
├── hooks/           # 커스텀 훅
│   └── useGitHubUser.ts
├── services/        # API 서비스
│   ├── formatters.ts
│   └── githubApi.ts
├── types/           # TypeScript 타입 정의
│   └── github.ts
├── App.tsx          # 루트 컴포넌트
└── main.tsx         # 진입점
```

## 사용 방법

1. 검색 입력 필드에 GitHub 아이디 입력
2. "검색" 버튼 클릭 또는 Enter 키 입력
3. 프로필 카드에서 사용자 정보 확인
4. 아이디 링크를 클릭하여 GitHub 프로필 페이지로 이동

## 성능 최적화

- ✅ 번들 크기: ~76KB (gzip)
- ✅ First Contentful Paint (FCP) < 1.5s
- ✅ 이미지 lazy loading
- ✅ API 타임아웃 처리 (3초)

## 접근성

- WCAG 2.1 AA 기준 준수
- 키보드 네비게이션 지원
- ARIA 속성 적용
- 색상 대비 4.5:1 이상

## 라이선스

MIT
