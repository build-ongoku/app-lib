import { getDefaultExportFromCjs } from './_commonjsHelpers.js';
import { __require as requireUtc } from '../node_modules/dayjs/plugin/utc.js';

var utcExports = requireUtc();
var utcPlugin = /*@__PURE__*/getDefaultExportFromCjs(utcExports);

export { utcPlugin as default };
