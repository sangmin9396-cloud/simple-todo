# SimpleTodo

간편한 개인 할일 관리 앱입니다.

## 🚀 실행 방법

### Windows 에서 바로 실행
- **개발 모드**: `start-dev.cmd` 더블 클릭
- **프로덕션 모드**: `start.cmd` 더블 클릭

### npm 명령어로 실행

**개발 서버 실행 (권장)**
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` 으로 접속합니다.

**프로덕션 빌드 후 실행**
```bash
# 빌드
npm run build

# 빌드된 파일 실행
npm start
```
브라우저에서 `http://localhost:3000` 으로 접속합니다.

## 📁 폴더 구조
```
simple-todo/
├── src/
│   ├── components/      # UI 컴포넌트
│   ├── hooks/          # 커스텀 훅
│   ├── types/          # TypeScript 타입
│   ├── utils/          # 유틸리티 함수
│   ├── App.tsx         # 메인 컴포넌트
│   └── index.css       # 스타일
├── dist/               # 빌드 결과물
└── package.json
```

## ✨ 주요 기능

- **할일 관리**: 추가, 수정, 삭제, 완료 체크
- **카테고리**: 업무, 개인, 학습, 건강, 기타
- **우선순위**: 낮음, 보통, 높음
- **마감기한**: 날짜 선택 및 임박 알림
- **필터/정렬**: 카테고리, 상태, 정렬 옵션
- **진행률**: 원형/선형 프로그레스 바
- **반복 할일**: 매일, 매주, 매월 반복
- **데이터 저장**: localStorage 자동 저장

## 🛠️ 기술 스택

- React 19
- TypeScript
- Vite
- Tailwind CSS
