
// Define these types here but allow the caller to override them

import { EntityMinimal } from "./common/Entity"

export type EntityName = string
export type ServiceName = string

export type EnumFieldFor<E extends EntityMinimal> = never
export type FilterTypeFor<E extends EntityMinimal> = never