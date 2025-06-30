import "clsx";
import { d as current_component, c as pop, p as push } from "../../chunks/index.js";
import { unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import "@tauri-apps/api/core";
import "@tauri-apps/plugin-dialog";
import "@tauri-apps/plugin-updater";
import "@tauri-apps/api/webview";
import "@tauri-apps/api/webviewWindow";
import "@tauri-apps/api/event";
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
function _page($$payload, $$props) {
  push();
  let webview = null;
  async function destroyWebview() {
    try {
      if (webview) {
        console.log("Destroying existing webview...");
        await webview.close();
        webview = null;
        console.log("Webview destroyed successfully");
      } else {
        console.log("No webview to destroy");
      }
    } catch (error) {
      console.error("Failed to destroy webview:", error);
      webview = null;
    }
  }
  onDestroy(async () => {
    unregisterAll();
    await destroyWebview();
  });
  $$payload.out += `<main class="svelte-59lw4i"><div class="controls svelte-59lw4i"><button class="svelte-59lw4i">프로세스 확인</button> <button class="svelte-59lw4i">듀얼 모니터 재확인</button> <button class="svelte-59lw4i">업데이트 확인</button> <button class="svelte-59lw4i">웹뷰 생성</button> <button class="svelte-59lw4i">웹뷰 제거</button></div></main>`;
  pop();
}
export {
  _page as default
};
