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
import { Name, Namespace, } from "./namespace";
import { joinURL } from "../utils/api/util";
import { makeRequest } from "../utils/api/common";
import { capitalCase } from "change-case";
var App = /** @class */ (function () {
    function App(req) {
        var _this = this;
        this.services = [];
        this.entityInfos = [];
        this.typeInfos = [];
        this.enums = [];
        this.methods = [];
        this.servicesMap = {};
        this.entitiesMap = {};
        this.typesMap = {};
        this.enumsMap = {};
        this.methodsMap = {};
        this.name = req.name;
        req.services.forEach(function (elem) {
            _this.services.push(new Service(elem));
        });
        req.entityInfos.forEach(function (elem) {
            _this.entityInfos.push(new EntityInfo(elem));
        });
        req.typeInfos.forEach(function (elem) {
            _this.typeInfos.push(new TypeInfo(elem));
        });
        req.enums.forEach(function (elem) {
            _this.enums.push(new Enum(elem));
        });
        req.methods.forEach(function (elem) {
            _this.methods.push(new Method(elem));
        });
        this.services.forEach(function (elem) {
            _this.servicesMap[elem.namespace.toString()] = elem;
        });
        this.entityInfos.forEach(function (elem) {
            _this.entitiesMap[elem.namespace.toString()] = elem;
        });
        this.typeInfos.forEach(function (elem) {
            _this.typesMap[elem.namespace.toString()] = elem;
        });
        this.enums.forEach(function (elem) {
            _this.enumsMap[elem.namespace.toString()] = elem;
        });
        this.methods.forEach(function (elem) {
            _this.methodsMap[elem.namespace.toString()] = elem;
        });
    }
    App.prototype.getName = function () {
        return this.name;
    };
    App.prototype.getNameFriendly = function () {
        return capitalCase(this.name.toCapital());
    };
    App.prototype.getService = function (nsReq) {
        var ns = new Namespace(nsReq);
        return this.servicesMap[ns.toString()];
    };
    App.prototype.getEntityInfo = function (nsReq) {
        var ns = new Namespace(nsReq);
        var key = ns.toString();
        var ret = this.entitiesMap[ns.toString()];
        if (!ret) {
            console.error("Entity not found:", key);
        }
        return ret;
    };
    App.prototype.getServiceEntities = function (nsReq) {
        var ns = new Namespace(nsReq);
        return this.entityInfos.filter(function (ent) {
            return ent.namespace.service.equal(ns.service);
        });
    };
    App.prototype.getServiceMethods = function (nsReq) {
        var ns = new Namespace(nsReq);
        return this.methods.filter(function (m) { return m.namespace.service.equal(ns.service) && !m.namespace.entity; });
    };
    App.prototype.getTypeInfo = function (nsReq) {
        var ns = new Namespace(nsReq);
        console.debug("[App] [getTypeInfo] [ns]", "namespace", ns.toString(), "typesMap", this.typesMap);
        return this.typesMap[ns.toString()];
    };
    App.prototype.getEnum = function (nsReq) {
        var ns = new Namespace(nsReq);
        return this.enumsMap[ns.toString()];
    };
    App.prototype.getMethod = function (nsReq) {
        var ns = new Namespace(nsReq);
        var searchTerm = ns.toString();
        var mthd = this.methodsMap[searchTerm];
        if (!mthd) {
            throw new Error("Method not found: ".concat(searchTerm));
        }
        return mthd;
    };
    App.prototype.getEntityMethods = function (entNs) {
        // Loop through all the methods and return the ones that match the entity namespace
        return this.methods.filter(function (m) {
            if (m.namespace.service !== entNs.service) {
                return false;
            }
            {
                // If the type of m IMethodEntityNamespace?
                var mUnsafe = m;
                if (mUnsafe.namespace.entity &&
                    mUnsafe.namespace.entity !== entNs.entity) {
                    return false;
                }
            }
            return true;
        });
    };
    return App;
}());
export { App };
var Service = /** @class */ (function () {
    function Service(req) {
        this.namespace = new Namespace(req.namespace);
        if (!this.namespace.service) {
            throw new Error("Service name is required");
        }
        this.description = req.description;
        this.source = req.source;
    }
    Service.prototype.getName = function () {
        return this.namespace.service;
    };
    Service.prototype.getNameFriendly = function () {
        return this.namespace.service.toCapital();
    };
    return Service;
}());
export { Service };
var TypeInfo = /** @class */ (function () {
    function TypeInfo(req) {
        var _this = this;
        this.fields = [];
        this.fieldsMap = {};
        this.getEmptyObjectFunc = function (appInfo) {
            return {};
        };
        this.namespace = new Namespace(req.namespace);
        this.fields = req.fields.map(function (f) { return new Field(f); });
        this.fields.forEach(function (f) {
            _this.fieldsMap[f.name.toRaw()] = f;
        });
        if (req.getEmptyObjectFunc) {
            this.getEmptyObjectFunc = req.getEmptyObjectFunc;
        }
    }
    TypeInfo.prototype.getField = function (name) {
        return this.fieldsMap[name];
    };
    TypeInfo.prototype.getTypeName = function (r) {
        return r.id;
    };
    TypeInfo.prototype.getEmptyObject = function (appInfo) {
        return this.getEmptyObjectFunc(appInfo);
    };
    return TypeInfo;
}());
export { TypeInfo };
var Field = /** @class */ (function () {
    function Field(req) {
        // Default (Overidable)
        this.getLabelFunc = function (field) {
            return field.name.toCapital();
        };
        this.name = req.name;
        this.dtype = new Dtype(req.dtype);
        this.isRepeated = req.isRepeated;
        this.isMetaField = req.isMetaField;
        this.excludeFromForm = req.excludeFromForm;
        this.isOptional = req.isOptional;
    }
    Field.prototype.getLabel = function () {
        return this.getLabelFunc(this);
    };
    Field.prototype.getFieldValue = function (obj) {
        // Loop though all the fields in the object and get the value for this field
        var _obj = obj;
        return _obj[this.name.toFieldName()];
    };
    return Field;
}());
export { Field };
var Dtype = /** @class */ (function () {
    function Dtype(req) {
        this.name = req.name;
        this.kind = req.kind;
        if (req.namespace) {
            this.namespace = new Namespace(req.namespace);
        }
        if (this.kind === EnumKind) {
            if (!this.namespace) {
                throw new Error("Enum field does not have a reference namespace");
            }
            if (!this.namespace.enum) {
                throw new Error("Enum field does not have a reference enum");
            }
        }
        if (this.kind === NestedKind) {
            if (!this.namespace) {
                throw new Error("Nested field does not have a reference namespace");
            }
            if (!this.namespace.types || this.namespace.types.length === 0) {
                throw new Error("Nested field does not have a reference type");
            }
        }
        if (this.kind === ForeignEntityKind) {
            if (!this.namespace) {
                throw new Error("ForeignEntity field does not have a reference namespace");
            }
            if (!this.namespace.entity) {
                throw new Error("ForeignEntity field does not have a reference entity");
            }
        }
    }
    Dtype.prototype.getEmptyValue = function (appInfo) {
        // Only point in getting the empty value is for nested fields
        switch (this.kind) {
            case ForeignEntityKind:
                return undefined;
            case EnumKind: {
                return undefined;
            }
            case NestedKind: {
                // Get the type info for the nested field
                var ns = this.namespace;
                if (!ns) {
                    throw new Error("Nested field does not have a reference namespace");
                }
                // Assert that T is ITypeMinimal
                var fieldTypeInfo = appInfo.getTypeInfo(ns.toRaw());
                if (!fieldTypeInfo) {
                    throw new Error("Type Info not found for field");
                }
                return fieldTypeInfo.getEmptyObject(appInfo);
            }
            default:
                return undefined;
        }
    };
    return Dtype;
}());
export { Dtype };
var EntityInfo = /** @class */ (function () {
    function EntityInfo(req) {
        var _this = this;
        this.associations = [];
        this.actions = [];
        // Default (Overidable)
        this.funcGetNameFriendly = function (info) {
            return info.getName().toCapital();
        };
        // Default (Overidable)
        this.funcGetEntityName = function (r, info) {
            var _r = r;
            var name = r.id;
            if (_r.name) {
                // Simple string name
                if (typeof _r.name === "string") {
                    name = _r.name;
                }
                else if (_r.name.firstName && _r.name.lastName) {
                    // Person Name (First + Last)
                    name = "".concat(_r.name.firstName, " ").concat(_r.name.lastName);
                }
            }
            else if (_r.title) {
                name = _r.title;
            }
            else if (_r.key) {
                name = _r.key;
            }
            if (r.deletedAt) {
                name += " (Deleted)";
            }
            return name;
        };
        // Default (Overidable)
        this.funcGetEntityNameFriendly = function (r, info) {
            return info.getEntityName(r);
        };
        this.namespace = new Namespace(req.namespace);
        req.actions.forEach(function (elem) {
            _this.actions.push(new EntityAction(elem));
        });
        req.associations.forEach(function (elem) {
            _this.associations.push(new EntityAssociation(elem));
        });
        if (!this.namespace.service || !this.namespace.entity) {
            throw new Error("Service and Entity name is required");
        }
    }
    EntityInfo.prototype.getTypeNamespace = function () {
        // Take the entity namespace and add the type to it
        var ns = new Namespace({
            service: this.namespace.service.toRaw(),
            entity: this.namespace.entity.toRaw(),
            types: [this.namespace.entity.toRaw()],
        });
        return ns;
    };
    EntityInfo.prototype.getTypeInfo = function (appInfo) {
        return appInfo.getTypeInfo(this.getTypeNamespace().toRaw());
    };
    EntityInfo.prototype.getName = function () {
        return this.namespace.entity;
    };
    EntityInfo.prototype.getNameFriendly = function () {
        return this.funcGetNameFriendly(this);
    };
    EntityInfo.prototype.getEntityName = function (r) {
        return this.funcGetEntityName(r, this);
    };
    EntityInfo.prototype.getEntityNameFriendly = function (r) {
        return this.funcGetEntityNameFriendly(r, this);
    };
    return EntityInfo;
}());
export { EntityInfo };
var EntityAssociation = /** @class */ (function () {
    function EntityAssociation(req) {
        this.relationship = req.relationship;
        this.type = req.type;
        this.entityNamespace = new Namespace(req.entityNamespace);
        this.name = req.name;
        this.otherAssociationName = req.otherAssociationName;
    }
    EntityAssociation.prototype.toFieldName = function () {
        if (this.relationship === "child_of") {
            return this.type === "one"
                ? this.name.append("id")
                : this.name.append("ids");
        }
        throw new Error("assoctaion.toFieldName() not implemented for associations of type `parent_of`. This is because the parent entity does not have a field for the child entity.");
    };
    return EntityAssociation;
}());
export { EntityAssociation };
var EntityAction = /** @class */ (function () {
    function EntityAction(req) {
        this.name = req.name;
        this.methodNamespace = new Namespace(req.methodNamespace);
    }
    EntityAction.prototype.getLabel = function () {
        return this.name.toCapital();
    };
    return EntityAction;
}());
var Enum = /** @class */ (function () {
    function Enum(req) {
        var _this = this;
        this.values = [];
        this.namespace = new Namespace(req.namespace);
        req.values.forEach(function (elem) {
            _this.values.push(new EnumValue(elem));
        });
        if (!this.namespace.enum) {
            throw new Error("Enum namespace does not have a reference enum");
        }
    }
    return Enum;
}());
export { Enum };
var EnumValue = /** @class */ (function () {
    function EnumValue(req) {
        this.id = req.id;
        this.value = req.value;
        this.description = req.description;
        this.displayValue = req.displayValue;
    }
    EnumValue.prototype.getDisplayValue = function () {
        return this.displayValue || capitalCase(this.value);
    };
    return EnumValue;
}());
export { EnumValue };
var Method = /** @class */ (function () {
    function Method(req) {
        this.namespace = new Namespace(req.namespace);
        if (req.requestDtype) {
            this.requestDtype = new Dtype(req.requestDtype);
        }
        if (req.responseDtype) {
            this.responseDtype = new Dtype(req.responseDtype);
        }
        this.apis = req.apis.map(function (api) { return new MethodAPI(api); });
        if (!this.namespace.service || !this.namespace.method) {
            throw new Error("Service and Method name is required");
        }
    }
    Method.prototype.getAPI = function () {
        if (this.apis.length > 0) {
            return this.apis[0];
        }
    };
    return Method;
}());
export { Method };
var MethodAPI = /** @class */ (function () {
    function MethodAPI(req) {
        this.method = req.method;
        this.relPath = req.path;
        this.version = req.version;
        this.methodNamespace = new Namespace(req.methodNamespace);
    }
    MethodAPI.prototype.getEndpoint = function () {
        return joinURL("v" + this.version, this.methodNamespace.toURLPath(), this.relPath);
    };
    MethodAPI.prototype.makeAPIRequest = function (req) {
        console.debug("[MethodAPI] [makeAPIRequest]", "namespace", this.methodNamespace.toString(), "req", req);
        var relPath = this.getEndpoint();
        return makeRequest({
            relativePath: relPath,
            method: this.method,
            data: req,
        });
    };
    return MethodAPI;
}());
var DefaultFieldKind = {
    name: "default",
};
export var StringKind = __assign(__assign({}, DefaultFieldKind), { name: "string" });
export var NumberKind = __assign(__assign({}, DefaultFieldKind), { name: "number" });
export var FloatKind = __assign(__assign({}, DefaultFieldKind), { name: "float" });
export var BoolKind = __assign(__assign({}, DefaultFieldKind), { name: "boolean" });
export var DateKind = __assign(__assign({}, DefaultFieldKind), { name: "date" });
export var TimestampKind = __assign(__assign({}, DefaultFieldKind), { name: "timestamp" });
export var IDKind = __assign(__assign({}, StringKind), { name: "id" });
export var EmailKind = __assign(__assign({}, StringKind), { name: "email" });
export var LinkKind = __assign(__assign({}, StringKind), { name: "link" });
export var SecretDecryptableKind = __assign(__assign({}, StringKind), { name: "secret_decryptable" });
export var GenericDataKind = __assign(__assign({}, StringKind), { name: "generic data" });
export var MoneyKind = __assign(__assign({}, NumberKind), { name: "money" });
export var EnumKind = __assign(__assign({}, DefaultFieldKind), { name: "enum" });
// NestedKind refers to fields that represent sub-types or sub-objects. Basically types that are made of other fields.
export var NestedKind = __assign(__assign({}, DefaultFieldKind), { name: "nested" });
// ForeignEntityKind refers to fields that reference another entity
export var ForeignEntityKind = __assign(__assign({}, DefaultFieldKind), { name: "foreign_entity" });
// ForeignEntityKind refers to fields that reference another entity
export var FileKind = __assign(__assign({}, ForeignEntityKind), { name: "file" });
export var ConditionKind = __assign(__assign({}, DefaultFieldKind), { name: "condition" });
/* * * * * *
 * Filters
 * * * * * */
export var Operator;
(function (Operator) {
    Operator["EQUAL"] = "EQUAL";
    Operator["NOT_EQUAL"] = "NOT_EQUAL";
    Operator["IN"] = "IN";
    Operator["GREATER_THAN"] = "GREATER_THAN";
    Operator["GREATER_THAN_EQUAL"] = "GREATER_THAN_EQUAL";
    Operator["LESS_THAN"] = "LESS_THAN";
    Operator["LESS_THAN_EQUAL"] = "LESS_THAN_EQUAL";
    Operator["LIKE"] = "LIKE";
    Operator["ILIKE"] = "ILIKE";
    Operator["NOT_LIKE"] = "NOT_LIKE";
    Operator["IS_NULL"] = "IS_NULL";
    Operator["IS_NOT_NULL"] = "IS_NOT_NULL";
})(Operator || (Operator = {}));
/**
 * Ongoku-specific App extension
 */
var OngokuApp = /** @class */ (function (_super) {
    __extends(OngokuApp, _super);
    function OngokuApp(req, config) {
        var _this = _super.call(this, req) || this;
        // Additional Ongoku-specific state
        _this._initialized = false;
        _this.apiEndpoint = config === null || config === void 0 ? void 0 : config.apiEndpoint;
        _this.authToken = config === null || config === void 0 ? void 0 : config.authToken;
        return _this;
    }
    Object.defineProperty(OngokuApp.prototype, "isInitialized", {
        // Getter methods for Ongoku-specific state
        get: function () {
            return this._initialized;
        },
        enumerable: false,
        configurable: true
    });
    // Setter methods for Ongoku-specific state
    OngokuApp.prototype.setInitialized = function (value) {
        this._initialized = value;
    };
    // Create a simplified clone for immutability
    OngokuApp.prototype.clone = function () {
        var newApp = new OngokuApp({
            name: this.name,
            services: [],
            entityInfos: [],
            typeInfos: [],
            enums: [],
            methods: [],
        }, {
            apiEndpoint: this.apiEndpoint,
            authToken: this.authToken,
        });
        newApp.setInitialized(this._initialized);
        return newApp;
    };
    return OngokuApp;
}(App));
export { OngokuApp };
/**
 * Helper to create a default minimal AppReq
 */
export var createDefaultAppReq = function (name) {
    if (name === void 0) { name = "ongoku"; }
    return ({
        name: new Name(name),
        services: [],
        entityInfos: [],
        typeInfos: [],
        enums: [],
        methods: [],
    });
};
