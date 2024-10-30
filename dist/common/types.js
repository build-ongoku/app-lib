// Generic Types
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var convertFullTypeToInput = function (fullType) {
    // remove the meta fields
    // const { id, created_at, updated_at, deleted_at, ...rest } = fullType
    return fullType;
};
export var convertTypeToWithMeta = function (fullType) {
    // add the meta fields
    var metaFields = {
        id: '',
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
    };
    return __assign(__assign({}, fullType), metaFields);
};
