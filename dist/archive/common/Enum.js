var EnumInfo = /** @class */ (function () {
    function EnumInfo(props) {
        var _this = this;
        this.name = props.name;
        this.valuesInfo = props.valuesInfo;
        this.valuesMap = {};
        this.valuesInfo.map(function (valueInfo) {
            _this.valuesMap[valueInfo.id] = valueInfo.value;
        });
    }
    EnumInfo.prototype.getValue = function (id) {
        return this.valuesMap[id];
    };
    EnumInfo.prototype.getEnumValueInfo = function (value) {
        return this.valuesInfo.find(function (enumValueInfo) { return enumValueInfo.value === value; });
    };
    return EnumInfo;
}());
export { EnumInfo };
console.log('EnumInfo loaded');
var EnumValueInfo = /** @class */ (function () {
    function EnumValueInfo(props) {
        this.id = props.id;
        this.value = props.value;
        this.displayValue = props.displayValue;
    }
    EnumValueInfo.prototype.getDisplayValue = function () {
        var _a;
        return (_a = this.displayValue) !== null && _a !== void 0 ? _a : this.value;
    };
    return EnumValueInfo;
}());
export { EnumValueInfo };
