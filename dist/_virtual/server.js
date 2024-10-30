import { __require as requireServer } from '../goku-static/apps/app-lib/node_modules/next/server.js';

var serverExports = requireServer();

export { serverExports as s };
