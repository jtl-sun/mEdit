# mEdit 0.21.7 — Ubuntu 빌드/설치 안내

mEdit는 Ubuntu x64에서 두 가지 패키지로 배포할 수 있습니다.

- `mEdit-Ubuntu-x64-0.21.7.AppImage` : 설치 없이 실행
- `mEdit-Ubuntu-x64-0.21.7.deb` : Ubuntu에 정식 설치

## 1. GitHub에서 자동 빌드

`.github/workflows/build-ubuntu.yml`이 `main` 브랜치에 push될 때 자동으로 실행됩니다.

GitHub 저장소에서 다음 순서로 확인합니다.

1. **Actions** 탭을 엽니다.
2. **Build mEdit for Ubuntu**를 선택합니다.
3. **성공한 실행**을 엽니다.
4. 아래 **Artifacts**에서 `mEdit-0.21.7-Ubuntu-x64`를 다운로드합니다.

압축을 풀면 AppImage, DEB, SHA256 체크섬 파일이 들어 있습니다.

## 2. DEB 설치

```bash
sudo apt install ./mEdit-Ubuntu-x64-0.21.7.deb
```

설치 후 앱 메뉴에서 **mEdit**를 실행하거나 터미널에서 다음처럼 실행합니다.

```bash
mEdit
```

Ubuntu에는 `medit`라는 별도의 프로그램이 이미 있으므로 mEdit는 소문자 `medit` 명령을 만들지 않습니다.

## 3. AppImage 실행

```bash
chmod +x mEdit-Ubuntu-x64-0.21.7.AppImage
./mEdit-Ubuntu-x64-0.21.7.AppImage
```

AppImage는 시스템에 설치하지 않고 바로 실행하는 휴대용 버전입니다.

## 4. 소스에서 직접 빌드

```bash
corepack enable
corepack prepare pnpm@10.33.4 --activate
pnpm install --frozen-lockfile
pnpm build:linux:x64
```

완료되면 `dist/`에 AppImage와 DEB가 생성됩니다.

## 5. 설치 검증

0.21.7부터 GitHub Actions는 DEB 파일이 생성됐는지만 확인하지 않습니다. DEB 내부의 `postinst`를 검사하고 실제로 설치한 뒤 `mEdit` 명령이 `/opt/.../mEdit` 실행 파일로 연결되는지 확인합니다. 이 검증에 실패하면 설치 파일을 릴리스하지 않습니다.
