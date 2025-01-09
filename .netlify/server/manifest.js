export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["docs/index.md","docs/installation.md","docs/setup.md","favicon.png","logo.svg"]),
	mimeTypes: {".md":"text/markdown",".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.DEFpXaMU.js","app":"_app/immutable/entry/app.DE5meCvU.js","imports":["_app/immutable/entry/start.DEFpXaMU.js","_app/immutable/chunks/entry.BycVCYnz.js","_app/immutable/chunks/scheduler.lNjCN_PW.js","_app/immutable/chunks/index.BJLfYHn1.js","_app/immutable/entry/app.DE5meCvU.js","_app/immutable/chunks/preload-helper.C1FmrZbK.js","_app/immutable/chunks/scheduler.lNjCN_PW.js","_app/immutable/chunks/index.BSHsVzBS.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
		],
		routes: [
			{
				id: "/(main)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/api/docs",
				pattern: /^\/api\/docs\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/docs/_server.ts.js'))
			},
			{
				id: "/(main)/(docs)/docs",
				pattern: /^\/docs\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(main)/(docs)/docs/[...slug]",
				pattern: /^\/docs(?:\/(.*))?\/?$/,
				params: [{"name":"slug","optional":false,"rest":true,"chained":true}],
				page: { layouts: [0,2,], errors: [1,3,], leaf: 6 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
