import "clsx";
import { c as pop, p as push } from "../../chunks/index.js";
import "@tauri-apps/plugin-global-shortcut";
import "@tauri-apps/api/core";
import "@tauri-apps/plugin-dialog";
function _page($$payload, $$props) {
  push();
  $$payload.out += `<main><button>check</button> <button>듀얼 모니터 재확인</button> <iframe src="http://localhost:8080/file" title="KT 지니어스 대량평가" frameborder="0" class="svelte-1vnge8v"></iframe></main>`;
  pop();
}
export {
  _page as default
};
