import { getDefaultExportFromCjs } from './_commonjsHelpers.js';
import { __require as requireTimezone } from '../node_modules/dayjs/plugin/timezone.js';

var timezoneExports = requireTimezone();
var timezonePlugin = /*@__PURE__*/getDefaultExportFromCjs(timezoneExports);

export { timezonePlugin as default };
