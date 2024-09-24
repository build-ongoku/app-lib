// Define these types here but allow the caller to override them

import { AppInfo } from './common/App'
import { EntityMinimal } from './common/Entity'

export interface EnumFieldFor<E extends EntityMinimal> {}
export interface FilterTypeFor<E extends EntityMinimal> {}

// Function that returns the app info:
//  set to: import { newAppInfo } from 'goku.generated/types/types.generated'
// export let newAppInfo = () => new AppInfo({serviceInfos: [], typeInfos: []});
