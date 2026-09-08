# mEdit 0.21.8 — Ubuntu 빌드/설치 안내

mEdit는 Ubuntu x64에서 두 가지 패키지로 배포할 수 있습니다.

- `mEdit-Ubuntu-x64-0.21.8.AppImage` : 설치 없이 실행
- `mEdit-Ubuntu-x64-0.21.8.deb` : Ubuntu에 정식 설치

## 1. GitHub에서 자동 빌드

`.github/workflows/build-ubuntu.yml`이 `main` 브랜치에 push될 때 자동으로 실행됩니다.

GitHub 저장소에서 다음 순서로 확인합니다.

1. **Actions** 탭을 엽니다.
2. **Build mEdit for Ubuntu**를 선택합니다.
3. **성공한 실행**을 엽니다.
4. 아래 **Artifacts**에서 `mEdit-0.21.8-Ubuntu-x64`를 다운로드합니다.

압축을 풀면 AppImage, DEB, SHA256 체크섬 파일이 들어 있습니다.

## 2. DEB 설치

```bash
sudo apt install ./mEdit-Ubuntu-x64-0.21.8.deb
```

0.21.8부터 Ubuntu 패키지 이름은 `medit-markdown`입니다. 0.21.7 이하에서 잘못 사용했던 `marktext` 패키지가 설치되어 있어도 새 패키지가 자동으로 교체합니다.

또한 DEB는 `fonts-noto-cjk`를 의존성으로 설치하므로 영문 전용 Ubuntu 환경에서도 **Markdown 빠른 안내서**의 한글이 정상 표시됩니다.

설치 후 앱 메뉴에서 **mEdit**를 실행하거나 터미널에서 다음처럼 실행합니다.

```bash
mEdit
```

Ubuntu에는 `medit`라는 별도의 프로그램이 이미 있으므로 mEdit는 소문자 `medit` 명령을 만들지 않습니다.

## 3. AppImage 실행

```bash
chmod +x mEdit-Ubuntu-x64-0.21.8.AppImage
./mEdit-Ubuntu-x64-0.21.8.AppImage
```

AppImage는 시스템에 설치하지 않고 바로 실행하는 휴대용 버전입니다. AppImage에서 한글 글꼴이 없는 최소 Ubuntu 환경을 사용하는 경우에는 `sudo apt install fonts-noto-cjk`를 한 번 설치하면 됩니다.

## 4. 소스에서 직접 빌드

```bash
corepack enable
corepack prepare pnpm@10.33.4 --activate
pnpm install --frozen-lockfile
pnpm build:linux:x64
```

완료되면 `dist/`에 AppImage와 DEB가 생성됩니다.

## 5. 설치 검증

0.21.8의 GitHub Actions는 다음을 실제 Ubuntu 24.04 환경에서 검사합니다.

- DEB 내부 패키지 이름이 `medit-markdown`인지 확인
- 기존 `marktext` 패키지를 자동 제거하고 새 패키지로 교체할 수 있는지 확인
- `fonts-noto-cjk`가 설치되고 한국어 글꼴을 찾을 수 있는지 확인
- DEB 내부 `postinst`와 `/usr/bin/mEdit` 실행 링크 확인
- 실제 DEB 설치 후 `mEdit`가 `/opt/.../mEdit` 실행 파일로 연결되는지 확인

이 검증 중 하나라도 실패하면 설치 파일을 릴리스하지 않습니다.
