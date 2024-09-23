/* * * * *
 * File A
 * * * * */

export interface PrimaryNamespace<svcN = string | null, entN = string | null> {
    service: svcN
    entity: entN
}

export interface Namespace<svcN = string | null, entN = string | null, typN = string, enmN = string | null, mthdN = string | null> extends PrimaryNamespace<svcN, entN> {
    types: typN[]
    enum: enmN | null
    method: mthdN | null
}

export const toURL = (pns: PrimaryNamespace): string => {
    return `/${pns.service}/${pns.entity}`
}

/* * * * *
 * File B
 * Above Code Does not have access to the below code
 * * * * */

// type ServiceName = 'Auth' | 'User' | 'Product'

// type ServiceAuthEntityName = 'Secret'
// type ServiceUserEntityName = 'User' | 'Team'
// type ServiceProductEntityName = 'Product' | 'Order'

// type EntityName<S extends ServiceName | null> = S extends 'Auth'
//     ? ServiceAuthEntityName | null
//     : S extends 'User'
//     ? ServiceUserEntityName | null
//     : S extends 'Product'
//     ? ServiceProductEntityName | null
//     : null

// // Types
// type AppTypeName = 'PersonName' | 'Contact' | 'Address'

// type ServiceAuthTypeName = 'LoginRequest' | 'LoginResponse'
// type ServiceAuthEntitySecretTypeName = 'Secret'

// type ServiceUserTypeName = never
// type ServiceUserEntityUserTypeName = 'User'
// type ServiceUserEntityTeamTypeName = 'Team'

// type ServiceProductTypeName = never
// type ServiceProductEntityProductTypeName = 'Product' | 'ApplyActionRequest' | 'ApplyActionResponse'
// type ServiceProductEntityOrderTypeName = 'Order'

// type TypeName<S extends ServiceName | null = null, E extends EntityName<S extends ServiceName ? S : never> | null = null> = S extends 'Auth'
//     ? E extends 'Secret'
//         ? ServiceAuthEntitySecretTypeName
//         : ServiceAuthTypeName
//     : S extends 'User'
//     ? E extends 'User'
//         ? ServiceUserEntityUserTypeName
//         : E extends 'Team'
//         ? ServiceUserEntityTeamTypeName
//         : ServiceUserTypeName
//     : S extends 'Product'
//     ? E extends 'Product'
//         ? ServiceProductEntityProductTypeName
//         : E extends 'Order'
//         ? ServiceProductEntityOrderTypeName
//         : ServiceProductTypeName
//     : AppTypeName

// // Define a utility type to enforce the constraint
// type ValidNamespace<svcN extends ServiceName | null, entN extends EntityName<svcN> = EntityName<svcN>> = Namespace<svcN, EntityName<svcN>, TypeName<svcN, entN>, string, string>

// const typBImpl: ValidNamespace<'Auth', 'Secret'> = {
//     service: 'Auth',
//     entity: 'Secret',
//     type: [''],
// }
