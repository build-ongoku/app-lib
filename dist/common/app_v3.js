import { EnumKind, ForeignEntityKind, NestedKind } from './fieldkind';
import * as fieldkind from './fieldkind';
import { Namespace, } from './namespacev2';
import { joinURL, makeRequestV2 } from '../providers/provider';
import { capitalCase } from 'change-case';
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
            console.error('Entity not found:', key);
        }
        return ret;
    };
    App.prototype.getServiceEntities = function (nsReq) {
        var ns = new Namespace(nsReq);
        return this.entityInfos.filter(function (ent) { return ent.namespace.service.equal(ns.service); });
    };
    App.prototype.getServiceMethods = function (nsReq) {
        var ns = new Namespace(nsReq);
        return this.methods.filter(function (m) { return m.namespace.service.equal(ns.service) && !m.namespace.entity; });
    };
    App.prototype.getTypeInfo = function (nsReq) {
        var ns = new Namespace(nsReq);
        console.log('[App] [getTypeInfo] [ns]', 'namespace', ns.toString(), 'typesMap', this.typesMap);
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
                if (mUnsafe.namespace.entity && mUnsafe.namespace.entity !== entNs.entity) {
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
            throw new Error('Service name is required');
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
                throw new Error('Enum field does not have a reference namespace');
            }
            if (!this.namespace.enum) {
                throw new Error('Enum field does not have a reference enum');
            }
        }
        if (this.kind === NestedKind) {
            if (!this.namespace) {
                throw new Error('Nested field does not have a reference namespace');
            }
            if (!this.namespace.types || this.namespace.types.length === 0) {
                throw new Error('Nested field does not have a reference type');
            }
        }
        if (this.kind === ForeignEntityKind) {
            if (!this.namespace) {
                throw new Error('ForeignEntity field does not have a reference namespace');
            }
            if (!this.namespace.entity) {
                throw new Error('ForeignEntity field does not have a reference entity');
            }
        }
    }
    Dtype.prototype.getEmptyValue = function (appInfo) {
        // Only point in getting the empty value is for nested fields
        switch (this.kind) {
            case fieldkind.ForeignEntityKind:
                return undefined;
            case fieldkind.EnumKind: {
                return undefined;
            }
            case fieldkind.NestedKind: {
                // Get the type info for the nested field
                var ns = this.namespace;
                if (!ns) {
                    throw new Error('Nested field does not have a reference namespace');
                }
                // Assert that T is ITypeMinimal
                var fieldTypeInfo = appInfo.getTypeInfo(ns.toRaw());
                if (!fieldTypeInfo) {
                    throw new Error('Type Info not found for field');
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
            console.log('[EntityInfo] [funcGetNameFriendly] [default] called');
            return info.getName().toCapital();
        };
        // Default (Overidable)
        this.funcGetEntityName = function (r, info) {
            var _r = r;
            if (_r.name) {
                // Simple string name
                if (typeof _r.name === 'string') {
                    return _r.name;
                }
                // Person Name (First + Last)
                if (_r.name.firstName && _r.name.lastName) {
                    return "".concat(_r.name.firstName, " ").concat(_r.name.lastName);
                }
            }
            return r.id;
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
            throw new Error('Service and Entity name is required');
        }
    }
    EntityInfo.prototype.getTypeNamespace = function () {
        // Take the entity namespace and add the type to it
        var ns = new Namespace({ service: this.namespace.service.toRaw(), entity: this.namespace.entity.toRaw(), types: [this.namespace.entity.toRaw()] });
        return ns;
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
        if (this.relationship === 'child_of') {
            return this.type === 'one' ? this.name.append('id') : this.name.append('ids');
        }
        throw new Error('assoctaion.toFieldName() not implemented for associations of type `parent_of`. This is because the parent entity does not have a field for the child entity.');
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
            throw new Error('Enum namespace does not have a reference enum');
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
            throw new Error('Service and Method name is required');
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
        return joinURL('v' + this.version, this.methodNamespace.toURLPath(), this.relPath);
    };
    MethodAPI.prototype.makeAPIRequest = function (req) {
        console.debug('[MethodAPI] [makeAPIRequest]', 'namespace', this.methodNamespace.toString(), 'req', req);
        var relPath = this.getEndpoint();
        return makeRequestV2({ relativePath: relPath, method: this.method, data: req });
    };
    return MethodAPI;
}());
