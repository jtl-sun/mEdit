# mEdit 변경 기록

## 0.21.5

- Ubuntu/Windows의 기본 창 제목줄에 프로그램 이름 **`mEDIT`**가 항상 보이도록 수정
- 문서를 열지 않았을 때 제목이 빈 문자열이 되어 아이콘만 보이던 문제 수정
- 문서를 열면 기본 창 제목을 `mEDIT — 파일명` 형태로 유지하여 프로그램 이름과 현재 문서를 함께 확인 가능
- mDIR처럼 창을 보는 즉시 어떤 프로그램인지 확인할 수 있도록 제목 표시를 명확하게 정리

## 0.21.4

- Ubuntu 24.04/26.04에서 Electron 실행에 필요한 `libasound.so.2`가 누락되던 문제 수정
- DEB 설치 시 `libasound2t64`(또는 구버전 배포판의 `libasound2`)를 자동 의존성으로 설치하도록 패키징 수정
- Ubuntu DEB 설치 후 터미널에서 `mEdit`뿐 아니라 `medit` 소문자 명령으로도 실행 가능하도록 안전한 별칭 추가
- 제거 시 mEdit가 만든 `medit` 심볼릭 링크만 삭제하여 다른 프로그램의 동일 이름 파일을 보호

## 0.21.3

- Added an automated GitHub Release workflow that publishes Windows Setup/portable ZIP and Ubuntu AppImage/DEB installers for end users.

- Added first-class Ubuntu x64 packaging for AppImage and DEB.
- Added `build:linux:x64` and `build:linux:arm64` scripts.
- Added GitHub Actions workflow to build and upload Ubuntu artifacts automatically.
- Ubuntu artifact names now include OS, architecture, and version.
- Simplified Linux targets to AppImage and DEB for Ubuntu-focused distribution.

## 0.21.2

- 이미지 HTML 속성 값을 escape하여 속성 탈출/HTML 삽입 위험을 차단
- Windows 클립보드의 파일 경로를 UTF-16LE로 읽어 한글/비ASCII 경로가 깨지는 문제 수정
- 한글 등 IME 조합 중 Backspace/Delete가 조합 입력을 방해하는 문제 수정
- Source Mode에서 CodeMirror 인스턴스를 Vue reactive proxy에서 제외하여 안정성 향상
- `E:\\` 같은 Windows 드라이브 루트에 직접 저장할 때 발생할 수 있는 `EPERM` 오류 수정
- pnpm 10 호환성을 위해 dependency override를 `pnpm-workspace.yaml`로 이동
- Windows GitHub Actions가 패키지 버전을 자동으로 읽도록 개선
- Windows 설치 프로그램의 남아 있던 MarkText 파일 연결/실행 경로를 mEdit로 수정하고, 제거 시 다른 앱의 파일 연결을 지우지 않도록 보호
- Linux 데스크톱 메타데이터의 남아 있던 MarkText 이름/실행 경로를 mEdit로 정리

## 0.21.1

- Help 드롭다운에 초보자용 **Markdown 빠른 안내서** 추가
- 자주 사용하는 Markdown 문법부터 순서대로 구성
- 문법 예제 선택 및 복사 가능

## 0.21.0

- 프로그램 이름을 mEdit로 변경
- mEdit 전용 아이콘 적용
- 드롭다운 방식의 상단 메뉴 적용
- 편집 영역을 항상 왼쪽에 배치
- 애플리케이션 화면의 기존 프로젝트 관련 링크 제거