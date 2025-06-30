<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { register, unregisterAll } from '@tauri-apps/plugin-global-shortcut';
  import { invoke } from '@tauri-apps/api/core';
  import { message, ask } from '@tauri-apps/plugin-dialog';
  import { check } from '@tauri-apps/plugin-updater';
  import { Webview } from "@tauri-apps/api/webview";
  import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
  import { listen } from '@tauri-apps/api/event';

  let unlistenWebview: (() => void) | undefined;
  let webview: Webview | null = null;
  let unlisten: (() => void) | undefined;

  // 웹뷰 생성 함수
  async function createWebview() {
    try {
      // 기존 webview가 있다면 먼저 제거
      if (webview) {
        await destroyWebview();
      }
      
      // 고유한 라벨 생성 (timestamp 사용)
      const uniqueLabel = `ktExamWebview_${Date.now()}`;

      webview = new WebviewWindow(uniqueLabel, {
        title: 'KT 지니어스 대량평가',
        url: 'http://localhost:8080/file', // iframe과 동일한 URL 사용
        x: 0,
        y: 0,
        resizable: false,
        // fullscreen: true,
        focus: true,
      });

      // webview 생성 성공 이벤트
      webview?.once('tauri://created', function () {
        console.log('Webview successfully created');
        // Do not close the host window here
      });

      // webview 생성 실패 이벤트
      webview?.once('tauri://error', function (e) {
        console.error('Error creating webview:', e);
        // message(`웹뷰 생성 중 오류가 발생했습니다: ${e}`, {
        //   title: 'Webview Error',
        //   kind: 'error'
        // });
      });

      listenWebviewBlur();
      listenWebviewFocus();
      listenWebviewClose();

      // 백엔드로 이벤트 발송 (webview 생성 후)
      setTimeout(async () => {
        try {
          await webview?.emit("webview-ready", { timestamp: Date.now() });
          await setupEventListener(); // 이벤트 리스너 설정
        } catch (e) {
          console.error('Failed to emit event:', e);
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to create webview:', error);
      await message(`웹뷰 생성 실패: ${error}`, {
        title: 'Error',
        kind: 'error'
      });
      return undefined;
    }
  }

  // blur/focus 반복 감지
  function listenWebviewBlur() {
    if (!webview) return;
    webview.once('tauri://blur', function () {
      console.log('Webview blur');
      listenWebviewBlur();
    });
  }

  function listenWebviewFocus() {
    if (!webview) return;
    webview.once('tauri://focus', function () {
      console.log('Webview focus');
      listenWebviewFocus();
    });
  }

  // webview close 요청 시 확인 다이얼로그
  function listenWebviewClose() {
    if (!webview) return;
    
    webview.once('tauri://close-requested', async () => {
      console.log('Webview close requested');
      const confirm = await ask('평가를 종료하시겠습니까?', {
        title: '종료 확인',
        okLabel: '예',
        cancelLabel: '아니오',
      });
      if (confirm) {
        await destroyWebview();
        // 호스트 앱도 종료 (백엔드에 close_main_window 커맨드가 구현되어 있어야 함)
        try {
          await invoke('close_main_window');
        } catch (e) {
          console.error('Host window close failed:', e);
        }
      } else {
        webview?.setFocus();
        listenWebviewClose();
      }
    });
  }

  // 웹뷰 제거 함수
  async function destroyWebview() {
    try {
      if (webview) {
        console.log('Destroying existing webview...');
        await webview.close();
        webview = null;
        console.log('Webview destroyed successfully');
      } else {
        console.log('No webview to destroy');
      }
    } catch (error) {
      console.error('Failed to destroy webview:', error);
      // 에러가 발생해도 webview 변수는 null로 설정
      webview = null;
    }
  }

  // 백엔드에서 오는 이벤트 리스닝
  async function setupEventListener() {
      try {
        unlisten = await listen('front', (event) => {
          console.log('Received event from backend:', event);
          // const payload = event?.payload;
          // if (payload?.type === 'exit') {
          //   await destroyWebview(); // 또는 appWindow.close()
          // }
        });

      } catch (e) {
        console.error('Failed to setup event listener:', e);
        return undefined;
      }
  }

  // 업데이트 확인
  async function checkUpdate() {
    try {
      const update = await check();
      if (update?.available) {
        const wantsToUpdate = await ask(
          `Update to ${update.version} is available!`,
          {
            title: 'Update Available',
            okLabel: 'Update',
            cancelLabel: 'Later',
          }
        );
        if (wantsToUpdate) {
          await update.downloadAndInstall();
        }
      } else {
        await message('You are running the latest version.', 'Up to date');
      }
    } catch (e) {
      console.error(e);
      await message(`Error checking for updates: ${e}`, {
        title: 'Update Error',
      });
    }
  }

  // 실행중인 프로세스 확인
  async function checkProcessRunning() {
    try {
      const result = await invoke<boolean>('is_process_running', {
        processName: "Terminal",
      });
      await message(`프로세스 실행 결과: ${result}`);
      console.log("실행 중인가?", result);
    } catch (error) {
      console.error('Process check failed:', error);
      await message(`프로세스 확인 중 오류: ${error}`);
    }
  }

  // 듀얼 모니터 감지 함수
  async function checkMultiMonitor() {
    try {
      const hasMultiple = await invoke('has_multiple_monitors');
      if (hasMultiple) {
        await message('경고: 듀얼 모니터 사용이 감지되었습니다. 시험 규정에 따라 단일 모니터 환경에서 진행해야 합니다.', {
          title: '듀얼 모니터 감지',
          kind: 'warning'
        });
        console.log('경고: 듀얼 모니터 사용이 감지되었습니다.');
      } else {
        console.log('단일 모니터 환경임이 확인되었습니다.');
      }
    } catch (e) {
      console.error('모니터 감지 중 오류 발생:', e);
    }
  }

  // 키 차단
  const shortcutsToBlock = [
    'CommandOrControl+C',   // 복사
    'CommandOrControl+V',   // 붙여넣기
    'CommandOrControl+X',   // 잘라내기
    'CommandOrControl+S',   // 저장
    'CommandOrControl+A',   // 전체 선택
    'Command+Control+F',    // 전체 화면 (macOS)
    'Command+Space',        // Spotlight (macOS)
    'Command+Tab',          // 앱 전환 (macOS)
    'Command+Q',            // 앱 종료 (macOS)
    'Alt+Tab',              // 앱 전환 (Windows)
    'F4',                   // Launchpad 등 (macOS)
    'F5',                   // 새로고침 등
    'F11',                  // 전체 화면 (Windows)
    'F12',                  // 개발자 도구 (Windows)
    'PrintScreen',          // 화면 캡처 (Windows)
    'Alt+PrintScreen',      // 활성 창 캡처 (Windows)
    'Shift+Command+3',      // 전체 화면 캡처 (macOS)
    'Shift+Command+4',      // 영역 캡처 (macOS)
    'Shift+Command+5',      // 캡처 옵션 (macOS)
  ];

  async function registerShortcuts() {
    for (const shortcut of shortcutsToBlock) {
      try {
        await register(shortcut, async () => {
          // 키가 차단되었음을 알리는 메시지
          console.log(`[Blocked] Shortcut "${shortcut}" was pressed.`);
          // await message(`${shortcut} 키가 차단되었습니다.`, {
          //   title: '키 차단',
          //   kind: 'warning'
          // });
        });
      } catch (error) {
        console.error(`Failed to register shortcut "${shortcut}":`, error);
      }
    }
  }

  onMount(async () => {
    try {
      // await registerShortcuts(); // 글로벌 단축키 등록
      // await checkMultiMonitor(); // 초기 모니터 체크
      await createWebview(); // 웹뷰 생성

    } catch (err) {
      console.error('Initialization failed:', err);
      await message(`초기화 중 오류가 발생했습니다: ${err}`, {
        title: 'Initialization Error',
        kind: 'error'
      });
    }
  });

  onDestroy(async () => {
    // 글로벌 단축키 해제
    unregisterAll();
    
    // 웹뷰 이벤트 리스너 해제
    if (unlistenWebview) {
      unlistenWebview();
    }

    if (unlisten) {
      unlisten();
    }
    
    // 웹뷰 제거
    await destroyWebview();
  });
</script>

<main>
  <div class="controls">
    <button on:click={checkProcessRunning}>프로세스 확인</button>
    <button on:click={checkMultiMonitor}>듀얼 모니터 재확인</button>
    <button on:click={checkUpdate}>업데이트 확인</button>
    <button on:click={async () => { unlistenWebview = await createWebview(); }}>웹뷰 생성</button>
    <button on:click={destroyWebview}>웹뷰 제거</button>
  </div>
  
  <!-- 웹뷰가 생성되면 iframe은 숨기거나 제거할 수 있습니다 -->
  <!-- <iframe
    src="http://localhost:8080/file"
    title="KT 지니어스 대량평가"
    frameborder="0"
  ></iframe> -->
</main>

<style>
  .controls {
    padding: 10px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ccc;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  button {
    padding: 8px 16px;
    background-color: #007acc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  button:hover {
    background-color: #005a9e;
  }

  button:active {
    background-color: #004085;
  }

  iframe {
    border: 1px solid red;
    width: 100%;
    height: calc(100vh - 60px);
  }

  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>