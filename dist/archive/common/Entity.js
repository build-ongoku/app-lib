var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { TypeInfo } from '@ongoku/app-lib/src/archive/common/Type';
import { capitalCase } from 'change-case';
import { WithMethods } from './method';
// EntityInfo holds all the information about how to render/manipulate a particular Entity type.
var EntityInfo = /** @class */ (function (_super) {
    __extends(EntityInfo, _super);
    // 1. Custom props/methods. Each implementation has to define these.
    function EntityInfo(props) {
        var _a, _b;
        var _this = _super.call(this, props) || this;
        _this.typeInfos = {};
        _this.enumInfos = {};
        // default function, overridable
        _this.nameFunc = function (info) {
            return info.name;
        };
        // default function, overridable
        _this.nameFormattedFunc = function (info) {
            return capitalCase(info.getName());
        };
        // default function, overridable
        _this.entityNameFunc = function (r, info) {
            return r.id;
        };
        // overridable
        _this.entityHumanNameFunc = function (r, info) {
            var _r = r;
            if (_r.name) {
                // Simple string name
                if (typeof _r.name === 'string') {
                    return capitalCase(_r.name);
                }
                // Person Name (First + Last)
                if (_r.name.first_name && _r.name.last_name) {
                    return "".concat(capitalCase(_r.name.first_name), " ").concat(capitalCase(_r.name.last_name));
                }
            }
            return r.id;
        };
        _this.columnsFieldsForListView = ['id', 'created_at', 'updated_at'];
        _this.typeInfo = new TypeInfo(props);
        (_a = props.typeInfos) === null || _a === void 0 ? void 0 : _a.forEach(function (typeInfo) {
            _this.typeInfos[typeInfo.name] = typeInfo;
        });
        (_b = props.enumInfos) === null || _b === void 0 ? void 0 : _b.forEach(function (enumInfo) {
            _this.enumInfos[enumInfo.name] = enumInfo;
        });
        _this.serviceName = props.serviceName;
        _this.getEmptyInstance =
            props.getEmptyInstance ||
                (function () {
                    return {
                        id: '',
                        created_at: new Date(),
                        updated_at: new Date(),
                        deleted_at: null,
                    };
                });
        _this.withMethods = new WithMethods(props.withMethodsReq);
        return _this;
    }
    // 3. Default props/methods, which could be overridden later (or not)
    // Name of the Entity Type
    EntityInfo.prototype.getName = function () {
        return this.nameFunc(this);
    };
    // Human readable Name of the Entity Type
    EntityInfo.prototype.getNameFormatted = function () {
        return this.nameFormattedFunc(this);
    };
    // Name of an Entity instance
    EntityInfo.prototype.getEntityName = function (r) {
        return this.entityNameFunc(r, this);
    };
    // Human Friendly name for an instance of an entity
    EntityInfo.prototype.getEntityHumanName = function (r) {
        return this.entityHumanNameFunc(r, this);
    };
    EntityInfo.prototype.getTypeInfo = function (name) {
        // if name is same as entity, return the entity typeInfo
        if (name == this.name) {
            return this.typeInfo;
        }
        return this.typeInfos[name];
    };
    EntityInfo.prototype.getEnumInfo = function (name) {
        return this.enumInfos[name];
    };
    // Inherited methods (forwarding)
    EntityInfo.prototype.getMethod = function (name) {
        return this.withMethods.getMethod(name);
    };
    return EntityInfo;
}(TypeInfo));
export { EntityInfo };
