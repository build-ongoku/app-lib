import { camelCase, capitalCase, pascalCase, snakeCase } from 'change-case';
/* * * * * *
 * Name
 * * * * * */
// TODO: Change AppV3 to use IName for all names e.g. field.name, entity.name etc.
export var acronyms = ['api', 'dal', 'http', 'https', 'id', 'jwt', 'sha', 'ui', 'url', 'usa', 'uuid'];
var Name = /** @class */ (function () {
    function Name(raw) {
        // Convert to snake case
        this.raw = snakeCase(raw);
    }
    Name.prototype.equal = function (other) {
        return this.raw === other.toRaw();
    };
    Name.prototype.equalString = function (other) {
        return this.raw === snakeCase(other);
    };
    Name.prototype.append = function (suffix) {
        // convert suffix to snake case
        return new Name(this.raw + '_' + snakeCase(suffix));
    };
    Name.prototype.toRaw = function () {
        return this.raw;
    };
    Name.prototype.toCapital = function () {
        var str = capitalCase(this.raw);
        return capitalizeAcronyms(str);
    };
    Name.prototype.toSnake = function () {
        return snakeCase(this.raw);
    };
    Name.prototype.toPascal = function () {
        var str = pascalCase(this.raw);
        return capitalizeAcronyms(str);
    };
    Name.prototype.toCamel = function () {
        var str = camelCase(this.raw);
        // Issue: camelCase handles `line_1` as `line_1` instead of `line1`, so we need to handle it manually
        // Replace `_<number>` with just the number
        str = str.replace(/_([0-9]+)/g, '$1');
        // Capitalize acronyms
        str = capitalizeAcronyms(str);
        return str;
    };
    Name.prototype.toFieldName = function () {
        return this.toCamel();
    };
    return Name;
}());
export { Name };
var capitalizeAcronyms = function (str) {
    acronyms.forEach(function (acronym) {
        str = str.replace(pascalCase(acronym), acronym.toUpperCase());
    });
    return str;
};
export var pluralize = function (str) {
    // Have some overrides
    var overrides = {
        person: 'people',
        child: 'children',
        foot: 'feet',
        tooth: 'teeth',
        goose: 'geese',
    };
    // If there is an override, use it
    if (overrides[str]) {
        return overrides[str];
    }
    // If it ends with 's', 'x', 'z', 'ch', 'sh', add 'es'
    if (str.endsWith('s') || str.endsWith('x') || str.endsWith('z') || str.endsWith('ch') || str.endsWith('sh')) {
        return str + 'es';
    }
    // If it ends with 'y' and the letter before 'y' is a consonant, replace 'y' with 'ies'
    if (str.endsWith('y') && !'aeiou'.includes(str[str.length - 2])) {
        return str.slice(0, -1) + 'ies';
    }
    // Otherwise, just add 's'
    return str + 's';
};
/* * * * * *
 * Classes: Primary Namespace + Namespace
 * * * * * */
// export class PrimaryNamespace implements IPrimaryNamespace {
//     service?: Name
//     entity?: Name
//     raw: PrimaryNamespaceReq
//     constructor(req: PrimaryNamespaceReq) {
//         this.raw = req
//         this.service = req.service ? new Name(req.service) : undefined
//         this.entity = req.entity ? new Name(req.entity) : undefined
//     }
//     toRaw(): PrimaryNamespaceReq {
//         return this.raw
//     }
//     toString(): string {
//         let str = '$'
//         if (this.service) {
//             str = str + `.service[${this.service}]`
//         }
//         if (this.entity) {
//             str = str + `.entity[${this.entity}]`
//         }
//         return str
//     }
//     toURLPath(): string {
//         let str = '/'
//         if (this.service) {
//             str = str + `${this.service}`
//         }
//         if (this.entity) {
//             str = str + `/${this.entity}`
//         }
//         return str
//     }
// }
var Namespace = /** @class */ (function () {
    function Namespace(req) {
        // Store everything in snake case
        this.service = req.service ? new Name(req.service) : undefined;
        this.entity = req.entity ? new Name(req.entity) : undefined;
        this.raw = req;
        if (req.types && req.types.length > 0) {
            this.types = req.types.map(function (type) { return new Name(type); });
        }
        this.enum = req.enum ? new Name(req.enum) : undefined;
        this.method = req.method ? new Name(req.method) : undefined;
    }
    Namespace.prototype.toRaw = function () {
        return this.raw;
    };
    Namespace.prototype.getTypeName = function () {
        if (!this.types || this.types.length === 0) {
            throw new Error('Namespace does not have types');
        }
        return this.types[0];
    };
    Namespace.prototype.toString = function () {
        var str = '$';
        if (this.service) {
            str = str + ".service[".concat(this.service.toSnake(), "]");
        }
        if (this.entity) {
            str = str + ".entity[".concat(this.entity.toSnake(), "]");
        }
        if (this.types && this.types.length > 0) {
            str = str + ".types[".concat(this.types.map(function (type) { return type.toSnake(); }).join('.'), "]");
        }
        if (this.enum) {
            str = str + ".enum[".concat(this.enum.toSnake(), "]");
        }
        if (this.method) {
            str = str + ".method[".concat(this.method.toSnake(), "]");
        }
        return str;
    };
    Namespace.prototype.toLabel = function () {
        var sep = ' - ';
        var str = '';
        if (this.service) {
            str = str + this.service.toCapital();
        }
        if (this.entity) {
            str = str + "".concat(sep).concat(this.entity.toCapital());
        }
        if (this.types && this.types.length > 0) {
            str = str + "".concat(sep).concat(this.types.map(function (type) { return type.toCapital(); }).join('.'));
        }
        if (this.enum) {
            str = str + "".concat(sep).concat(this.enum.toCapital());
        }
        if (this.method) {
            str = str + "".concat(sep).concat(this.method.toCapital());
        }
        return str;
    };
    Namespace.prototype.toURLPath = function () {
        var str = '/';
        if (this.service) {
            str = str + this.service.toSnake();
        }
        if (this.entity) {
            str = str + "/" + this.entity.toSnake();
        }
        return str;
    };
    Namespace.prototype.equal = function (other) {
        return this.toString() === other.toString();
    };
    Namespace.prototype.isService = function () {
        // only service is defined
        return !!this.service && !this.entity && (!this.types || this.types.length == 0) && !this.enum && !this.method;
    };
    Namespace.prototype.isEntity = function () {
        // only service && entity is defined
        return !!this.service && !!this.entity && (!this.types || this.types.length == 0) && !this.enum && !this.method;
    };
    Namespace.prototype.isType = function () {
        // type is defined & no enum or method is defined (service & entity can be defined optionally)
        return !!this.types && this.types.length > 0 && !this.enum && !this.method;
    };
    Namespace.prototype.isEnum = function () {
        // enum is defined, and no method is defined (service, entity & types can be defined optionally)
        return !!this.enum && !this.method;
    };
    Namespace.prototype.isMethod = function () {
        // method is defined, no enum or type defined,  (service, entity can be defined optionally)
        return !!this.method && !this.enum && (!this.types || this.types.length == 0);
    };
    return Namespace;
}());
export { Namespace };
// export type NamespaceReqVariant =
//     | ServiceNamespaceReq
//     | EntityNamespaceReq
//     | TypeAppNamespaceReq
//     | TypeServiceNamespaceReq
//     | TypeEntityNamespaceReq
//     | EnumAppNamespaceReq
//     | EnumServiceNamespaceReq
//     | EnumEntityNamespaceReq
//     | EnumTypeNamespaceReq
//     | MethodServiceNamespaceReq
//     | MethodEntityNamespaceReq
// /* * * * * *
//  * IToReq - Conversion
//  * * * * * */
// // IToReq - Convert I*Namespace to *NamespaceReq
// export type IToReq<T extends NamespaceVariant> =
//     // Specific Namespaces
//     // Method
//     T extends IMethodEntityNamespace
//         ? MethodEntityNamespaceReq
//         : T extends IMethodServiceNamespace
//         ? MethodServiceNamespaceReq
//         : // Enum
//         T extends IEnumTypeNamespace
//         ? EnumTypeNamespaceReq
//         : T extends IEnumEntityNamespace
//         ? EnumEntityNamespaceReq
//         : T extends IEnumServiceNamespace
//         ? EnumServiceNamespaceReq
//         : T extends IEnumAppNamespace
//         ? EnumAppNamespaceReq
//         : // Type
//         T extends ITypeEntityNamespace
//         ? TypeEntityNamespaceReq
//         : T extends ITypeServiceNamespace
//         ? TypeServiceNamespaceReq
//         : T extends ITypeAppNamespace
//         ? TypeAppNamespaceReq
//         : // Entity
//         T extends IEntityNamespace
//         ? EntityNamespaceReq
//         : // Service
//         T extends IServiceNamespace
//         ? ServiceNamespaceReq
//         : // More Generic Namespaces
//         T extends IMethodNamespace
//         ? MethodNamespaceReq
//         : T extends IEnumNamespace
//         ? EnumNamespaceReq
//         : T extends ITypeNamespace
//         ? TypeNamespaceReq
//         : T extends INamespace<infer NsReqT>
//         ? NsReqT
//         : never
// export type ReqToI<T extends NamespaceReqVariant> =
//     // Specific Requests
//     // Method
//     T extends MethodEntityNamespaceReq
//         ? IMethodEntityNamespace
//         : T extends MethodServiceNamespaceReq
//         ? IMethodServiceNamespace
//         : // Enum
//         T extends EnumTypeNamespaceReq
//         ? IEnumTypeNamespace
//         : T extends EnumEntityNamespaceReq
//         ? IEnumEntityNamespace
//         : T extends EnumServiceNamespaceReq
//         ? IEnumServiceNamespace
//         : T extends EnumAppNamespaceReq
//         ? IEnumAppNamespace
//         : // Type
//         T extends TypeEntityNamespaceReq
//         ? ITypeEntityNamespace
//         : T extends TypeServiceNamespaceReq
//         ? ITypeServiceNamespace
//         : T extends TypeAppNamespaceReq
//         ? ITypeAppNamespace
//         : // Entity
//         T extends EntityNamespaceReq
//         ? IEntityNamespace
//         : // Service
//         T extends ServiceNamespaceReq
//         ? IServiceNamespace
//         : // More Generic Namespaces
//         T extends MethodNamespaceReq
//         ? IMethodNamespace
//         : T extends EnumNamespaceReq
//         ? IEnumNamespace
//         : T extends TypeNamespaceReq
//         ? ITypeNamespace
//         : T extends NamespaceReq
//         ? INamespace<T>
//         : never
