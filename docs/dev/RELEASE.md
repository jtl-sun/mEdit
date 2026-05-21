# Steps to release MarkText

- Create a release candidate
  - Simply create a tag at the latest commit `git tag v0.18.3`
  - Push the tag and a build will automatically triggered `git push --tags`

## Homebrew on Linux

The Homebrew on Linux formula in `packaging/homebrew/marktext.rb` is an experimental template for a future custom tap. It should not be published until a tagged release includes a Linux `tar.gz` artifact.

After publishing a release:

1. Confirm the release contains `marktext-linux-<version>.tar.gz`.
2. Update `packaging/homebrew/marktext.rb` with the release URL and SHA256.
3. Copy `marktext.rb` into the tap's `Formula/` directory.
4. Run:

   ```bash
   brew style packaging/homebrew/marktext.rb
   brew audit --strict --online <tap>/marktext
   brew install <tap>/marktext
   brew test <tap>/marktext
   ```

Keep this separate from the existing `mark-text` Homebrew cask, which is macOS-only.
