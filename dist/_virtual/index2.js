import { getDefaultExportFromCjs } from './_commonjsHelpers.js';
import { __require as requireFastDeepEqual } from '../node_modules/fast-deep-equal/index.js';

var fastDeepEqualExports = requireFastDeepEqual();
var isEqual = /*@__PURE__*/getDefaultExportFromCjs(fastDeepEqualExports);

export { isEqual as default };
