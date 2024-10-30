import { WithMethods } from './method';
// U is a union type of all Entities
var ServiceInfo = /** @class */ (function () {
    function ServiceInfo(props) {
        var _this = this;
        this.typeInfosMap = {}; // local service types
        this.enumInfos = {};
        this.name = props.name;
        this.entityInfos = props.entityInfos;
        // Type Infos
        props.typeInfos.forEach(function (typInfo) {
            _this.typeInfosMap[typInfo.name] = typInfo;
        });
        this.defaultIcon = props.defaultIcon;
        this.withMethods = new WithMethods(props.withMethodsReq);
    }
    ServiceInfo.prototype.getEntityInfo = function (name) {
        var entityInfo = this.entityInfos.find(function (elem) { return elem.name === name; });
        return entityInfo;
    };
    // T should be a type, one that is at the service level
    ServiceInfo.prototype.getTypeInfo = function (name) {
        var typeInfo = this.typeInfosMap[name];
        return typeInfo;
    };
    ServiceInfo.prototype.getEnumInfo = function (name) {
        return this.enumInfos[name];
    };
    // Inherited methods (forwarding)
    ServiceInfo.prototype.getMethod = function (name) {
        return this.withMethods.getMethod(name);
    };
    return ServiceInfo;
}());
export { ServiceInfo };
