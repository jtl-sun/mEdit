# mEdit 변경 기록


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
