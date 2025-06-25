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
		client: {start:"_app/immutable/entry/start.DrB778a7.js",app:"_app/immutable/entry/app.V_HCFGb1.js",imports:["_app/immutable/entry/start.DrB778a7.js","_app/immutable/chunks/CLXvtEyX.js","_app/immutable/chunks/BzlDRkpO.js","_app/immutable/chunks/DSmIWiI3.js","_app/immutable/entry/app.V_HCFGb1.js","_app/immutable/chunks/BzlDRkpO.js","_app/immutable/chunks/B8T_c2GK.js","_app/immutable/chunks/CTC-l1AL.js","_app/immutable/chunks/BIUZ16Ln.js","_app/immutable/chunks/DSmIWiI3.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
