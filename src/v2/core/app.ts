import {
  EntityNamespaceReq,
  EnumNamespaceReq,
  IEntityNamespace,
  IEnumNamespace,
  IMethodEntityNamespace,
  IMethodNamespace,
  IServiceNamespace,
  ITypeEntityNamespace,
  ITypeNamespace,
  MethodEntityNamespaceReq,
  MethodNamespaceReq,
  Name,
  Namespace,
  ServiceNamespaceReq,
  TypeNamespaceReq,
} from "./namespace";
import { GokuHTTPResponse, joinURL } from "../utils/api/util";
import { makeRequest } from "../utils/api/common";
import { capitalCase } from "change-case";
import { MetaFieldKeys } from "../utils/types";
import * as scalars from "./scalars";

/* * * * * *
 * App
 * * * * * */

export interface IApp {
  getName(): Name;
  getNameFriendly(): string;

  services: IService[];
  entityInfos: IEntityInfo<any>[];
  typeInfos: ITypeInfo<ITypeNamespace>[];
  enums: IEnum[];
  methods: IMethod<IMethodNamespace>[];

  getService(namespace: ServiceNamespaceReq): Service;
  getEntityInfo<E extends IEntityMinimal>(
    namespace: EntityNamespaceReq
  ): EntityInfo<E> | undefined;
  getServiceEntities(namespace: ServiceNamespaceReq): EntityInfo<any>[];
  getTypeInfo<T extends ITypeMinimal>(namespace: TypeNamespaceReq): TypeInfo<T>;
  getEnum(namespace: EnumNamespaceReq): Enum;
  getMethod(name: MethodNamespaceReq): Method<IMethodNamespace>;

  getEntityMethods(namespace: IEntityNamespace): IMethod[];
}

export interface AppReq {
  name: Name;
  services: ServiceReq[];
  entityInfos: EntityInfoReq[];
  typeInfos: TypeInfoReq[];
  enums: EnumReq[];
  methods: MethodReq[];
}

export class App implements IApp {
  name: Name;

  services: Service[] = [];
  entityInfos: EntityInfo<any>[] = [];
  typeInfos: TypeInfo<any>[] = [];
  enums: Enum[] = [];
  methods: Method<IMethodNamespace>[] = [];

  servicesMap: Record<string, Service> = {};
  entitiesMap: Record<string, EntityInfo<any>> = {};
  typesMap: Record<string, TypeInfo<any>> = {};
  enumsMap: Record<string, Enum> = {};
  methodsMap: Record<string, Method<IMethodNamespace>> = {};

  constructor(req: AppReq) {
    this.name = req.name;

    req.services.forEach((elem) => {
      this.services.push(new Service(elem));
    });
    req.entityInfos.forEach((elem) => {
      this.entityInfos.push(new EntityInfo(elem));
    });
    req.typeInfos.forEach((elem) => {
      this.typeInfos.push(new TypeInfo(elem));
    });
    req.enums.forEach((elem) => {
      this.enums.push(new Enum(elem));
    });
    req.methods.forEach((elem) => {
      this.methods.push(new Method(elem));
    });

    this.services.forEach((elem) => {
      this.servicesMap[elem.namespace.toString()] = elem;
    });
    this.entityInfos.forEach((elem) => {
      this.entitiesMap[elem.namespace.toString()] = elem;
    });
    this.typeInfos.forEach((elem) => {
      this.typesMap[elem.namespace.toString()] = elem;
    });
    this.enums.forEach((elem) => {
      this.enumsMap[elem.namespace.toString()] = elem;
    });
    this.methods.forEach((elem) => {
      this.methodsMap[elem.namespace.toString()] = elem;
    });
  }

  getName(): Name {
    return this.name;
  }

  getNameFriendly(): string {
    return capitalCase(this.name.toCapital());
  }

  getService(nsReq: ServiceNamespaceReq): Service {
    const ns = new Namespace(nsReq);
    return this.servicesMap[ns.toString()];
  }

  getEntityInfo<E extends IEntityMinimal>(
    nsReq: EntityNamespaceReq
  ): EntityInfo<E> | undefined {
    const ns = new Namespace(nsReq);
    const key = ns.toString();
    const ret = this.entitiesMap[ns.toString()];
    if (!ret) {
      console.error("Entity not found:", key);
    }
    return ret;
  }

  getServiceEntities(nsReq: ServiceNamespaceReq): EntityInfo<any>[] {
    const ns = new Namespace(nsReq);
    return this.entityInfos.filter((ent) =>
      ent.namespace.service!.equal(ns.service!)
    );
  }

  getServiceMethods(nsReq: ServiceNamespaceReq): IMethod[] {
    const ns = new Namespace(nsReq);
    return this.methods.filter(
      (m) => m.namespace.service!.equal(ns.service!) && !m.namespace.entity
    );
  }

  getTypeInfo<T extends ITypeMinimal>(nsReq: TypeNamespaceReq): TypeInfo<T> {
    const ns = new Namespace(nsReq);
    console.debug(
      "[App] [getTypeInfo] [ns]",
      "namespace",
      ns.toString(),
      "typesMap",
      this.typesMap
    );
    return this.typesMap[ns.toString()];
  }

  getEnum(nsReq: EnumNamespaceReq): Enum {
    const ns = new Namespace(nsReq);
    return this.enumsMap[ns.toString()];
  }

  getMethod(nsReq: MethodNamespaceReq): Method {
    const ns = new Namespace(nsReq);
    const searchTerm = ns.toString();
    const mthd = this.methodsMap[searchTerm];
    if (!mthd) {
      throw new Error(`Method not found: ${searchTerm}`);
    }
    return mthd;
  }

  getEntityMethods(entNs: IEntityNamespace): IMethod[] {
    // Loop through all the methods and return the ones that match the entity namespace

    return this.methods.filter((m) => {
      if (m.namespace.service !== entNs.service) {
        return false;
      }
      {
        // If the type of m IMethodEntityNamespace?
        const mUnsafe = m as Method<IMethodEntityNamespace>;
        if (
          mUnsafe.namespace.entity &&
          mUnsafe.namespace.entity !== entNs.entity
        ) {
          return false;
        }
      }
      return true;
    });
  }
}

/* * * * * *
 * Service
 * * * * * */

type Source = "mod" | "user";

interface IService {
  namespace: IServiceNamespace;
  description?: string;
  source?: Source;
  getName(): Name;
  getNameFriendly(): string;
}

export interface ServiceReq {
  namespace: ServiceNamespaceReq;
  description?: string;
  source?: Source;
}

export class Service implements IService {
  namespace: IServiceNamespace;
  description?: string;
  source?: Source;

  constructor(req: ServiceReq) {
    this.namespace = new Namespace(req.namespace);
    if (!this.namespace.service) {
      throw new Error("Service name is required");
    }
    this.description = req.description;
    this.source = req.source;
  }

  getName(): Name {
    return this.namespace.service!;
  }

  getNameFriendly(): string {
    return this.namespace.service!.toCapital();
  }
}

/* * * * * *
 * Type
 * * * * * */

export interface ITypeMinimal {}

/* * * * * *
 * Type Info
 * * * * * */

interface ITypeInfo<T extends ITypeMinimal = any> {
  namespace: ITypeNamespace;
  fields: IField[];
  getField(name: string): IField;
  getTypeName(r: T): string;
  getEmptyObject(appInfo: App): Omit<T, MetaFieldKeys>;
}

export interface TypeInfoReq<T extends ITypeMinimal = any> {
  namespace: TypeNamespaceReq;
  fields: FieldReq[];
  getEmptyObjectFunc?: (appInfo: App) => Omit<T, MetaFieldKeys>;
}

export class TypeInfo<T extends ITypeMinimal = any> implements ITypeInfo<T> {
  namespace: ITypeNamespace;
  fields: Field[] = [];
  fieldsMap: Record<string, Field> = {};

  constructor(req: TypeInfoReq<T>) {
    this.namespace = new Namespace(req.namespace);
    this.fields = req.fields.map((f) => new Field<any, T>(f));
    this.fields.forEach((f) => {
      this.fieldsMap[f.name.toRaw()] = f;
    });
    if (req.getEmptyObjectFunc) {
      this.getEmptyObjectFunc = req.getEmptyObjectFunc;
    }
  }

  getField(name: string): IField {
    return this.fieldsMap[name];
  }

  getTypeName(r: any): string {
    return r.id;
  }

  getEmptyObject(appInfo: App): Omit<T, MetaFieldKeys> {
    return this.getEmptyObjectFunc(appInfo);
  }

  getEmptyObjectFunc = (appInfo: App): Omit<T, MetaFieldKeys> => {
    return {} as T;
  };
}

/* * * * * *
 * Type Field
 * * * * * */

interface IField<T = any, ParentT = any> {
  name: Name;
  dtype: IDtype<T>;
  isRepeated?: boolean;
  isOptional?: boolean;
  isMetaField?: boolean;
  getLabel(): string;
  getFieldValue(obj: ParentT): T;
}

export interface FieldReq<T = any, ParentT = any> {
  name: Name;
  dtype: DtypeReq<T>;
  isRepeated?: boolean;
  isMetaField?: boolean;
  excludeFromForm?: boolean;
  isOptional?: boolean;
}

export class Field<T = any, ParentT = any> implements IField<T, ParentT> {
  name: Name;
  dtype: IDtype<T>;
  isRepeated?: boolean;
  isMetaField?: boolean;
  excludeFromForm?: boolean;
  isOptional?: boolean | undefined;

  constructor(req: FieldReq<T>) {
    this.name = req.name;
    this.dtype = new Dtype<T>(req.dtype);
    this.isRepeated = req.isRepeated;
    this.isMetaField = req.isMetaField;
    this.excludeFromForm = req.excludeFromForm;
    this.isOptional = req.isOptional;
  }

  getLabel(): string {
    return this.getLabelFunc(this);
  }
  // Default (Overidable)
  getLabelFunc = (field: Field<T, ParentT>): string => {
    return field.name.toCapital();
  };

  getFieldValue(obj: ParentT): T {
    // Loop though all the fields in the object and get the value for this field
    const _obj: any = obj;
    return _obj[this.name.toFieldName()] as T;
  }
}

/* * * * * *
 * Type Field Dtype
 * * * * * */

interface IDtype<T = any> {
  name: Name;
  kind: IFieldKind;
  namespace?: IEntityNamespace | ITypeNamespace | IEnumNamespace;
  getEmptyValue(appInfo: App): T | undefined | null;
}

// TypeToNamespace is a type that takes a type and returns the namespace type.
// If T is Entity, then it returns IEntityNamespace.
// If T is Type, then it returns ITypeNamespace.
// Otherwise it returns IEnumNamespace or undefined. There is not way to detect if T is an Enum.
// type TypeToNamespace<T> = T extends ITypeMinimal ? ITypeNamespace : T extends IEntityMinimal ? IEntityNamespace : IEnumNamespace | INamespace | undefined

export interface DtypeReq<T = any> {
  name: Name;
  kind: IFieldKind;
  namespace?: EntityNamespaceReq | TypeNamespaceReq | EnumNamespaceReq;
}

export class Dtype<T = any> implements IDtype {
  name: Name;
  kind: IFieldKind;
  namespace?: IEntityNamespace | ITypeNamespace | IEnumNamespace;

  constructor(req: DtypeReq) {
    this.name = req.name;
    this.kind = req.kind;
    if (req.namespace) {
      this.namespace = new Namespace(req.namespace) as
        | IEntityNamespace
        | ITypeNamespace
        | IEnumNamespace;
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
        throw new Error(
          "ForeignEntity field does not have a reference namespace"
        );
      }
      if (!this.namespace.entity) {
        throw new Error("ForeignEntity field does not have a reference entity");
      }
    }
  }

  getEmptyValue(appInfo: App): T | undefined | null {
    // Only point in getting the empty value is for nested fields
    switch (this.kind) {
      case ForeignEntityKind:
        return undefined;
      case EnumKind: {
        return undefined;
      }
      case NestedKind: {
        // Get the type info for the nested field
        const ns = this.namespace as ITypeNamespace;
        if (!ns) {
          throw new Error("Nested field does not have a reference namespace");
        }
        // Assert that T is ITypeMinimal
        const fieldTypeInfo = appInfo.getTypeInfo<ITypeMinimal>(
          ns.toRaw() as TypeNamespaceReq
        );
        if (!fieldTypeInfo) {
          throw new Error("Type Info not found for field");
        }

        return fieldTypeInfo.getEmptyObject(appInfo) as T;
      }
      default:
        return undefined;
    }
  }
}

/* * * * * *
 * Entity
 * * * * * */

export interface IEntityMinimal extends ITypeMinimal, IMetaFields {}
export type IEntityMinimalInput<E extends IEntityMinimal> = Omit<
  E,
  MetaFieldKeys
>;

/* * * * * *
 * Entity Info
 * * * * * */

interface IEntityInfo<E extends IEntityMinimal> {
  namespace: IEntityNamespace;
  actions: IEntityAction[];
  associations: IEntityAssociation[];
  getTypeNamespace(): ITypeEntityNamespace;
  getTypeInfo(appInfo: App): TypeInfo<E>;
  getName(): Name;
  getNameFriendly(): string;
  getEntityName(r: E): string;
  getEntityNameFriendly(r: E): string;
}

export interface EntityInfoReq<E extends IEntityMinimal = any> {
  namespace: EntityNamespaceReq;
  actions: EntityActionReq[];
  associations: EntityAssociationReq[];
}

export class EntityInfo<E extends IEntityMinimal> implements IEntityInfo<E> {
  namespace: IEntityNamespace;
  associations: IEntityAssociation[] = [];
  actions: EntityAction[] = [];

  constructor(req: EntityInfoReq) {
    this.namespace = new Namespace(req.namespace) as IEntityNamespace;
    req.actions.forEach((elem) => {
      this.actions.push(new EntityAction(elem));
    });
    req.associations.forEach((elem) => {
      this.associations.push(new EntityAssociation(elem));
    });
    if (!this.namespace.service || !this.namespace.entity) {
      throw new Error("Service and Entity name is required");
    }
  }

  getTypeNamespace(): ITypeEntityNamespace {
    // Take the entity namespace and add the type to it
    const ns = new Namespace({
      service: this.namespace.service!.toRaw(),
      entity: this.namespace.entity!.toRaw(),
      types: [this.namespace.entity!.toRaw()],
    });
    return ns as ITypeEntityNamespace;
  }

  getTypeInfo(appInfo: App): TypeInfo<E> {
    return appInfo.getTypeInfo<E>(
      this.getTypeNamespace().toRaw() as TypeNamespaceReq
    );
  }

  getName(): Name {
    return this.namespace.entity!;
  }

  getNameFriendly(): string {
    return this.funcGetNameFriendly(this);
  }
  // Default (Overidable)
  funcGetNameFriendly = (info: EntityInfo<E>): string => {
    return info.getName().toCapital();
  };

  getEntityName(r: E): string {
    return this.funcGetEntityName(r, this);
  }
  // Default (Overidable)
  funcGetEntityName = function (r: E, info: EntityInfo<E>): string {
    const _r: any = r;
    let name: string = r.id;
    if (_r.name) {
      // Simple string name
      if (typeof _r.name === "string") {
        name = _r.name;
      } else if (_r.name.firstName && _r.name.lastName) {
        // Person Name (First + Last)
        name = `${_r.name.firstName} ${_r.name.lastName}`;
      }
    } else if (_r.title) {
      name = _r.title;
    } else if (_r.key) {
      name = _r.key;
    }

    if (r.deletedAt) {
      name += " (Deleted)";
    }
    return name;
  };

  getEntityNameFriendly(r: E): string {
    return this.funcGetEntityNameFriendly(r, this);
  }
  // Default (Overidable)
  funcGetEntityNameFriendly = function (r: E, info: EntityInfo<E>): string {
    return info.getEntityName(r);
  };
}

/* * * * * *
 * Entity Association
 * * * * * */

interface IEntityAssociation {
  relationship: "child_of" | "parent_of";
  type: "one" | "many";
  entityNamespace: IEntityNamespace;
  name: Name;
  otherAssociationName?: Name;

  toFieldName(): Name;
}

export interface EntityAssociationReq {
  relationship: "child_of" | "parent_of";
  type: "one" | "many";
  entityNamespace: EntityNamespaceReq;
  name: Name;
  otherAssociationName?: Name;
}

export class EntityAssociation implements IEntityAssociation {
  relationship: "child_of" | "parent_of";
  type: "one" | "many";
  entityNamespace: IEntityNamespace;
  name: Name;
  otherAssociationName?: Name;

  constructor(req: EntityAssociationReq) {
    this.relationship = req.relationship;
    this.type = req.type;
    this.entityNamespace = new Namespace(req.entityNamespace);
    this.name = req.name;
    this.otherAssociationName = req.otherAssociationName;
  }

  toFieldName(): Name {
    if (this.relationship === "child_of") {
      return this.type === "one"
        ? this.name.append("id")
        : this.name.append("ids");
    }
    throw new Error(
      "assoctaion.toFieldName() not implemented for associations of type `parent_of`. This is because the parent entity does not have a field for the child entity."
    );
  }
}

/* * * * * *
 * Entity Action
 * * * * * */

interface IEntityAction {
  name: Name;
  getLabel(): string;
  methodNamespace: IMethodEntityNamespace;
}

interface EntityActionReq {
  name: Name;
  methodNamespace: MethodEntityNamespaceReq;
}

class EntityAction implements IEntityAction {
  name: Name;
  methodNamespace: IMethodEntityNamespace;

  constructor(req: EntityActionReq) {
    this.name = req.name;
    this.methodNamespace = new Namespace(req.methodNamespace);
  }

  getLabel(): string {
    return this.name.toCapital();
  }
}

/* * * * * *
 * Enum
 * * * * * */

interface IEnum {
  namespace: IEnumNamespace;
  values: IEnumValue[];
}

export interface EnumReq {
  namespace: EnumNamespaceReq;
  values: EnumValueReq[];
}

export class Enum implements IEnum {
  namespace: IEnumNamespace;
  values: IEnumValue[] = [];

  constructor(req: EnumReq) {
    this.namespace = new Namespace(req.namespace);
    req.values.forEach((elem) => {
      this.values.push(new EnumValue(elem));
    });
    if (!this.namespace.enum) {
      throw new Error("Enum namespace does not have a reference enum");
    }
  }
}

/* * * * * *
 * Enum Values
 * * * * * */

interface IEnumValue {
  id: number;
  value: string;
  description?: string;
  getDisplayValue(): string;
}

export interface EnumValueReq {
  id: number;
  value: string;
  description?: string;
  displayValue?: string;
}

export class EnumValue implements IEnumValue {
  id: number;
  value: string;
  description?: string;
  displayValue?: string;

  constructor(req: EnumValueReq) {
    this.id = req.id;
    this.value = req.value;
    this.description = req.description;
    this.displayValue = req.displayValue;
  }

  getDisplayValue(): string {
    return this.displayValue || capitalCase(this.value);
  }
}

/* * * * * *
 * Method
 * * * * * */

interface IMethod<ReqT = any, RespT = any> {
  namespace: IMethodNamespace;
  apis: MethodAPI[];
  requestDtype?: IDtype<ReqT>;
  responseDtype?: IDtype<RespT>;
  // requestTypeNamespace?: ITypeNamespace
  // responseTypeNamespace: ITypeNamespace
  getAPI(): MethodAPI | undefined;
  // getAPIEndpoint(): string
  // makeAPIRequest(req: reqT): Promise<GokuHTTPResponse<resT>>
}

export interface MethodReq {
  namespace: MethodNamespaceReq;
  requestDtype?: DtypeReq;
  responseDtype: DtypeReq;
  // requestTypeNamespace?: TypeNamespaceReq
  // responseTypeNamespace: TypeNamespaceReq
  apis: MethodAPIReq[];
}

export class Method<reqT = any, resT = any> implements IMethod<reqT> {
  namespace: IMethodNamespace;
  requestDtype?: Dtype<reqT>;
  responseDtype?: Dtype<reqT>;
  // responseTypeNamespace: ITypeNamespace
  apis: MethodAPI[];

  constructor(req: MethodReq) {
    this.namespace = new Namespace(req.namespace) as IMethodNamespace;
    if (req.requestDtype) {
      this.requestDtype = new Dtype(req.requestDtype);
    }
    if (req.responseDtype) {
      this.responseDtype = new Dtype(req.responseDtype);
    }
    this.apis = req.apis.map((api) => new MethodAPI(api));

    if (!this.namespace.service || !this.namespace.method) {
      throw new Error("Service and Method name is required");
    }
  }

  getAPI(): MethodAPI | undefined {
    if (this.apis.length > 0) {
      return this.apis[0];
    }
  }

  // getAPIEndpoint(): string {
  //     if (this.apis.length === 0) {
  //         throw new Error('No API found for method')
  //     }
  //     const api = this.apis[0]
  //     return joinURL('v' + api.version, this.namespace.toURLPath(), api.path)
  // }
}

/* * * * * *
 * Method - API
 * * * * * */

interface MethodAPIReq {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  version: number;
  methodNamespace: MethodNamespaceReq;
}

class MethodAPI {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  relPath: string;
  version: number;
  methodNamespace: IMethodNamespace;

  constructor(req: MethodAPIReq) {
    this.method = req.method;
    this.relPath = req.path;
    this.version = req.version;
    this.methodNamespace = new Namespace(req.methodNamespace);
  }

  getEndpoint(): string {
    return joinURL(
      "v" + this.version,
      this.methodNamespace.toURLPath(),
      this.relPath
    );
  }

  makeAPIRequest<ReqT = any, RespT = any>(
    req: ReqT
  ): Promise<GokuHTTPResponse<RespT>> {
    console.debug(
      "[MethodAPI] [makeAPIRequest]",
      "namespace",
      this.methodNamespace.toString(),
      "req",
      req
    );
    const relPath = this.getEndpoint();
    return makeRequest<RespT>({
      relativePath: relPath,
      method: this.method,
      data: req,
    });
  }
}

/* * * * * *
 * Field
 * * * * * */

export interface IMetaFields {
  id: scalars.ID;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IMetaFieldWithParentID extends IMetaFields {
  parentID: scalars.ID;
}

/* * * * * *
 * Field Kind
 * * * * * */

// IFieldKind describes what category a field falls under e.g. Number, Date, Money, Foreign Object etc.
export interface IFieldKind {
  readonly name: string;
}

const DefaultFieldKind = {
  name: "default",
};

export const StringKind: IFieldKind = {
  ...DefaultFieldKind,
  name: "string",
};

export const NumberKind: IFieldKind = {
  ...DefaultFieldKind,
  name: "number",
};

export const FloatKind: IFieldKind = {
  ...DefaultFieldKind,
  name: "float",
};

export const BoolKind: IFieldKind = {
  ...DefaultFieldKind,
  name: "boolean",
};

export const DateKind: IFieldKind = {
  ...DefaultFieldKind,
  name: "date",
};

export const TimestampKind: IFieldKind = {
  ...DefaultFieldKind,
  name: "timestamp",
};

export const IDKind: IFieldKind = {
  ...StringKind,
  name: "id",
};

export const EmailKind: IFieldKind = {
  ...StringKind,
  name: "email",
};

export const LinkKind: IFieldKind = {
  ...StringKind,
  name: "link",
};

export const SecretDecryptableKind: IFieldKind = {
  ...StringKind,
  name: "secret_decryptable",
};

export const GenericDataKind: IFieldKind = {
  ...StringKind,
  name: "generic data",
};

export const MoneyKind: IFieldKind = {
  ...NumberKind,
  name: "money",
};

export const EnumKind: IFieldKind = {
  ...DefaultFieldKind,
  name: "enum",
};

// NestedKind refers to fields that represent sub-types or sub-objects. Basically types that are made of other fields.
export const NestedKind: IFieldKind = {
  ...DefaultFieldKind,
  name: "nested",
};

// ForeignEntityKind refers to fields that reference another entity
export const ForeignEntityKind: IFieldKind = {
  ...DefaultFieldKind,
  name: "foreign_entity",
};

// ForeignEntityKind refers to fields that reference another entity
export const FileKind: IFieldKind = {
  ...ForeignEntityKind,
  name: "file",
};

export const ConditionKind: IFieldKind = {
  ...DefaultFieldKind,
  name: "condition",
};

/* * * * * *
 * Filters
 * * * * * */

export enum Operator {
  EQUAL = "EQUAL",
  NOT_EQUAL = "NOT_EQUAL",
  IN = "IN",
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_EQUAL = "GREATER_THAN_EQUAL",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_EQUAL = "LESS_THAN_EQUAL",
  LIKE = "LIKE",
  ILIKE = "ILIKE",
  NOT_LIKE = "NOT_LIKE",
  IS_NULL = "IS_NULL",
  IS_NOT_NULL = "IS_NOT_NULL",
}

export interface GenericCondition<T> {
  op: Operator;
  values: T[];
}

export interface StringCondition extends GenericCondition<string> {}
export interface NumberCondition extends GenericCondition<number> {}
export interface FloatCondition extends GenericCondition<number> {}
export interface BoolCondition extends GenericCondition<boolean> {}
export interface DateCondition extends GenericCondition<Date> {}
export interface TimestampCondition extends GenericCondition<Date> {}
export interface IDCondition extends GenericCondition<scalars.ID> {}
export interface EmailCondition extends GenericCondition<scalars.Email> {}

/* * * * * *
 * AI generated
 * * * * * */

/**
 * Ongoku-specific configuration
 */
export interface OngokuConfig {
  apiEndpoint?: string;
  authToken?: string;
}

/**
 * Ongoku-specific App extension
 */
export class OngokuApp extends App {
  // Additional Ongoku-specific state
  private _initialized: boolean = false;
  readonly apiEndpoint?: string;
  readonly authToken?: string;

  constructor(req: AppReq, config?: OngokuConfig) {
    super(req);
    this.apiEndpoint = config?.apiEndpoint;
    this.authToken = config?.authToken;
  }

  // Getter methods for Ongoku-specific state
  get isInitialized(): boolean {
    return this._initialized;
  }

  // Setter methods for Ongoku-specific state
  setInitialized(value: boolean): void {
    this._initialized = value;
  }

  // Create a simplified clone for immutability
  clone(): OngokuApp {
    const newApp = new OngokuApp(
      {
        name: this.name,
        services: [],
        entityInfos: [],
        typeInfos: [],
        enums: [],
        methods: [],
      },
      {
        apiEndpoint: this.apiEndpoint,
        authToken: this.authToken,
      }
    );

    newApp.setInitialized(this._initialized);
    return newApp;
  }
}

/**
 * Helper to create a default minimal AppReq
 */
export const createDefaultAppReq = (name = "ongoku"): AppReq => ({
  name: new Name(name),
  services: [],
  entityInfos: [],
  typeInfos: [],
  enums: [],
  methods: [],
});
