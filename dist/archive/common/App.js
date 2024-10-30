import { snakeCase } from 'change-case';
/* U is the union type of all entities in the App, T is the union type of all types in the app.
 * UTI is the union of all possible nested types
 */
var AppInfo = /** @class */ (function () {
    // Constructor shouldn't need to do anything
    function AppInfo(props) {
        var _this = this;
        // serviceInfosMap is a collection of Services
        this.serviceInfosMap = {};
        // typeInfosMap is a collection of Types stored at the global level
        this.typeInfosMap = {};
        // enumInfos is a collection of Enums stored at the global level
        this.enumInfos = {};
        console.log('AppInfo constructor called');
        // Service Infos
        props.serviceInfos.forEach(function (svcInfo) {
            _this.serviceInfosMap[svcInfo.name] = svcInfo;
        });
        // Type Infos
        props.typeInfos.forEach(function (typInfo) {
            _this.typeInfosMap[typInfo.name] = typInfo;
        });
        return;
    }
    AppInfo.prototype.getServiceInfos = function () {
        return Object.values(this.serviceInfosMap);
    };
    AppInfo.prototype.getServiceInfo = function (name) {
        return this.serviceInfosMap[name];
    };
    // Returns a list of all EntityInfos in the App
    AppInfo.prototype.listEntityInfos = function () {
        return Object.values(this.serviceInfosMap)
            .map(function (svc) { return svc.entityInfos; })
            .flat();
    };
    AppInfo.prototype.getEntityInfo = function (serviceName, entityName) {
        var serviceInfo = this.getServiceInfo(serviceName);
        var entityInfo = serviceInfo.getEntityInfo(entityName);
        return entityInfo;
    };
    AppInfo.prototype.getEntityInfoByNamespace = function (ns) {
        var serviceName = snakeCase(ns.service);
        var entityName = snakeCase(ns.entity);
        var svcInfo = this.getServiceInfo(serviceName);
        if (!svcInfo) {
            throw new Error("ServiceInfo not found for service ".concat(serviceName));
        }
        // Service Level
        var entityInfo = svcInfo.getEntityInfo(entityName);
        if (!entityInfo) {
            throw new Error("EntityInfo not found for entity ".concat(entityName, " in service ").concat(serviceName));
        }
        return entityInfo;
    };
    AppInfo.prototype.updateEntityInfo = function (ei) {
        var serviceInfo = this.getServiceInfo(ei.serviceName);
        serviceInfo.entityInfos.forEach(function (v, index) {
            if (ei.name === v.name) {
                serviceInfo.entityInfos[index] = ei;
                return;
            }
        });
    };
    AppInfo.prototype.getTypeInfo = function (name) {
        return this.typeInfosMap[name];
    };
    AppInfo.prototype.getTypeInfoByNamespace = function (ns) {
        if (!ns.type) {
            throw new Error('getTypeInfoByNamespace() called with empty type name');
        }
        var typeName = snakeCase(ns.type);
        // App Level
        if (!ns.service && !ns.entity) {
            var typeInfo_1 = this.getTypeInfo(typeName);
            if (!typeInfo_1) {
                throw new Error("TypeInfo ".concat(typeName, " not found at the app level"));
            }
            return typeInfo_1;
        }
        if (!ns.service) {
            throw new Error('getTypeInfoByNamespace() called with empty service name but non-empty entity name');
        }
        var serviceName = snakeCase(ns.service);
        var svcInfo = this.getServiceInfo(serviceName);
        if (!svcInfo) {
            throw new Error("ServiceInfo not found for service ".concat(serviceName));
        }
        if (!ns.entity) {
            var typeInfo_2 = svcInfo.getTypeInfo(typeName);
            if (!typeInfo_2) {
                throw new Error("TypeInfo ".concat(typeName, " not found in service ").concat(serviceName));
            }
            return typeInfo_2;
        }
        // Entity Level
        var entityName = snakeCase(ns.entity);
        var entityInfo = svcInfo.getEntityInfo(ns.entity);
        if (!entityInfo) {
            throw new Error("EntityInfo ".concat(entityName, " not found for service ").concat(serviceName));
        }
        var typeInfo = entityInfo.getTypeInfo(typeName);
        if (!typeInfo) {
            throw new Error("TypeInfo ".concat(typeName, " not found in service ").concat(serviceName, " and entity ").concat(entityName));
        }
        return typeInfo;
    };
    AppInfo.prototype.getEnumInfo = function (name) {
        return this.enumInfos[name];
    };
    AppInfo.prototype.getEnumInfoByNamespace = function (ns) {
        if (!ns.enum) {
            throw new Error('getTypeInfoByNamespace() called with empty enum name');
        }
        var enumName = snakeCase(ns.enum);
        // App Level
        if (!ns.service && !ns.entity) {
            return this.getEnumInfo(enumName);
        }
        var svcInfo = this.getServiceInfo(ns.service);
        if (!svcInfo) {
            throw new Error("ServiceInfo not found for service \"".concat(ns.service, "\""));
        }
        // Service Level
        if (!ns.entity) {
            return svcInfo.getEnumInfo(enumName);
        }
        // Entity Level
        var entInfo = svcInfo.getEntityInfo(ns.entity);
        return entInfo.getEnumInfo(enumName);
    };
    return AppInfo;
}());
export { AppInfo };
