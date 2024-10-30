import { __assign } from '../_virtual/_tslib.js';

// Generic Types
var convertFullTypeToInput = function (fullType) {
    // remove the meta fields
    // const { id, created_at, updated_at, deleted_at, ...rest } = fullType
    return fullType;
};
var convertTypeToWithMeta = function (fullType) {
    // add the meta fields
    var metaFields = {
        id: '',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    };
    return __assign(__assign({}, fullType), metaFields);
};

export { convertFullTypeToInput, convertTypeToWithMeta };
