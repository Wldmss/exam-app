

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.CJOFx0wD.js","_app/immutable/chunks/CAcfXhmB.js","_app/immutable/chunks/2OdiwbUB.js"];
export const stylesheets = [];
export const fonts = [];
