

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.BaAi7PGN.js","_app/immutable/chunks/BIUZ16Ln.js","_app/immutable/chunks/BzlDRkpO.js"];
export const stylesheets = [];
export const fonts = [];
