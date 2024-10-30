import { getDefaultExportFromCjs } from './_commonjsHelpers.js';
import { __require as requireRelativeTime } from '../node_modules/dayjs/plugin/relativeTime.js';

var relativeTimeExports = requireRelativeTime();
var relativeTime = /*@__PURE__*/getDefaultExportFromCjs(relativeTimeExports);

export { relativeTime as default };
