# 할일 관리 앱 수정 계획

## 수정 내용

### 1. 매일 반복업무도 시간 지정 가능
**파일:** `src/components/TodoInput.tsx`

- 현재: 반복 업무 시 시간 입력란 비활성화
- 수정: 반복 업무 시에도 시간 입력란 항상 활성화
- 변경점: 시간 입력란의 `disabled` 속성 제거

### 2. 할일 메모 기능 추가
**파일 수정:**
- `src/types/index.ts` - Todo 인터페이스에 `note?: string` 필드 추가
- `src/components/TodoInput.tsx` - 메모 입력란 (textarea) 추가
- `src/components/TodoItem.tsx` - 메모 표시 및 편집 기능 추가
- `src/components/TodoDetailModal.tsx` - 메모 표시 추가
- `src/hooks/useTodos.ts` - addTodo, updateTodo 함수에 메모 파라미터 추가

**구현 내용:**
- 할일 등록 시 메모 입력란 (최대 500 자)
- 편집 시 메모 수정 가능
- 상세 모달에서 메모 확인

### 3. 주간/월간 일정 호버 드롭다운
**파일:** `src/components/WeeklyMonthlyView.tsx`

- 현재: 클릭 시 모달 표시
- 수정: 마우스 호버 시 드롭다운 목록 표시
- 구현:
  - `useState` 로 호버 상태 관리
  - CSS `:hover` 또는 onMouseEnter/Leave 이벤트
  - 날짜별 할일 목록을 드롭다운으로 표시
  - 클릭 시에는 모달 표시 (상세 정보 확인용)

## 파일 수정 목록
1. `src/types/index.ts` - note 필드 추가
2. `src/components/TodoInput.tsx` - 시간 입력 활성화, 메모 입력란 추가
3. `src/components/TodoItem.tsx` - 메모 표시/편집 추가
4. `src/components/TodoDetailModal.tsx` - 메모 표시 추가
5. `src/hooks/useTodos.ts` - 메모 파라미터 추가
6. `src/components/WeeklyMonthlyView.tsx` - 호버 드롭다운 구현
