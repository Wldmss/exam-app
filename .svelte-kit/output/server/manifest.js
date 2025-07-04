export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","svelte.svg","tauri.svg","vite.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.fJ8Khncw.js",app:"_app/immutable/entry/app.D4DAPNir.js",imports:["_app/immutable/entry/start.fJ8Khncw.js","_app/immutable/chunks/CqNo4cTL.js","_app/immutable/chunks/2OdiwbUB.js","_app/immutable/chunks/ua6O7lAE.js","_app/immutable/entry/app.D4DAPNir.js","_app/immutable/chunks/2OdiwbUB.js","_app/immutable/chunks/DDUfeCL4.js","_app/immutable/chunks/DZjuMH-T.js","_app/immutable/chunks/CAcfXhmB.js","_app/immutable/chunks/ua6O7lAE.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		prerendered_routes: new Set(["/"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
