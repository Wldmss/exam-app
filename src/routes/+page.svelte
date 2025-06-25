<script lang="ts">
  import { onMount } from 'svelte';
  import { register, unregisterAll } from '@tauri-apps/plugin-global-shortcut';
  import { invoke } from '@tauri-apps/api/core';
  import { message, ask } from '@tauri-apps/plugin-dialog';
  import { check } from '@tauri-apps/plugin-updater';

  // 업데이트 확인 + a
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
    const result = await invoke<boolean>('is_process_running', {
      processName: "Terminal", // 예: Windows에서 메모장
    });
    await message(`프로세스 실행 결과: ${result}`);
    console.log("실행 중인가?", result);
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
        console.log('경고: 듀얼 모니터 사용이 감지되었습니다. 시험 규정에 따라 단일 모니터 환경에서 진행해야 합니다.');
        // 여기에 듀얼 모니터 감지 시 시험을 중단시키는 로직을 추가할 수 있습니다.
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

  onMount(() => {
    // shortcutsToBlock.push('Command+Option+I'); // 개발자 도구 (macOS)
    
    (async () => {
      try {
        for (const shortcut of shortcutsToBlock) {
          console.log('Registering shortcut:', shortcut);
          await register(shortcut, () => {
            console.log(`[Blocked] Shortcut "${shortcut}" was pressed.`);
          });
          console.log(`Registered: ${shortcut}`);
        }
        console.log('All shortcuts have been successfully registered.');
      } catch (err) {
        console.log('Failed to register global shortcuts:', err);
      }
    })();

    checkMultiMonitor();

    return () => {
      unregisterAll();
    };
  });
</script>

<main>
  <div>
    <button on:click={checkProcessRunning}>check</button>
  </div>
  <div>
    <button on:click={checkMultiMonitor}>듀얼 모니터 재확인</button>
  </div>
  <div>
    <button on:click={checkUpdate}>업데이트 확인</button>
  </div>
  <iframe
    src="http://localhost:8080/file"
    title="KT 지니어스 대량평가"
    frameborder="0"
  ></iframe>
</main>

<style>
  iframe {
    border: 1px solid red;
    width: 100%;
    height: 100vh;
  }
</style>
