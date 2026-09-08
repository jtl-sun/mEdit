# mEdit

## Download / 설치 파일

일반 사용자는 소스 코드를 빌드할 필요가 없습니다. GitHub의 **Releases** 페이지에서 운영체제에 맞는 파일을 다운로드하세요.

- **Windows 설치:** `mEdit-Windows-x64-0.21.8-setup.exe`
- **Windows 무설치:** `mEdit-Windows-x64-0.21.8.zip`
- **Ubuntu 설치:** `mEdit-Ubuntu-x64-0.21.8.deb`
- **Ubuntu 무설치:** `mEdit-Ubuntu-x64-0.21.8.AppImage`

다운로드: <https://github.com/jtl-sun/mEdit/releases/latest>

Ubuntu AppImage는 처음 한 번 실행 권한을 부여한 뒤 실행합니다.

```bash
chmod +x mEdit-Ubuntu-x64-0.21.8.AppImage
./mEdit-Ubuntu-x64-0.21.8.AppImage
```

Ubuntu DEB는 다음처럼 설치합니다. 필요한 런타임 라이브러리와 한글 표시용 Noto CJK 글꼴은 APT가 함께 설치합니다.

```bash
sudo apt install ./mEdit-Ubuntu-x64-0.21.8.deb
```

0.21.7 이하 Ubuntu DEB가 `marktext`라는 잘못된 패키지 이름으로 설치되어 있어도 0.21.8 설치 시 새 `medit-markdown` 패키지로 자동 교체됩니다.

설치 후 앱 메뉴에서 **mEdit**를 실행하거나 터미널에서 다음 명령을 사용합니다.

```bash
mEdit
```

> Ubuntu에는 `medit`라는 별도의 프로그램이 이미 있으므로 mEdit는 소문자 `medit` 별칭을 만들지 않습니다.

**mEdit**는 Markdown 문서를 편리하게 작성하고 미리 볼 수 있는 데스크톱 편집기입니다.

## 현재 버전

**mEdit 0.21.8**

## 주요 기능

- Ubuntu/Windows 기본 창 제목줄에 **mEDIT** 프로그램 이름 표시
- 익숙한 드롭다운 방식의 상단 메뉴
- 문서 편집 영역을 항상 왼쪽에 배치
- Help → **Markdown 빠른 안내서**
- Ubuntu에서도 한글이 정상 표시되는 Markdown 안내서
- 제목, 강조, 목록, 체크박스, 링크, 이미지, 인용문, 코드, 표, 각주, 수학식 예제
- 밝은 테마와 어두운 테마
- 탭, 파일 탐색기, 검색, 내보내기 등 Markdown 편집 기능
- mEdit 전용 프로그램 이름과 아이콘

## Windows 설치 파일 자동 만들기

이 저장소에는 GitHub Actions 빌드 설정이 포함되어 있습니다.

1. 저장소 위쪽의 **Actions** 탭을 엽니다.
2. 왼쪽에서 **Build mEdit for Windows**를 선택합니다.
3. **Run workflow** → **Run workflow**를 누릅니다.
4. 빌드가 끝나면 실행 결과 아래의 **Artifacts**에서 설치 파일을 다운로드합니다.

main 브랜치에 변경 사항을 올려도 Windows 빌드가 자동으로 실행됩니다.

## 내 컴퓨터에서 실행하기

필요한 프로그램:

- Node.js 24
- pnpm 10
- Python 3.12
- Git

PowerShell에서 다음 명령을 실행합니다.

~~~powershell
corepack enable
corepack install --global pnpm@10.33.4
pnpm install --frozen-lockfile
pnpm dev
~~~

## 내 컴퓨터에서 Windows 설치 파일 만들기

~~~powershell
pnpm build:win:x64
~~~

완성된 설치 파일은 **dist** 폴더에 생성됩니다.

## GitHub에 처음 올리기

자세한 순서는 [GITHUB_UPLOAD_GUIDE_KO.md](GITHUB_UPLOAD_GUIDE_KO.md)를 참고하세요.

## 라이선스

MIT License를 따릅니다. 이 프로젝트는 오픈소스 편집기 코드를 기반으로 수정되었으므로
원 저작권 고지와 MIT 라이선스는 삭제하지 않아야 합니다.

## Ubuntu 24.04+

mEdit 0.21.8 can be packaged for Ubuntu x64 as both an **AppImage** and a **DEB** package.

Build locally on Ubuntu:

```bash
corepack enable
corepack prepare pnpm@10.33.4 --activate
pnpm install --frozen-lockfile
pnpm build:linux:x64
```

Expected files in `dist/`:

- `mEdit-Ubuntu-x64-0.21.8.AppImage` — portable, no installation required
- `mEdit-Ubuntu-x64-0.21.8.deb` — installable Ubuntu package

Install the DEB package:

```bash
sudo apt install ./mEdit-Ubuntu-x64-0.21.8.deb
```

Run the installed application:

```bash
mEdit
```

Run the AppImage:

```bash
chmod +x mEdit-Ubuntu-x64-0.21.8.AppImage
./mEdit-Ubuntu-x64-0.21.8.AppImage
```

For DEB installations the package name is `medit-markdown`, not `marktext`. The DEB also depends on `fonts-noto-cjk` so Korean help text is rendered correctly on a fresh English Ubuntu installation.

The GitHub Actions workflow `.github/workflows/build-ubuntu.yml` builds and uploads both files automatically.
