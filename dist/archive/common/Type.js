// EntityInfo holds all the information about how to render/manipulate a particular Entity type.
var TypeInfo = /** @class */ (function () {
    function TypeInfo(props) {
        var _this = this;
        var _a;
        this.enumInfos = {};
        // overridable
        this.getTypeNameFunc = function (info) {
            return info.name;
        };
        this.name = props.name;
        this.serviceName = props.serviceName;
        this.fieldInfos = props.fieldInfos;
        (_a = props.enumInfos) === null || _a === void 0 ? void 0 : _a.forEach(function (enumInfo) {
            _this.enumInfos[enumInfo.name] = enumInfo;
        });
        this.getEmptyInstance = props.getEmptyInstance || (function () { return ({}); });
    }
    // Name of the Type
    TypeInfo.prototype.getTypeName = function () {
        return this.getTypeNameFunc(this);
    };
    // getFieldInfo provides the FieldInfo corresponding to the field name provided
    TypeInfo.prototype.getFieldInfo = function (fieldName) {
        var fieldInfo = this.fieldInfos.find(function (elem) { return elem.name === fieldName; });
        if (!fieldInfo) {
            throw new Error(String("FieldInfo not found for field ".concat(String(fieldName))));
        }
        return fieldInfo;
    };
    return TypeInfo;
}());
export { TypeInfo };
