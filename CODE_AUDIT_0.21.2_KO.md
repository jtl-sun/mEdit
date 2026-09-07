# mEdit 0.21.2 코드 점검 보고서

점검일: 2026-09-08

## 점검 결과

mEdit 0.21.1 소스의 TypeScript/TSX/Vue script 구문을 정적 검사했고, 구문 오류는 발견되지 않았습니다. 또한 0.21.1 이후 MarkText upstream의 실제 수정 내역과 mEdit 소스를 비교해 mEdit에 직접 적용 가능한 안정성/보안 수정만 선별했습니다.

## 0.21.2에 반영한 수정

1. 이미지 HTML 속성 값을 escape하여 속성 탈출/HTML 삽입 위험을 차단했습니다.
2. Windows의 `FileNameW` 클립보드 데이터를 UTF-16LE로 읽어 한글/비ASCII 파일 경로가 깨지는 문제를 수정했습니다.
3. 한글 등 IME 조합 중에는 Backspace/Delete를 에디터가 가로채지 않도록 수정했습니다.
4. Source Mode의 CodeMirror 인스턴스를 Vue reactive proxy에서 제외해 내부 line tree 손상 가능성을 줄였습니다.
5. `E:\\` 같은 이미 존재하는 Windows 드라이브 루트에 직접 저장할 때 발생할 수 있는 `EPERM` 오류를 수정했습니다.
6. pnpm 10에서 올바르게 적용되도록 dependency override를 `pnpm-workspace.yaml`로 이동했습니다.
7. Windows GitHub Actions가 버전 문자열을 코드에서 읽도록 바꿔 다음 릴리스에서 버전 하드코딩을 놓칠 가능성을 줄였습니다.
8. Windows 설치 프로그램의 파일 연결 ProgID/실행 파일 경로를 `mEdit.Document` / `mEdit.exe`로 바로잡았습니다.
9. 제거 프로그램이 다른 앱이 차지한 Markdown 확장자 연결까지 삭제하지 않도록 소유 여부를 확인하도록 바꿨습니다.
10. Linux 데스크톱 항목의 표시 이름과 실행 명령을 mEdit로 정리했습니다.

## 검증 범위와 제한

- TypeScript 5.8.3 parser로 TS/TSX/JS/Vue script 1,065개 파일 구문 검사: **0 errors / 통과**
- 수정된 package JSON 및 XML/YAML 구조 검사: **통과**
- 핵심 수정 사항에 대한 source-level regression assertion: **통과**
- `git diff --check` whitespace 검사: **통과**
- 전체 `pnpm install`, typecheck, unit/e2e test, Electron installer build: 이 작업 컨테이너가 npm registry에 접속할 수 없어 로컬에서 실행하지 못했습니다.
- 저장소의 Windows GitHub Actions는 dependency 설치 → TypeScript typecheck → Windows installer build → installer 존재 확인/SHA256 생성을 수행하도록 유지했습니다.

GitHub에 올린 뒤 Actions의 Windows 빌드가 통과하면 실제 의존성을 포함한 최종 빌드 검증까지 완료됩니다.
