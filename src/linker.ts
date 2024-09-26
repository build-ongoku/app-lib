// Define these types here but allow the caller to override them

import { IEntityMinimal } from '@ongoku/app-lib/src/common/app_v3'

export interface EnumFieldFor<E extends IEntityMinimal> {}
export interface FilterTypeFor<E extends IEntityMinimal> {}

// Function that returns the app info:
//  set to: import { newAppInfo } from 'goku.generated/types/types.generated'
// export let newAppInfo = () => new AppInfo({serviceInfos: [], typeInfos: []});
