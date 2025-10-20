# 🚀 실전 AI 개발 워크숍: GitHub 프로필 카드 생성기 만들기

## [실습단계]소개

안녕하세요! 지피터스 프로덕트팀 실습 워크숍에 오신 것을 환영합니다.

혹시 AI에게 '알아서 잘 만들어줘'라고 했다가, 전혀 다른 결과물을 받고 당황한 경험이 있으신가요? 🤯

오늘 우리는 이 'Vibe 코딩'의 한계를 넘어서기 위한 강력한 도구, **GitHub Spec Kit**을 만나봅니다.

### GitHub Spec Kit이란?

GitHub Spec Kit은 쉽게 말해, **AI를 위한 정교한 설계도 - Blueprint**를 만드는 도구입니다. 우리가 머릿속으로 생각하는 추상적인 아이디어를, AI가 명확하게 이해하고 코드로 구현할 수 있는 구체적인 '명세'와 '계획'으로 바꿔주는 역할을 하죠.

### 왜 Spec Kit을 사용할까요?

이미 AI와 협업하며 '바이브 코딩'을 해보신 분들은, 좋은 결과를 얻기 위해 결국엔 명확한 명세와 계획을 세워 요청해야 한다는 것을 경험으로 알고 계실 겁니다. GitHub Spec Kit은 바로 이 과정을 **명시적인 프레임워크**로 만들어, 누구나 체계적으로 AI와의 협업을 이끌어낼 수 있도록 돕는 도구입니다.

1.  **추측이 아닌 설계:** '대충' 지시하는 대신, 우리가 만들고 싶은 기능의 명세(`spec`)와 계획(`plan`)을 먼저 정의합니다.
2.  **예측 가능한 결과:** 명확한 설계도가 있으니, AI의 '창의적인' 해석(할루시네이션)을 줄이고, 우리가 **의도한 결과물**을 꾸준히 얻게 됩니다.
3.  **진정한 협업:** 우리는 코드를 한 줄씩 부탁하는 '요청자'가 아니라, 전체 프로젝트를 지휘하는 **설계자 - Architect**가 되고, AI는 그 설계도를 충실히 따르는 **개발자 - Developer**가 됩니다.

결론적으로, Spec Kit은 **우리의 생각을 AI가 가장 잘 이해하는 형태로 번역**해주는 최고의 소통 도구입니다.

### 더 알아보기

  1. **[GitHub Spec Kit 공식 홈페이지](https://github.com/github/spec-kit)**
  2. **[GitHub Spec Kit 개발자 유튜브 채널](https://www.youtube.com/@DenDev)**

자, 그럼 이제 이 강력한 도구로 우리의 첫 번째 프로젝트를 시작해볼까요?

**오늘의 최종 목표:**
![GitHub 프로필 카드 생성기 예시 이미지](https://github.com/taemyung-heo/github-profile-card/raw/main/images/001_final_result.png)
*(실제 결과물은 스타일에 따라 다를 수 있습니다)*

**[최종 결과물 GitHub Repository](https://github.com/taemyung-heo/github-profile-card)**

---

## [실습단계]실습 환경 최종 점검

워크숍을 시작하기 전에, 아래 준비물이 모두 완료되었는지 마지막으로 확인해주세요.

1. [ ] **VS Code (또는 Cursor)** 가 실행되어 있습니다.
2. [ ] **Git**이 설치되어 있고, **GitHub 계정**에 로그인되어 있습니다.
3. [ ] **Claude Code** 사용 환경이 준비되었습니다.
4. [ ] VS Code에서 터미널을 열었습니다.

---

## [실습단계]프로젝트 생성

> GitHub Spec Kit을 사용하여 새로운 프로젝트를 생성하는 단계입니다. 프로젝트 디렉토리가 자동으로 생성되고, 필요한 설정 파일들이 초기화됩니다.

### 1단계: uv 설치 확인 및 설치

GitHub Spec Kit은 Python 기반 도구로, `uvx` 명령어를 사용합니다. 먼저 uv가 설치되어 있는지 확인하세요.

```bash
uv --version
```

만약 명령어를 찾을 수 없다는 오류가 나온다면, 아래 명령어로 환경에 맞게 설치하세요:

```bash
# Windows (PowerShell)
irm https://astral.sh/uv/install.ps1 | iex

# macOS (Homebrew)
brew install uv
```

### 2단계: 프로젝트 생성

💻 **실습:** 프로젝트를 생성하고 싶은 디렉토리로 이동한 후, 아래 명령어를 터미널에서 실행하세요.

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init github-profile-card
```

실행 후 나타나는 질문들에 다음과 같이 답변하세요:

1. **AI assist**: `Claude Code` 선택
2. **Script**: `Shell Script` 선택 또는 환경에 맞게 선택

![setup01](https://github.com/taemyung-heo/github-profile-card/raw/main/images/009_setup.png)
![setup02](https://github.com/taemyung-heo/github-profile-card/raw/main/images/010_setup.png)

명령어 실행이 완료되면, VS Code(또는 Cursor)에서 생성된 프로젝트 폴더를 열어주세요.

```bash
cd github-profile-card
code .  # VS Code를 사용하는 경우
```

✅ **확인:** 프로젝트 폴더가 생성되고, `.claude/`, `.specify/` 디렉토리가 존재하는지 확인하세요. `.claude/` 디렉토리에는 GitHub Spec Kit 클로드 커맨드가 저장되어 있고, `.specify/` 디렉토리에 앞으로 우리가 작성할 명세와 계획들이 저장됩니다.

## [실습단계]constitution : 프로젝트의 규칙 정의하기

> AI에게 우리가 만들 프로젝트의 기술 스택, 코딩 스타일 등 **변경되지 않을 헌법**을 알려주는 단계입니다. 이 규칙을 기반으로 AI는 일관성 있는 코드를 생성합니다.

💻 **실습:** 아래 명령어를 클로드 코드에서 복사하여 실행하세요.

```
/speckit.constitution  React, TypeScript, Tailwind CSS를 사용한 깃헙 프로필 카드 웹사이트 구축
````

![constitution](https://github.com/taemyung-heo/github-profile-card/raw/main/images/002_constitution.png)

✅ **확인:** 프로젝트 최상위 폴더에 `.specify/memory/constitution.md` 파일이 생성되었는지 확인하세요.

## [실습단계]spec : 만들고 싶은 기능 명세하기

> AI에게 **무엇을 만들고 싶은지, 어떤 기능이 필요한지** 사람에게 설명하듯 구체적으로 알려주는 가장 중요한 단계입니다.

💻 **실습:** 아래 명령어를 클로드 코드에서 복사하여 실행하세요.

```
/speckit.specify GitHub 아이디를 입력할 인풋과 버튼이 있고, 버튼을 누르면 API를 호출해 프로필 카드를 보여줘. 프로필 카드에는 아래 내용을 보여주도록 해.
- 사용자 아바타 (프로필 이미지)
- 이름 (name)
- 아이디 (@login), 이 아이디는 실제 GitHub 프로필로 연결되는 링크여야 해.
- 자기소개 (bio)
- 팔로워 수
- 팔로잉 수
- 공개 레포지토리 개수
```

![specify](https://github.com/taemyung-heo/github-profile-card/raw/main/images/003_specify.png)

✅ **확인:** `specs/001-github-profile-card/spec.md` 파일이 생성되고, 우리가 붙여넣은 내용이 잘 저장되었는지 확인하세요. 001-github-profile-card 디렉토리 이름은 다른 이름일 수 있습니다.

## [실습단계]clarify : AI와 요구사항 구체화하기

> 우리가 작성한 명세(`spec`)를 AI가 읽고, **모호하거나 궁금한 점을 우리에게 다시 질문**하는 단계입니다. 이 과정을 통해 오해를 줄이고 명세를 더욱 탄탄하게 만듭니다.

💻 **실습:** 아래 명령어를 클로드 코드에서 실행하고, AI의 질문에 자유롭게 답변해보세요.

```
/speckit.clarify
```

![clarify](https://github.com/taemyung-heo/github-profile-card/raw/main/images/004_clarify.png)

💡 **Tip:** AI가 "API 엔드포인트는 무엇을 사용할까요?" 라고 물으면 "GitHub의 공식 유저 API인 `https://api.github.com/users/` 를 사용해줘" 라고 답해주고, 스타일 관련 질문에는 "Tailwind CSS를 활용해 모던하고 깔끔한 스타일로 만들어줘" 와 같이 답변하면 좋습니다.

✅ **확인:** `specs/001-github-profile-card/spec.md` 파일이 업데이트되어 AI와의 질의응답 내용이 추가된 것을 확인하세요. 001-github-profile-card 디렉토리 이름은 다른 이름일 수 있습니다.

## [실습단계]plan : 개발 계획 자동 수립하기

> 명확해진 요구사항을 바탕으로, AI가 **Tech Lead**처럼 프로젝트의 전체적인 파일 구조와 컴포넌트 설계 등 **개발 계획 -설계도**를 수립하는 단계입니다.

💻 **실습:** 아래 명령어를 클로드 코드에서 복사해서 실행하세요.

```
/speckit.plan tailwind css는 3.x 버전 사용
```

![plan](https://github.com/taemyung-heo/github-profile-card/raw/main/images/005_plan.png)

✅ **확인:** `specs/001-github-profile-card` 디렉토리 밑에, `plan.md`, `research.md`, `data-model.md`, `quickstart.md` 등의 파일이 생성되었는지 확인하고, 파일을 열어 AI가 어떤 컴포넌트(`InputForm.tsx`, `ProfileCard.tsx` 등)와 파일 구조를 계획했는지 살펴보세요. 001-github-profile-card 디렉토리 이름은 다른 이름일 수 있습니다.

![plan result](https://github.com/taemyung-heo/github-profile-card/raw/main/images/006_plan_result.png)

## [실습단계]tasks : 할 일 목록 자동 생성하기

> AI가 수립된 `plan`을 기반으로, 실제 개발에 필요한 **세부 작업 목록**을 자동으로 생성하는 단계입니다.

💻 **실습:** 아래 명령어를 클로드 코드에서 실행하세요.

```
/speckit.tasks
```

![tasks](https://github.com/taemyung-heo/github-profile-card/raw/main/images/007_tasks.png)

✅ **확인:** `specs/001-github-profile-card/tasks.md` 파일이 생성되었습니다. 파일을 열어 체크박스 형태로 생성된 할 일 목록을 확인하세요. 이제 우리는 이 목록을 따라 AI에게 구현을 지시할 것입니다. 001-github-profile-card 디렉토리 이름은 다른 이름일 수 있습니다.

## [실습단계]implement : AI에게 코드 구현 지시하기

> 드디어 AI가 실제 코드를 작성하는 단계입니다. `tasks.md`에 있는 작업을 확인해서 코드를 구현합니다.

💻 **실습:** 아래 명령어를 클로드 코드에서 실행하세요.

```
/speckit.implement
```

![implement](https://github.com/taemyung-heo/github-profile-card/raw/main/images/008_implement.png)

💻 **실습: 개발 서버 실행**

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` (또는 터미널에 표시된 주소)로 접속하여, 여러분의 GitHub 아이디를 입력하고 직접 만든 앱이 잘 작동하는지 확인해보세요!

-----

## [실습단계]회고 및 Q/A

축하합니다! 여러분은 아이디어를 실제 작동하는 웹 애플리케이션으로 만들어냈습니다.

1. **오늘 배운 6-Step GitHub Spec Kit 워크플로우:** `constitution` → `spec` → `clarify` → `plan` → `tasks` → `implement`
2. 이 워크플로우를 여러분의 실제 프로젝트에 어떻게 적용할 수 있을지 자유롭게 의견을 나눠봅시다.

마지막으로 지피터스에서 운영하는 AI 스터디를 소개 드립니다.

![aistudy_intro](https://github.com/taemyung-heo/github-profile-card/raw/main/images/aistudy_intro.png)

[스터디 링크](https://www.gpters.org/ai-study-list)

**수고 많으셨습니다!**
