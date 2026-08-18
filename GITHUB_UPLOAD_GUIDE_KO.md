# mEdit를 GitHub에 올리는 방법

## 1. 새 저장소 만들기

1. GitHub에 로그인합니다.
2. 오른쪽 위의 **+** → **New repository**를 선택합니다.
3. Repository name에 **mEdit**를 입력합니다.
4. Public 또는 Private을 선택합니다.
5. **Add a README file**, **.gitignore**, License는 선택하지 않습니다.
6. **Create repository**를 누릅니다.

## 2. 소스 압축 풀기

받은 **mEdit-0.21.1-GitHub-Source.zip**을 원하는 폴더에 압축 해제합니다.

## 3. PowerShell에서 업로드하기

압축을 푼 폴더에서 PowerShell을 열고 다음 명령을 실행합니다.
YOUR-ID는 본인의 GitHub 아이디로 바꾸세요.

~~~powershell
git init
git add .
git commit -m "Initial release: mEdit 0.21.1"
git branch -M main
git remote add origin https://github.com/YOUR-ID/mEdit.git
git push -u origin main
~~~

Git이 사용자 정보를 요구하면 먼저 다음 명령을 실행합니다.

~~~powershell
git config --global user.name "YOUR NAME"
git config --global user.email "YOUR-EMAIL@example.com"
~~~

## 4. Windows 설치 파일 만들기

1. 업로드한 GitHub 저장소의 **Actions** 탭을 엽니다.
2. **Build mEdit for Windows**를 선택합니다.
3. **Run workflow**를 누릅니다.
4. 완료된 작업을 열고 **Artifacts**의 **mEdit-0.21.1-Windows-x64**를 받습니다.

## 주의 사항

- LICENSE 파일은 삭제하지 마세요.
- 코드 서명이 없는 설치 파일은 Windows SmartScreen 경고가 표시될 수 있습니다.
- 다음 수정부터는 package.json과 packages/desktop/package.json의 버전을 함께 변경하세요.
