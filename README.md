# Tauri + SvelteKit

This template should help get you started developing with Tauri and SvelteKit in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer).


# build

```bash
rm -rf target
rm -f Cargo.lock
cargo build

-- macOS
npm run tauri build
    -> src-tauri/target/release/bundle/ 에서 확인

-- Windows
npm run tauri build -- --runner cargo-xwin --target x86_64-pc-windows-msvc
    -> src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/
```



---

## macOS에서 Windows용 빌드 (크로스 컴파일)

macOS 환경에서 Windows용 `.exe` 설치 파일을 빌드(크로스 컴파일)하기 위한 환경 설정 방법입니다.

### 1. 필수 도구 설치

Homebrew를 사용하여 필요한 도구들을 설치합니다.

- **NSIS:** Windows 설치 프로그램 빌더
- **LLVM:** 컴파일러 및 링커

```bash
# NSIS 설치
brew install nsis

# LLVM 설치
brew install llvm
```

### 2. 환경 변수 설정

설치된 LLVM을 시스템이 인식할 수 있도록 `PATH` 환경 변수를 셸 설정 파일(`~/.zshrc` 또는 `~/.bash_profile`)에 추가합니다.

```bash
echo 'export PATH="/opt/homebrew/opt/llvm/bin:$PATH"' >> ~/.zshrc
```

> **중요:** 위 명령을 실행한 후, 변경사항을 적용하기 위해 터미널을 완전히 종료하고 다시 시작해야 합니다.

### 3. Rust 빌드 대상 및 보조 도구 설치

Rust가 Windows를 대상으로 컴파일할 수 있도록 관련 도구를 설치합니다.

- **Windows 타겟 추가:** `rustup`을 사용하여 64비트 Windows 빌드 대상을 추가합니다.
- **cargo-xwin 설치:** Windows SDK 설정을 자동화하는 `cargo` 보조 도구를 설치합니다.

```bash
# 64비트 Windows 빌드 대상 추가
rustup target add x86_64-pc-windows-msvc

# cargo-xwin 설치
cargo install --locked cargo-xwin
```

### 4. Windows용 빌드 실행

모든 설정이 완료되면 아래 명령을 실행하여 Windows용 애플리케이션을 빌드합니다.

```bash
npm run tauri build -- --runner cargo-xwin --target x86_64-pc-windows-msvc
```

빌드가 성공적으로 완료되면 `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/` 디렉토리에서 `.exe` 설치 파일을 찾을 수 있습니다.